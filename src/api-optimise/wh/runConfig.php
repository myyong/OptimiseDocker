<?php
include_once("../config.php");
define ("username", "username");
define ("password", "password");
define ("email", "email");

$connection=db_connect();
if($connection==null)
{
    ReturnException(Internal_Error,500);
}
$users=$connection->selectCollection(USER_TABLE);
$clinicians=$connection->selectCollection(CLINICION_TABLE);
//$users->deleteIndex(array(username=>1,w_id=>1));
$username="test8";
$password="password";
$email="test@dfdg.com";
$w_id=5;

//$users->createIndex(array(username=>1,w_id=>1),array("unique"=>true));

//$clinicians->createIndex(array(username=>1),array("unique"=>true));
//$users->insert(array(username => $username, password => $password, email => email, w_id => $w_id)); //insert record
//$users->deleteIndex(array('username' => -1,w_id=>-11), array('unique' => true));


//change int to string
/*$users=$connection->selectCollection(USER_TABLE);
$allResults=[];
$searchQuery=null;
$cursor = $users->find();
foreach ( $cursor as $id => $value )
{
    $valueNew=$value;
    $valueNew['w_id']=(string)$value['w_id'];
    $users->update($value,$valueNew);
}*/