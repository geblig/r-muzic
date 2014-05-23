<?php
define("GALGALATZ_TRACK_LIST_SIZE", 30);
header('X-Frame-Options: GOFORIT');


$con=mysqli_connect("localhost","itzik1677","Sigi1!1980","db_r_muzic");

if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

mysql_set_charset('utf8',$con); 
$con->query("SET NAMES 'utf8'");

$query="SELECT name, artist, youtube, track, COUNT(name) FROM tbl_tracks GROUP BY name ORDER BY COUNT(name) DESC LIMIT 30";
//$query="Select name from tbl_tracks";

$result = mysqli_query($con, $query);
//echo json_encode(mysqli_fetch_array($result));
//while($row = mysqli_fetch_array($result)) {
//echo $row['artist'];
	//break;
///}

$array=array();
$i=0;       
while($row = mysqli_fetch_array($result))       
{
    foreach ($result as $key=>$value){
		if(!isset($array[$i])) {
			$array[$i] = array();
		}
	   $array[$i][$key] = $value;
    }
    $i++;
}     
echo json_encode($array);
?>