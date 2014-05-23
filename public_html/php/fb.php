<?php
define("FB_EXIST_USER_CONNECTION", 200);


 if ($_POST["request_type"] == FB_EXIST_USER_CONNECTION) {
	//$fbdata_json = $_POST["fb_data"];
	//$fbdata_array = json_decode($fbdata);
	//print_r($fbdata_array);
	echo json_encode("itzik");
}

?>