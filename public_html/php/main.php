<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php

define("GALGALATZ_TRACK_LIST_SIZE", 200);
define("LASTFM_API", "327927be40a0df73e9a605e03c397d91");
define("GALGALATZ_CHANNEL", 1000);
define("CAPITAL_FM_CHANNEL", 1001);
define("SKYFM80S_CHANNE", 1002);
define("SKYFM_CLASSIC_ROCK_CHANNEL", 1003);
define("SKYFM_SOFT_ROCK_CHANNEL", 1004);
define("SKYFM_ALTERNATIVE_ROCK_CHANNEL", 1005);
define("ABSOLUTE_RADIO_80S_CHANNEL", 1006);
define("LAST_PLAYLIST", 10);
define("MOST_PLAYED", 11);
define("LASTFM_DATA", 20);
define("LASTFM_ARTIST_TOP_ALBUMS", 21);
define("LASTFM_ALBUM_TRACKS", 22);
define("LASTFM_ARTIST_TOP_TRACK", 23);
define("FB_NEW_USER_CONNECTION", 200);
define("FB_EXIST_USER_CONNECTION", 201);


//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

$con=mysqli_connect("localhost","itzik1677","Sigi1!1980","db_r_muzic");

if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

mysql_set_charset('utf8',$con); 
$con->query("SET NAMES 'utf8'");

$table = "";
$channel = $_GET["channel"];


if ($channel == GALGALATZ_CHANNEL) {
	$table = 'tbl_tracks'; 
} else if ($channel == CAPITAL_FM_CHANNEL) {
	$table = 'tbl_capitalFM_tracks';
} else if ($channel == SKYFM80S_CHANNE) {
	$table = 'tbl_SkyFM_80s_tracks';
} else if ($channel == SKYFM_CLASSIC_ROCK_CHANNEL) {
	$table = 'tbl_SkyFM_Classic_Rock';
} else if ($channel == SKYFM_SOFT_ROCK_CHANNEL) {
	$table = 'tbl_SkyFM_Soft_Rock';
} else if ($channel == SKYFM_ALTERNATIVE_ROCK_CHANNEL) {
	$table = 'tbl_SkyFM_Alternative_Rock';
} else if ($channel == ABSOLUTE_RADIO_80S_CHANNEL) {
	$table = 'tbl_AbsoluteRadio_80s';
}

if ($_GET["type"] == "" && $_POST["request_type"] == "") {
	return;
} else if ($_GET["type"] == LAST_PLAYLIST) { 
	// 10 -> fetch playlist
	$_query = "SELECT * FROM " . $table . " ORDER BY `time` DESC LIMIT " . GALGALATZ_TRACK_LIST_SIZE;
	$ret = fetch_galgalatz_playlist($_query, $con);
	echo $ret;
} else if ($_GET["type"] == MOST_PLAYED) { 
	// 11 -> fetch most played in the last week
	$_query = "SELECT name, artist, youtube, track, duration, COUNT(name) as 'count' FROM " . $table . " WHERE time > DATE_SUB(NOW(), INTERVAL 1 WEEK) GROUP BY name ORDER BY COUNT(name) DESC LIMIT " . GALGALATZ_TRACK_LIST_SIZE;
	$ret = fetch_galgalatz_playlist($_query, $con);
	echo $ret;
} else if ($_GET["type"] == LASTFM_DATA) { 
	// 1 -> get LASTFM artist picture
	//header('Content-Type: text/html; charset=utf-8');
	$artist = $_GET["artist"];
	$artist = str_replace(" ", "+", $artist);
	//$artist = "ברי%20סחרוף";
	$url="http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" . $artist . "&api_key=" . LASTFM_API . "&format=json&limit=5&autocorrect=1";
	//echo $url;
	//header('Content-Type: text/html; charset=utf-8');
	$json = file_get_contents($url);
	//header('Content-Type: text/html; charset=utf-8');
	echo $json;
} else if ($_GET["type"] == LASTFM_ARTIST_TOP_ALBUMS) {
	$mbid = $_GET["mbid"];
	$url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=" . $mbid . "&api_key=" . LASTFM_API . "&format=json&autocorrect=1";
	$json = file_get_contents($url);
	echo $json;
} else if ($_GET["type"] == LASTFM_ARTIST_TOP_TRACK) {
	$mbid = $_GET["mbid"];
	if ($mbid == "") {
		$artistName = str_replace(" ", "+", $_GET["artist_n"]);
		$url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" . $artistName . "&api_key=" . LASTFM_API . "&format=json&autocorrect=1&limit=25";
	} else {
		$url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=" . $mbid . "&api_key=" . LASTFM_API . "&format=json&autocorrect=1&limit=25";
	}
	$json = file_get_contents($url);
	$ret_array = json_decode($json);
	$tracks_array = $ret_array->toptracks->track;
	$ret_data = "";
	$ret_buja = array();
	for ($i = 0; $i < count($tracks_array); $i++) {
		$artist = $tracks_array[$i]->artist->name;
		if (count($tracks_array) == 1) {
			$ret_data = get_youtube_id($artist, $tracks_array->name);
			$ret_buja[$i] = $ret_data;
			break;
		}
		$ret_data = get_youtube_id($artist, $tracks_array[$i]->name);
		$ret_buja[$i] = $ret_data;
	}
	echo json_encode($ret_buja);
} else if ($_GET["type"] == LASTFM_ALBUM_TRACKS) {
	$mbid = $_GET["mbid"];
	if ($mbid == "") {
		$artistName = str_replace(" ", "+", $_GET["artist_n"]);
		$albumName = str_replace(" ", "+", $_GET["album_n"]);
		$url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" . LASTFM_API . "&artist=" . $artistName . "&album=" . $albumName . "&format=json&autocorrect=1";
		//echo $url;
	} else {
		$url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" . LASTFM_API . "&mbid=" . $mbid . "&format=json&autocorrect=1";
	}
	
	$json = file_get_contents($url);
	$ret_array = json_decode($json);
	//print_r($ret_array);
	
	$tracks_array = $ret_array->album->tracks->track;
	$artist = $ret_array->album->artist;
	$ret_data = "";
	$ret_buja = array();
	for ($i = 0; $i < count($tracks_array); $i++) {
		//$patternToYouTubeFetcher = str_replace(" ", "%20", $artist, $tracks_array[$i]->name);
		//echo $artist . ' ' . $tracks_array[$i]->name;
		if (count($tracks_array) == 1) {
			$ret_data = get_youtube_id($artist, $tracks_array->name);
			$ret_buja[$i] = $ret_data;
			break;
		}
		$ret_data = get_youtube_id($artist, $tracks_array[$i]->name);
		$ret_buja[$i] = $ret_data;
	}
	echo json_encode($ret_buja);
	//print_r($ret_buja);
	//$url = "http://gdata.youtube.com/feeds/api/videos?q=Scorpions%20Tease%20Me%20Please%20Me&orderby=viewCount&alt=json";
	//$json = file_get_contents($url);
	
	//echo $json;
} else if ($_POST["request_type"] == FB_EXIST_USER_CONNECTION) {
	
	// Do something...
	
	
} else if ($_POST["request_type"] == FB_NEW_USER_CONNECTION) {
	$fbdata_json = json_decode($_POST["fb_data"]);
	
	/*
	$fbdata_user_name = $fbdata_json->name;
	$fbdata_user_email = $fbdata_json->email;
	$fbdata_user_gender = $fbdata_json->gender;
	$fbdata_user_id = $fbdata_json->id;
	$fbdata_user_fname = $fbdata_json->first_name;
	$fbdata_user_lname = $fbdata_json->last_name;
	*/
	insertNewUserToDB($fbdata_json, $con);
	
}
function insertNewUserToDB($userJson, $connection) {
	$query = "SELECT * from tbl_users WHERE user_id = '" . $userJson->id . "'";
	$result = mysqli_query($connection, $query);
	$num_rows = mysqli_num_rows($result);
	
	if ($num_rows > 0) {
		// user already exists
		echo -1;
		return;
	} else {
		// new user
		
		$query = "INSERT INTO tbl_users(user_id, name, first_name, last_name, email, gender) VALUES ('" . $userJson->id . "','" . $userJson->name . "','" . $userJson->first_name . "','" . $userJson->last_name . "','" . $userJson->email . "','" . $userJson->gender . "')";
		//echo $query;
		$connection->query($query);
		echo $query;	
	}
}
function get_youtube_id($_artist, $_track_name) {
	$tubeRaw = array();
	$patternToYouTubeFetcher = str_replace(" ", "+", $_artist . ' ' . $_track_name);
	$url = "http://gdata.youtube.com/feeds/api/videos?q=" . $patternToYouTubeFetcher . "&orderby=relevance&alt=json&v=2";
	$url_source = json_decode(file_get_contents($url));
	$t = '$t';
	$group = 'media$group';
	$duration = 'yt$duration';
	$statistics = 'yt$statistics';
	$tubeID = $url_source->feed->entry[0]->id->$t;
	$_tubeID = explode(":", $tubeID);
	$tubeID = $_tubeID[count($_tubeID) - 1];
	$tubeDuration = $url_source->feed->entry[0]->$group->$duration->seconds;
	$tubeViews = $url_source->feed->entry[0]->$statistics->viewCount;
	//echo  '    ' . $tubeID . ' ' . $tubeDuration . ' ' . $tubeViews . '<br>';
	$tubeRaw['youtube'] = $tubeID;
	$tubeRaw['views'] = $tubeViews;
	$tubeRaw['duration'] = $tubeDuration;
	$tubeRaw['artist'] = $_artist;
	$tubeRaw['track'] = $_track_name;
	return $tubeRaw;
}
function fetch_galgalatz_playlist($query, $connection) { 
	$result = mysqli_query($connection, $query);
	$array=array();
	$i=0;       
	while($row = mysqli_fetch_array($result)) {
		foreach ($result as $key=>$value){
			if(!isset($array[$i])) {
				$array[$i] = array();
			}
		$array[$i][$key] = $value;
		}
		$i++;
	}     
	return json_encode($array);
}

?>

