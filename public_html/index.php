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
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en">
	<head>
		<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css" />
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js"></script>
		<script type="text/javascript" src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
		<script type="text/javascript" src="js/jStorage.js"></script>
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<style> body {margin: 0; padding: 0} </style>
		<title> r-muzic, explore your music </title><html>
		<script>
			$(document).ready(function() { 
				var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			});
		</script>
	</head>
	<body>
		  <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
		
		<div class="Container" id="mainContainer">
			<div id="header">
				<div id="userSection"> 
					<div id="userPicBox"> </div>
					<div id="userWelcomeCaption"> </div>
				</div>
			</div>
			<div id="leftToolbar">
				<div class="LeftToolbarItem" id="radioBox"> 
					<div class="RadioItem" id="radioItemGalgalatz">
						<div class="RadioItemCaption"> GALGALATZ </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsGalgalatz_lastTracks"> 
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
							<div class="RadioItemOptionsRaw" id="radioItemOptionsGalgalatz_mostPlayed">
								<div class="RadioItemOptionsCaption"> Show most played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemCapitalFM">
						<div class="RadioItemCaption"> Capital FM </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsCapitalFM_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemSkyFM80s">
						<div class="RadioItemCaption"> SkyFM 80's </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsSkyFM80s_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemSkyFMClassicRock">
						<div class="RadioItemCaption"> SkyFM Classic Rock </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsSkyFMClassicRock_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemSkyFMSoftRock">
						<div class="RadioItemCaption"> SkyFM Soft Rock </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsSkyFMSoftRock_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemSkyFMAlternativeRock">
						<div class="RadioItemCaption"> SkyFM Alternative Rock </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsSkyFMAlternativeRock_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					<div class="RadioItem" id="radioItemAbsoluteRadio80s">
						<div class="RadioItemCaption"> Absolute Radio 80's </div>
						<div class="RadioItemOptions">
							<div class="RadioItemOptionsRaw" id="radioItemOptionsAbsoluteRadio80s_lastTracks">
								<div class="RadioItemOptionsCaption"> Show last played tracks </div>
							</div>
						</div>
					</div>
					
				</div>
				<div class="LeftToolbarItem" id="playlistsBox"></div>
				<div class="LeftToolbarItem" id="starredList">
					<div id="starredListRaw">
						<!--<div id="starredListCaption"></div>-->
						<div id="starredListIcon" title="starred tracks"> </div>
					</div>
				</div>
				<div class="LeftToolbarItem" id="settingsBox"> </div>
				<div class="LeftToolbarItem" id="dummyBox"> </div>
				<div class="LeftToolbarItem" id="leftFooter">
					<a class="LeftFooterItem" id="termsOfConditions" href="toc/toc.pdf"> Terms Of Content</a>
					<div class="LeftFooterItem" id="leftFooterSeparator"> | </div>
					<a class="LeftFooterItem" id="privacyPolicy" href="pp/pp.pdf"> Privacy Policy</a>
				</div>
			</div>
			<div id="rightToolbar">
				<div id="youtubeBox">
					<div id="player"></div>
					<div id="youtubeToolbar">
						<div id="youtubeToolbarWrapper"> 
							<div class="YoutubePlayerControl" id="youtubeToolbarPrevious"> </div>
							<div class="YoutubePlayerControl" id="youtubeToolbarPlay"> </div>
							<div class="YoutubePlayerControl" id="youtubeToolbarPause"> </div>
							<div class="YoutubePlayerControl" id="youtubeToolbarNext"> </div>
						</div>
					</div>
					<div id="youtubeCurrentPlaying"></div>
				</div>
				<div id="playedTracksInfo"> </div>
			</div>
			<div id="mainMiddleContainer"> 
				<div id="currentTrackInfo">
					<div id="currentTrackInfoLeftSide">
						<div id="currentTrackInfoLeftSidePic">
							<div id="currentTrackInfoPictureWrapper">
								<div id="currentTrackInfoPicture">
								</div>
							</div>
							<div id="currentTrackInfoLeftSideInfo">
								<div id="currentTrackInfoLeftSideInfoTrackName"></div>
								<div id="currentTrackInfoLeftSideInfoTrackViews"></div>
								<div id="currentTrackInfoLeftSideInfoMoreAlbums"></div>
							</div>
						</div>
						
					</div>
					<div id="currentTrackInfoRightSide">
						<div id="currentTrackInfoRightSideArtistInfo"> </div>
					</div>
				</div>
				
				<div id="mainArtistAlbums">
					<div id="separationTracksTop">Top Tracks</div>
					<div id="mainTrackListHeader" class="TrackListHeader"> 
						<div id="mainTrackList_trackNumber" class="MainTrackListHeaderItem"></div>
						<div id="mainTrackList_trackName" class="MainTrackListHeaderItem">TRACK</div>
						<div id="mainTrackList_artistName" class="MainTrackListHeaderItem">ARTIST</div>
						<div id="mainTrackList_trackTime" class="MainTrackListHeaderItem">TIME</div>
						<div id="mainTrackList_trackViews" class="MainTrackListHeaderItem">VIEWS</div>
						<div id="mainTrackList_trackRefresh" class="MainTrackListHeaderItem">
							<div id="mainTrackList_trackRefreshImage" title="Refresh list">
								<img id="mainTrackList_trackRefreshImagePNG" src="img/refresh_icon.png"> </img>
							</div>
						</div>
					</div>
					<div id="mainArtistTopTracks">
						
					</div>
					<div id="separationTracksAlbums">Albums</div>
					<div id="mainArtistAlbumsContainer">
					</div>
				</div>
				<div id="mainTrackList">
					<div id="mainTrackListHeader" class="TrackListHeader"> 
						<div id="mainTrackList_trackNumber" class="MainTrackListHeaderItem"></div>
						<div id="mainTrackList_trackName" class="MainTrackListHeaderItem">TRACK</div>
						<div id="mainTrackList_artistName" class="MainTrackListHeaderItem">ARTIST</div>
						<div id="mainTrackList_trackTime" class="MainTrackListHeaderItem">TIME</div>
						<div id="mainTrackList_trackViews" class="MainTrackListHeaderItem">VIEWS</div>
						<div id="mainTrackList_trackRefresh" class="MainTrackListHeaderItem">
							<div id="mainTrackList_trackRefreshImage" title="Refresh list">
								<img id="mainTrackList_trackRefreshImagePNG" src="img/refresh_icon.png"> </img>
							</div>
						</div>
					</div>
					<div id="mainTrackListBox">
						<div class="MainTrackListBoxItem" id="mainTrackListBoxItem_rawPackage"> 
							
						</div>
					</div>
				</div>
			</div>
		</div>
		
    <script>		
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-50401124-1', 'r-muzic.com');
			ga('send', 'pageview');
	</script>		
	</body>
	
</html>