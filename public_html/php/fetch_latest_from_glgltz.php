<?php
define("GALGALATZ_TRACK_LIST_SIZE", 30);
header('X-Frame-Options: GOFORIT');

$con=mysqli_connect("localhost","itzik1677","Sigi1!1980","db_r_muzic");

if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

mysql_set_charset('utf8',$con); 
$con->query("SET NAMES 'utf8'");

$query="SELECT * FROM `tbl_tracks` ORDER BY `time` DESC LIMIT " . GALGALATZ_TRACK_LIST_SIZE;

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

//$rows = array();
//while($r = mysql_fetch_assoc($result)) {
 //   $rows[] = $r;
//}
//echo json_encode($rows);
//mysqli_close($con);


?>