<?php
die('hello');
$username = 'myyong';
$password = '150914_Bg';
$loginUrl = 'http://cif-xnat.hh.med.ic.ac.uk/app/template/Login.vm';

echo "test";
$data = array (
        'username' => 'myyong',
	'password' => '150914_Bg'
        );

$params = '';

foreach($data as $key=>$value)
	$params .= $key.'='.$value.'&';
         
$params = trim($params, '&');

echo params

//init curl
$ch = curl_init();

//Set the URL to work with
//curl_setopt($ch, CURLOPT_URL, $loginUrl);

curl_setopt($ch, CURLOPT_URL, $loginUrl.'?'.$params ); //Url together with parameters
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Return data instead printing directly in Browser
    

// ENABLE HTTP POST
//curl_setopt($ch, CURLOPT_GET, 1);

//Set the post parameters
//curl_setopt($ch, CURLOPT_GETFIELDS, 'u='.$username.'&p='.$password);

//Handle cookies for the login
//curl_setopt($ch, CURLOPT_COOKIEJAR, 'cookie.txt');

//Setting CURLOPT_RETURNTRANSFER variable to 1 will force cURL
//not to print out the results of its query.
//Instead, it will return the results as a string return value
//from curl_exec() instead of the usual true/false.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

//execute the request (the login)
//$store = curl_exec($ch);
curl_close($ch);

if(curl_errno($ch))  //catch if curl error exists and show it
  echo 'Curl error: ' . curl_error($ch);
else
  echo $result;

?>
