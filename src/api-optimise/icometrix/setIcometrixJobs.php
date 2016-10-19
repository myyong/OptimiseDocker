<?php

include_once("../config.php");
include_once("../utilities.php");

define ("ICOMETRIX_TABLE", "jobs");
define ("ICOMETRIX_DB", "icometrix");

$connection = db_connect(ICOMETRIX_DB);
if($connection==null)
{
    echo ("No connection");
    ReturnException(Internal_Error,500);
    return;
}
$icometrix = $connection->selectCollection(ICOMETRIX_TABLE);

echo $_SERVER['REQUEST_METHOD'];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $data = file_get_contents('php://input'); //get POST payload=
    $json = json_decode($data, true);
    if ($json == null) {
        echo "JSON ERROR";
        return;
    }
    $result = $icometrix->insert($json);
    echo "Result: ".$result;
    echo "RECORD(s) SUCCESSFULLY INSERTED";
    return;
}
else {
    echo "UNKNOWN METHOD";
}

?>