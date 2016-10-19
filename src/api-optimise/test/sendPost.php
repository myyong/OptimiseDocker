<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 21/09/2015
 * Time: 17:02
 */

$url = "http://localhost/wikihealth/api-optimise/optimise4c.php";
$url = parse_url($url);
$host = $url['host'];
$path = $url['path'];
//$data='{"CurrentRecord":[{"fieldName":"USUBJID","value":"OPT001"},{"fieldName":"CESEQ","value":0}],"NewRecord":[{"fieldName":"CESEV","value":"Severe"}]}';
$data='{"CurrentRecord":[{"fieldName":"USUBJID","value":"OPT001"},{"fieldName":"CESEQ","value":0}],"NewRecord":[{"fieldName":"CESEV","value":"Severe"}]}';
$url = $host;
$fp = fsockopen($url, 80,$errno, $errstr, 30);
if($fp) {
    $out = "POST $path HTTP/1.1\r\n";
    $out .= "Host:$host\r\n";
    $out .= "Content-Type: application/json\r\n";
    $out .= "token: 3ca99c1263d9f2110d7ff765eb0f4dec\r\n";
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
    fclose($fp);
    $result = explode("\r\n\r\n", $result, 2);
    var_dump($result);
    $header = isset($result[0]) ? $result[0] : '';
    $content = isset($result[1]) ? $result[1] : '';


    }
