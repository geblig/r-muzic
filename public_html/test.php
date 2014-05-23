<?php
//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
require "Facebook/facebook.php";

$facebook = new Facebook(array(
    'appId'  => 755162961189939,
    'secret' => a89e30e75895918826d69b793878a576,
));

$user = $facebook->getUser();
if ($user) {
  // The user is logged in
	//echo "user logged in";
  try {
    $user_profile = $facebook->api('/me');
    // Here : API call succeeded, you have a valid access token
	//echo "user has valid access token";
	
  } catch (FacebookApiException $e) {
    // Here : API call failed, you don't have a valid access token
    // you have to send him to $facebook->getLoginUrl()
	//echo "No valid access token - user is not authorized to the app ? ";
	header("Location: login.php");
	/*
	$facebook->getLoginUrl();
    $token = $facebook->getAccessToken();
	echo "token: $token";
	$facebook->setAccessToken($token);
	$user_profile = $facebook->api('/me');
	print_r($user_profile);
	*/
  }
} else {// else : the user is not logged in 
	header("Location: login.php");
}

?>