<?php
//headers function
define("destinationURL",'ssl://central.xnat.org');
//define("destinationURL",'ssl://cif-xnat.hh.med.ic.ac.uk');
$server=$_SERVER;
//var_dump($server);
//return;
$pathInfo=$server['PATH_INFO'];
$queryString=$server['QUERY_STRING'];

$destinationURL=destinationURL.$pathInfo.'?'.$queryString;
//echo $destinationURL;
$response = proxy_request($server,$destinationURL); //raw response
//echo $response;

/*$file = 'log.txt';
$log = "John Smith\n";
file_put_contents($file, $log, FILE_APPEND | LOCK_EX);*/

$headerArray = explode("\r\n", $response['header']);
foreach($headerArray as $headerLine) {
    header($headerLine); //handle header
}
$finalReturn=$response['content'];
header('Access-Control-Allow-Origin: *');
echo isset($_GET['callback'])
    ? "{$_GET['callback']}($finalReturn)"
    : $finalReturn;


//functions below
if(!function_exists('apache_request_headers')) {
// Function is from: http://www.electrictoolbox.com/php-get-headers-sent-from-browser/
    function apache_request_headers() {
        $headers = array();
        foreach($_SERVER as $key => $value) {
            if(substr($key, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

function proxy_request($SERVER, $url)
{
    $ip = ''; //declare IP
//below update IP address
    if (!empty($SERVER['HTTP_CLIENT_IP'])) {
        $ip = $SERVER['HTTP_CLIENT_IP'];
        //echo "HTTP_CLIENT_IP: ".$ip;
    } elseif (!empty($SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $SERVER['HTTP_X_FORWARDED_FOR'];
        //echo "HTTP_X_FORWARDED_FOR: ".$ip;
    } else {
        $ip = $SERVER['REMOTE_ADDR'];
        //echo "REMOTE_ADDR: ".$ip;
    }
    $method = $SERVER['REQUEST_METHOD'];
    if($method=="POST")
    {
        $data=file_get_contents('php://input'); //get POST payload

    }else if($method=="GET")
    {
        $data=$_GET; //get GET parameters
    }else if($method=="DELETE")
    {
        $data=file_get_contents('php://input'); //get DELETE payload
    }
    $url = parse_url($url);
    $host = $url['host'];
    $path = $url['path'];

    $jsonData = '{"CurrentRecord":[{"fieldName":"USUBJID","value":"OPT001"},{"fieldName":"QSSEQ","value":0}],"NewRecord":[{"fieldName":"QSSTRESC","value":2}]}';
//    $jsonData=$data;
    $out = "";
    $url = $host;
//echo " JSON : $jsonData ";
    $fp = fsockopen('ssl://'.$url, 443,$errno, $errstr, 30);
    if($fp) {
        if ($method == "GET") {
            $data = http_build_query($data);
            $out = "GET $path?$data HTTP/1.1\r\n";
        } else if ($method == "POST") {
            $path=$path.'?'.$SERVER['QUERY_STRING'];
            $out = "POST $path HTTP/1.1\r\n";
        } else if ($method == "DELETE") {
            $path=$path.'?'.$SERVER['QUERY_STRING'];
            $out = "DELETE $path HTTP/1.1\r\n";
        }

//$out.= "Host: ".$parts['host']."\r\n";
        $out .= "Host:$host\r\n";
        $out .= "Content-Type: application/json\r\n";
        $out .= "Content-Length: " . strlen($data) . "\r\n";
        $out .= "Connection: Close\r\n\r\n";
        $out .= $data;
        fwrite($fp, $out);
//        header('Content-type: application/json');

        $result = '';
        while (!feof($fp)) {
            // receive the results of the request
            $result .= fgets($fp, 128);
        }
    }else{
        return array(
            'status' => 'err',
            'error' => "$errstr ($errno)"
        );
    }
    fclose($fp);
    $result = explode("\r\n\r\n", $result, 2);

    $header = isset($result[0]) ? $result[0] : '';
    $content = isset($result[1]) ? $result[1] : '';

    // return as structured array:
    return array(
        'status' => 'ok',
        'header' => $header,
        'content' => $content
    );
}


