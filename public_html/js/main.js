var RM = {};
RM.currentChart = [];
RM.lastFMdata = [];
RM.settings = [];
RM.starredTracks = [];
RM.currentlyPlayingData = [];
RM.currentlyPlayingData.currentlyPlayingID = "";
RM.currentlyPlayingData.currentArtistPicture;
RM.currentlyPlayingData.currentArtistName;
RM.currentlyPlayingData.currentArtistContent;
RM.currentlyPlayingData.currentArtistSummary;
RM.currentlyPlayingData.currentViews;
RM.currentlyPlayingData.div = "";
RM.currentlyPlayingData.lastTrackId = "";
RM.currentlyPlayingData.currentlyPlayingID = "";
RM.currentlyPlayingData.currentlyPlayingYoutubeID = "";
RM.currentlyPlayingData.currentlyPlayingTrackIndex = "";
RM.currentlyPlayingData.nextTrackIndex = "";
RM.currentChartIndex = "";
		
/* currentlyPlayingType = ALBUM, TOP_TRACKS, GALGALATZ_CHART_LAST_PLAYED, ...*/
RM.currentlyPlayingData.currentlyPlayingType = "";


RM.nextTrackToPlay = [];


RM.constants = {
	'LAST_PLAYLIST' : 10,
	'MOST_PLAYED' : 11,
	'ALBUM_TRACKS_LIST' : 50,
	'ARTIST_TOP_TRACK_LIST' : 51,
	'STARRED' : 12,
	'GALGALATZ_CHANNEL' : 1000,
	'CAPITAL_FM_CHANNEL' : 1001,
	'SKYFM80S_CHANNEL': 1002,
	'SKYFM_CLASSIC_ROCK_CHANNEL': 1003,
	'SKYFM_SOFT_ROCK_CHANNEL': 1004,
	'SKYFM_ALTERNATIVE_ROCK_CHANNEL': 1005,
	'ABSOLUTE_RADIO_80S_CHANNEL': 1006,
	'GALGALATZ_LAST_PLAYED' : 100,
	'CAPITAL_FM_LAST_PLAYED' : 101,
	'GALGALATZ_MOST_PLAYED' : 102,
	'CAPITAL_FM_MOST_PLAYED' : 103,
	'LASTFM_DATA' : 20,
	'LASTFM_ARTIST_TOP_ALBUMS' : 21,
	'LASTFM_ALBUM_TRACKS' : 22,
	'LASTFM_ARTIST_TOP_TRACKS' : 23,
	'PLAYER_NOT_INITIALIZED' : -1,
	'PLAYER_ENDED' : 0,
	'PLAYER_PLAYING' : 1,
	'PLAYER_PAUSED' : 2,
	'PLAYER_BUFFERING' : 3,
	'PLAYER_CUED' : 5
};
RM.lockRadioItemOptionsRawClickFlag = 0;

var player;


/*********************************** Facebook ***************************************************/

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
	  // Logged into your app and Facebook.
	  // This case we are redirecting the user to r-muzic.com/index.php
	  RM.setUserInfo();
	} else if (response.status === 'not_authorized') {
	  // The person is logged into Facebook, but not your app.
	  //RMLogin.FBuserConnect();
	  //RMLogin.setLoginButton();
	  //document.getElementById('status').innerHTML = '';
	  console.log("Not authorized");
	} else {
	  console.log("Unconnected");	
	  // The person is not logged into Facebook, so we're not sure if
	  // they are logged into this app or not.
	  //RMLogin.setLoginButton();
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : '755162961189939',
		cookie     : true,  // enable cookies to allow the server to access 
							// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.0' // use version 2.0
	});

	// Now that we've initialized the JavaScript SDK, we call 
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}	(document, 'script', 'facebook-jssdk'));

/*************************************************************************************************************************/


function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '190',
		width: '250',
		playerVars: {
            controls: 0,
            showinfo: 1 ,
			autoplay: 0,
            modestbranding: 1,
			rel: 0,
			videoid: 'iRYvuS9OxdA'
        },
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
	//event.target.playVideo();
	RM.init();
	//RM.facebookLoginInitialize();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		$("#youtubeToolbarPlay").hide();
		$("#youtubeToolbarPause").show();
	} else if (event.data == YT.PlayerState.PAUSED) {
		$("#youtubeToolbarPlay").show();
		$("#youtubeToolbarPause").hide();
	} else if (event.data == YT.PlayerState.ENDED) {
		RM.playNextTrackOnChartList();
		//$("#youtubeToolbarPlay").show();
		//$("#youtubeToolbarPause").hide();
	}
}

function stopVideo() {
	player.stopVideo();
}


RM.init = function () {
	RM.registerEvents();
	RM.setInitialSettings();
	RM.fetchChart(RM.constants.LAST_PLAYLIST, RM.constants.GALGALATZ_CHANNEL);
}

RM.setUserInfo = function() {
	FB.api('/me', function(response) {
		$("#userPicBox").css("background-image", "url(\"https://graph.facebook.com/" + response.id + "/picture\")");
		$("#userWelcomeCaption").text("Hello, " + response.first_name);
	});
}
RM.initialFirstTrackOnList = function() {
	var _currentTrack = RM.currentChart[0];
	RM.fetchLastFMdataAndSetCurrentlyPlayingInfo(_currentTrack.artist, _currentTrack.views, RM.constants.LASTFM_DATA);
	//RM.playTrack(_currentTrack);
}
RM.playTrack = function(track) {
	
	
	//var $trackDiv = $("#" + track.youtube + "_" + RM.currentlyPlayingData.currentlyPlayingTrackIndex);
	
	if (RM.lockRadioItemOptionsRawClickFlag == 1) {
		return;
	}
	var _artist = track.artist;
	var _views  = track.views;
	var _youtube = track.youtube;
	
	$("#currentTrackInfoRightSideArtistInfo").hide();
		
	RM.fetchLastFMdataAndSetCurrentlyPlayingInfo(_artist, _views, RM.constants.LASTFM_DATA);
	
	if (RM.currentlyPlayingData.currentlyPlayingID != "" && RM.currentlyPlayingData.lastTrackId != _youtube + "_" + RM.currentlyPlayingData.currentlyPlayingTrackIndex) {
		if (typeof RM.currentlyPlayingData.lastDiv != "undefined" && RM.currentlyPlayingData.lastDiv != "") {
			RM.currentlyPlayingData.lastDiv.removeClass("MainTrackListBoxItemClicked");
		}
	}
	
	
	RM.currentlyPlayingData.div.addClass("MainTrackListBoxItemClicked");
	
	
		
	//RM.currentlyPlayingData.currentlyPlayingID = _youtube;
	
	$("#youtubeToolbarPlay").hide();
	$("#youtubeToolbarPause").show();
	player.loadVideoById(_youtube);
}
RM.fetchStarred = function() {
	if ($.jStorage.get("starred") == null) {
		console.log("First time = jstorage is empty");
	} else {
		console.log("jStorage is valid");
		return $.jStorage.get("starred");
	}
}
RM.setInitialSettings = function() {
	RM.settings.currentPlayList = RM.constants.LAST_PLAYLIST;
	RM.settings.currentChannel = RM.constants.GALGALATZ_CHANNEL;
}
RM.fetchLastFMdataAndSetCurrentlyPlayingInfo = function(_artist, _views, _type) {
	//$("#currentTrackInfoPicture").css("background-image", "url(\"/img/loading.gif\")");
	$("#currentTrackInfoPicture").addClass("Loading");
	var _url = "php/main.php?type=" + _type + "&artist=" + _artist;
	$.get(_url, function(response) {
		$("#currentTrackInfoPicture").removeClass("Loading");
		var responseParsed = response.replace(/<meta.*\/>/, "");
		RM.lastFMdata = JSON.parse(responseParsed);
		RM.setLastFMdata();
		if (RM.currentlyPlayingData.currentArtistPicture != "") {
			$("#currentTrackInfoPicture").css("background-image", "url(" + RM.currentlyPlayingData.currentArtistPicture + ")");
		} else {
			$("#currentTrackInfoPicture").css("background-image", "url(\"/img/no_image.jpg\")");
		}
		$("#currentTrackInfoPicture").attr("title", RM.currentlyPlayingData.currentArtistName);
		RM.currentlyPlayingData.currentViews = _views;
		RM.setInfoDataOnDiv();
	});
}

RM.setLastFMdata = function() {
	if (RM.lastFMdata.error > 0) {
		RM.currentlyPlayingData.currentArtistPicture = "";
		RM.currentlyPlayingData.currentArtistName = "";
		RM.currentlyPlayingData.currentArtistContent = "";
		RM.currentlyPlayingData.currentArtistSummary = "";
		//RM.currentlyPlayingData.currentlyPlayingID = "";
		return;
	}
	RM.currentlyPlayingData.currentArtistPicture = RM.lastFMdata.artist.image[3]['#text'];
	RM.currentlyPlayingData.currentArtistName = RM.lastFMdata.artist.name;
	RM.currentlyPlayingData.currentArtistContent = RM.lastFMdata.artist.bio.content;
	RM.currentlyPlayingData.currentArtistSummary = RM.lastFMdata.artist.bio.summary;
	RM.currentlyPlayingData.mbid = RM.lastFMdata.artist.mbid;
}

RM.setInfoDataOnDiv = function(_views) {
	var _artistName = RM.currentlyPlayingData.currentArtistName;
	if (_artistName.length > 14) {
		_artistName = RM.currentlyPlayingData.currentArtistName.substring(0, 14) + "...";
	}
	$("#currentTrackInfoLeftSideInfoTrackName").text(_artistName);
	$("#currentTrackInfoLeftSideInfoTrackName").attr("title", RM.currentlyPlayingData.currentArtistName);
	$("#currentTrackInfoLeftSideInfoTrackViews").text("(" + RM.currentlyPlayingData.currentViews +" views)");
	if (RM.currentlyPlayingData.currentArtistName != "") {
		$("#currentTrackInfoLeftSideInfoMoreAlbums").show();
		$("#currentTrackInfoLeftSideInfoMoreAlbums").text("more of " + _artistName);
	} else {
		$("#currentTrackInfoLeftSideInfoMoreAlbums").hide();
	}
	$("#currentTrackInfoLeftSideInfoMoreAlbums").attr("title", "more of " + RM.currentlyPlayingData.currentArtistName + " ...");
	$("#currentTrackInfoLeftSideInfoMoreAlbums").attr("data", RM.currentlyPlayingData.mbid);
	$("#currentTrackInfoRightSideArtistInfo").html(RM.currentlyPlayingData.currentArtistSummary);
	if (RM.currentlyPlayingData.currentArtistContent != "") {
		$("#currentTrackInfoRightSideArtistInfo").fadeIn(400);
	}
}
jQuery.fn.swap = function(b){ 
    // method from: http://blog.pengoworks.com/index.cfm/2008/9/24/A-quick-and-dirty-swap-method-for-jQuery
    b = jQuery(b)[0]; 
    var a = this[0]; 
    var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
    b.parentNode.insertBefore(a, b); 
    t.parentNode.insertBefore(b, t); 
    t.parentNode.removeChild(t); 
    return this; 
};

RM.registerEvents = function() {
	$(".MainTrackListBoxItem").live("mouseenter", function() {
		$(this).draggable({
			revert: true,
			snapMode: "inner",
			snapTolerance: 40,			
			axis: "y"
		});
		$(this).droppable({
			drop: function (event, ui) {
				var dropped = ui.draggable;
				var droppedOn = this;
				var _t = $("#" + droppedOn.id).attr("data");
				$("#" + dropped.id).attr("data", _t);
				$("#" + droppedOn.id).attr("data", $("#" + dropped.id).attr("data"));
				dropped.swap(droppedOn);
			}
		});
		$(this).addClass("MainTrackListBoxItemHovered");
	});	
	$(".MainTrackListBoxItem").live("mouseleave", function() {
		$(this).removeClass("MainTrackListBoxItemHovered");
	});	
	$(".MainTrackListBoxItem").live("click", function() {
		RM.setCurrentPlayingTrackProperties($(this));
		RM.playTrack(RM.currentChart[$(this).attr("data")]);
	});
	$(".MainTrackListBoxItem").live("mousedown", function() {
		$(this).css("z-index", "1000");
	});
	$(".MainTrackListBoxItem").live("mouseup", function() {
		$(this).css("z-index", "1");
	});
	$("#mainTrackList_trackRefreshImage").live("hover", function() {
		$(this).addClass("CursorPointer");
	});
	$("#mainTrackList_trackRefreshImage").live("click", function() {
		$("#mainTrackListBox").html("<div class=\"Loading\"></div>");
		if (RM.settings.currentPlayList == RM.constants.STARRED) {
			RM.showStarred();
		} else {
			RM.fetchChart(RM.settings.currentPlayList, RM.settings.currentChannel);
		}
	});
	$(".RadioItem").live("mouseenter", function() {
		$(this).addClass("RadioItemHover").addClass("CursorPointer");
	});
	$(".RadioItem").live("mouseleave", function() {
		$(this).removeClass("RadioItemHover").removeClass("CursorPointer");
	});
	$(".RadioItem").live("click", function() {
		
		var elem = $(this).find(".RadioItemOptions");
		if (elem.css("display") == "none") {
			elem.fadeIn(600);
		} else {
			elem.fadeOut(600);
		}
	});
	$(".RadioItemOptionsRaw").live("mouseenter", function() {
		$(this).addClass("RadioItemOptionsRawHover");
		
	});
	$(".RadioItemOptionsRaw").live("mouseleave", function() {
		$(this).removeClass("RadioItemOptionsRawHover");
	});
	$(".RadioItemOptionsRaw").live("click", function() {
		$('.RadioItem').each(function(i, obj) {
			$(this).removeClass("RadioItemActive");
		});
		$(this).parent().parent().addClass("RadioItemActive");
	});
	$("#radioItemOptionsGalgalatz_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.GALGALATZ_CHANNEL);
	});
	
	$("#radioItemOptionsCapitalFM_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.CAPITAL_FM_CHANNEL);
	});
	
	$("#radioItemOptionsSkyFM80s_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.SKYFM80S_CHANNEL);
	});
	
	$("#radioItemOptionsSkyFMClassicRock_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.SKYFM_CLASSIC_ROCK_CHANNEL);
	});
	$("#radioItemOptionsSkyFMSoftRock_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.SKYFM_SOFT_ROCK_CHANNEL);
	});
	$("#radioItemOptionsSkyFMAlternativeRock_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.SKYFM_ALTERNATIVE_ROCK_CHANNEL);
	});
	$("#radioItemOptionsAbsoluteRadio80s_lastTracks").live("click", function() {
		RM.showChart(RM.constants.LAST_PLAYLIST, RM.constants.ABSOLUTE_RADIO_80S_CHANNEL);
	});
	
	$("#radioItemOptionsCapitalFM_mostPlayed").live("click", function() {
		RM.showChart(RM.constants.MOST_PLAYED, RM.constants.CAPITAL_FM_CHANNEL);
	});
	
	$("#radioItemOptionsGalgalatz_mostPlayed").live("click", function() {
		RM.showChart(RM.constants.MOST_PLAYED, RM.constants.GALGALATZ_CHANNEL);
	});
	
	$("#currentTrackInfoLeftSideInfoMoreAlbums").live("mouseenter", function() {
		$(this).addClass("CursorPointer");
	});
	$("#currentTrackInfoLeftSideInfoMoreAlbums").live("mouseleave", function() {
		$(this).removeClass("CursorPointer");
	});
	
	$(".MainTrackListBoxItem_trackStarred").live("click", function() {
		if ($(this).hasClass("MainTrackListBoxItem_trackStarredActive")) 
		{
			$(this).removeClass("MainTrackListBoxItem_trackStarredActive");
			RM.removeFromStarred(RM.currentChart[$(this).attr("data")]);
			if (RM.settings.currentPlayList == RM.constants.STARRED) {
				RM.showStarred();
			}
			
		} else {
			$(this).addClass("MainTrackListBoxItem_trackStarredActive");
			RM.addToStarred(RM.currentChart[$(this).attr("data")]);
		}
		RM.lockRadioItemOptionsRawClickFlag = 1;
		setTimeout(function() {
			RM.lockRadioItemOptionsRawClickFlag = 0;
		}, 1000);

	});
	$(".MainTrackListBoxItem_trackStarred").live("mouseenter", function() {
		$(this).addClass("MainTrackListBoxItem_trackStarredHover");
	});
	$(".MainTrackListBoxItem_trackStarred").live("mouseleave", function() {
		$(this).removeClass("MainTrackListBoxItem_trackStarredHover");
	});
	$("#starredListIcon").live("click", function() {
		RM.settings.currentPlayList = RM.constants.STARRED;
		RM.settings.currentChannel = RM.constants.STARRED;
		RM.showStarred();
	});
	$(".YoutubePlayerControl").mouseenter(function() {
		$(this).addClass("CursorPointer");
	});
	$(".YoutubePlayerControl").mouseleave(function() {
		$(this).removeClass("CursorPointer");
	});
	$("#youtubeToolbarPlay").click(function() {
		$(this).hide();
		$("#youtubeToolbarPause").show();
		if (RM.getPlayerStatus() == RM.constants.PLAYER_PAUSED || RM.getPlayerStatus() == RM.constants.PLAYER_ENDED) {
			
			//var $trackDiv = $("#" + RM.currentlyPlayingData.currentlyPlayingID);
			var $trackDiv = RM.currentlyPlayingData.div;
			$trackDiv.addClass("MainTrackListBoxItemClicked");
			player.playVideo();
		} else {
			// It's a new video
			RM.playTrack(RM.currentChart[0]);
		}
	});
	$("#youtubeToolbarPause").click(function() {
		$(this).hide();
		$("#youtubeToolbarPlay").show();
		player.pauseVideo();
	});
	$("#youtubeToolbarNext").click(function() {
		RM.playNextTrackOnChartList();
	});
	$("#youtubeToolbarPrevious").click(function() {
		RM.playPreviousTrackOnChartList();
	});
	
	$("#currentTrackInfoLeftSideInfoMoreAlbums").live("click", function() {
		var _mbid = $(this).attr("data");
		$("#mainTrackList").hide();
		$("#mainArtistTopTracks").html("<div id=\"mainArtistTopTracksLoading\" class=\"Loading\">");
		$("#mainArtistAlbums").show();
		$("#mainArtistAlbumsContainer").html("<div id=\"mainArtistAlbumsContainerLoading\" class=\"Loading\">");
		RM.fetchArtistTopTracksFromLastFM(_mbid);
		RM.fetchArtistAlbumsFromLastFM(_mbid);
	});
	
	$(".AlbumWrapperLink").live("click", function() {
		var artistMbid = $(this).attr("mbid");
		var artistName = $(this).attr("artist_name");
		var albumName = $(this).attr("album_name");
		var _url = "php/main.php?type=" + RM.constants.LASTFM_ALBUM_TRACKS + "&mbid=" + artistMbid + "&artist_n=" + artistName + "&album_n=" + albumName;
		$("#mainArtistAlbums").hide();
		$("#mainTrackListBox").html("<div class=\"Loading\"></div>");
		$("#mainTrackList").show();
		$.get(_url, function(response) {
			var responseParsed = response.replace(/<meta.*\/>/, "");
			var albumTracks = JSON.parse(responseParsed);
			RM.showAlbumTracks(albumTracks);
		});
	});
}
RM.setCurrentPlayingTrackProperties = function(clickedTrack) {
		if (typeof RM.currentlyPlayingData.div != "undefined") {
			RM.currentlyPlayingData.lastDiv = RM.currentlyPlayingData.div;
		} else {
			RM.currentlyPlayingData.lastDiv = clickedTrack;
		}
		RM.currentlyPlayingData.div = clickedTrack;
		RM.currentlyPlayingData.lastTrackId = RM.currentlyPlayingData.currentlyPlayingID;
		RM.currentlyPlayingData.currentlyPlayingID = clickedTrack.attr("id"); 
		RM.currentlyPlayingData.currentlyPlayingYoutubeID = clickedTrack.attr("youtube");
		RM.currentlyPlayingData.currentlyPlayingTrackIndex = clickedTrack.attr("data");
		RM.currentlyPlayingData.nextTrackIndex = parseInt(RM.currentlyPlayingData.currentlyPlayingTrackIndex, 10) + 1;
		
		/* currentlyPlayingType = ALBUM, TOP_TRACKS, GALGALATZ_CHART_LAST_PLAYED, ...*/
		RM.currentlyPlayingData.currentlyPlayingType = "";
}

RM.fetchArtistTopTracksFromLastFM = function(_mbid) {
	var _url = "php/main.php?type=" + RM.constants.LASTFM_ARTIST_TOP_TRACKS + "&mbid=" + _mbid;
	$.get(_url, function(response) {
		var responseParsed = response.replace(/<meta.*\/>/, "");
		var artistTopTracks = JSON.parse(responseParsed);
		RM.showArtistTopTracks(artistTopTracks);
	});
}

RM.showArtistTopTracks = function(_artistTopTracks) {
	RM.currentChart = _artistTopTracks;
	RM.buildPlayListTree(RM.currentChart, RM.constants.ARTIST_TOP_TRACK_LIST, "mainArtistTopTracks");
}

RM.showAlbumTracks = function(_albumTracks) {
	
	RM.currentChart = _albumTracks;
	RM.buildPlayListTree(RM.currentChart, RM.constants.ALBUM_TRACKS_LIST, "mainTrackListBox");
	if (RM.getPlayerStatus() != RM.constants.PLAYER_PLAYING && RM.getPlayerStatus() != RM.constants.PLAYER_PAUSED) {
		RM.initialFirstTrackOnList();
	}
}
RM.showChart = function(chartType, channel) {
	$("#mainArtistAlbums").hide();
	$("#mainTrackList").show();
	$("#mainTrackListBox").html("<div class=\"Loading\"></div>");
	RM.fetchChart(chartType, channel);
	RM.settings.currentPlayList = chartType;
	RM.settings.currentChannel = channel;
}
RM.fetchArtistAlbumsFromLastFM = function(artistMbid) {
	var _url = "php/main.php?type=" + RM.constants.LASTFM_ARTIST_TOP_ALBUMS + "&mbid=" + artistMbid;
	$.get(_url, function(response) {
		var responseParsed = response.replace(/<meta.*\/>/, "");
		var artistAlbums = JSON.parse(responseParsed);
		RM.showArtistAlbums(artistAlbums);
	});
}
RM.showArtistAlbums = function(_artistAlbums) {
	var artistAlbumsPageHtml = "";
	$("#mainArtistAlbumsContainer").html("");
	var _albumName = "";
	var _artistName = "";
	if (typeof  _artistAlbums.topalbums.album == "undefined") {
		return;
	}
	var heightCheck = 0;
	for (var i = 0; i < _artistAlbums.topalbums.album.length; i++) {
		_albumName = _artistAlbums.topalbums.album[i].name;
		_artistName = _artistAlbums.topalbums.album[i].artist.name;
		if (_albumName.length >= 24) {
			_albumName = _artistAlbums.topalbums.album[i].name.substring(0, 24) + "...";
		}
		if (_artistName.length >= 24) {
			_artistName = _artistAlbums.topalbums.album[i].artist.name.substring(0, 24) + "...";
		}
		artistAlbumsPageHtml = artistAlbumsPageHtml + "<div id='albumWrapperLink_" + i + "'class='AlbumWrapperLink' album_name= '" + _artistAlbums.topalbums.album[i].name + "' artist_name='" +  _artistAlbums.topalbums.album[i].artist.name + "' mbid='" + _artistAlbums.topalbums.album[i].mbid  + "'><div class='AlbumWrapperLinkPicture' style=\"background-size: contain; background-image: url('" + _artistAlbums.topalbums.album[i].image[3]['#text'] + "')\"></div><div class='AlbumWrapperLinkData'><div class='AlbumWrapperLinkDataAlbumName'>" + _albumName + "</div><div class='AlbumWrapperLinkDataAlbumArtist'>" + _artistAlbums.topalbums.album[i].artist.name + "</div></div></div>";	
	}
	$("#mainArtistAlbumsContainer").html(artistAlbumsPageHtml);
	
	var _h = heightCheck;
	var cnt = 1;
	for (var i = 0; i < _artistAlbums.topalbums.album.length; i++) {
		heightCheck = $("#albumWrapperLink_" + i).position().top;
		if (heightCheck == _h) {
			cnt++;
			
		} else {
			_h = heightCheck;	
			if (cnt > 1) { break; }
		}
	}
	console.log("cnt:" + cnt);
	var _width = cnt * 218;
	$("#mainArtistAlbumsContainer").css("width", _width);	
}

RM.playNextTrackOnChartList = function() {
	RM.nextTrackToPlay = RM.fetchNextTrack();
	RM.playTrack(RM.nextTrackToPlay);
}
RM.playPreviousTrackOnChartList = function() {
	RM.nextTrackToPlay = RM.fetchPreviousTrack();
	RM.playTrack(RM.nextTrackToPlay);
}

RM.fetchPreviousTrack = function() {
	//if (typeof $("#" + RM.currentlyPlayingData.currentlyPlayingID).attr("data") == 'undefined') {
	if (typeof  RM.currentlyPlayingData.div.attr("data") == 'undefined') {
		$("#mainTrackListBox").scrollTop($("#mainTrackListBox")[0].scrollHeight);
		return RM.currentChart[0];
	}
	var _nextTrackId = parseInt(RM.currentlyPlayingData.div.attr("data"), 10) - 1;
	if (_nextTrackId < 0) {
		_nextTrackId = RM.currentChart.length - 1;
		$("#mainTrackListBox").scrollTop($("#mainTrackListBox")[0].scrollHeight);
	}
	
	RM.setCurrentPlayingTrackProperties($("#" + RM.currentChart[_nextTrackId].youtube + "_" + _nextTrackId + "_" + RM.currentChartIndex));
	return RM.currentChart[_nextTrackId];
}
RM.fetchNextTrack = function() {
	if (typeof RM.currentlyPlayingData.div.attr("data") == 'undefined') {
		$("#mainTrackListBox").scrollTop(0);
		return RM.currentChart[0];
	}
	var _nextTrackId = parseInt(RM.currentlyPlayingData.div.attr("data"), 10) + 1;
	if (_nextTrackId >= RM.currentChart.length) {
		_nextTrackId = 0;
		$("#mainTrackListBox").scrollTop(0);
	}
	
	RM.setCurrentPlayingTrackProperties($("#" + RM.currentChart[_nextTrackId].youtube + "_" + _nextTrackId + "_" + RM.currentChartIndex));
	
	
	return RM.currentChart[_nextTrackId];
}

RM.getPlayerStatus = function() {
	 var sStatus = player.getPlayerState(); 
     if (sStatus == -1) return RM.constants.PLAYER_NOT_INITIALIZED;
     else if (sStatus == 0) return RM.constants.PLAYER_ENDED;
     else if (sStatus == 1) return RM.constants.PLAYER_PLAYING;
     else if (sStatus == 2) return RM.constants.PLAYER_PAUSED;
     else if (sStatus == 3) return RM.constants.PLAYER_BUFFERING;
     else if (sStatus == 5) return RM.constants.PLAYER_CUED;
	 else return null;
}
RM.removeFromStarred = function(track) {
	if ($.jStorage.get("starred") != null) {
		RM.starredTracks = $.jStorage.get("starred");
	} else {
		return;
	}
	for(var i = 0; i < RM.starredTracks.length; i++) {
		if (RM.starredTracks[i].youtube == track.youtube) {
			RM.starredTracks.splice(i, 1);
			break;
		}
	}
	$.jStorage.set("starred", RM.starredTracks);
}

RM.addToStarred = function(track) {
	var _track = new Object();
	
	if ($.jStorage.get("starred") != null) {
		RM.starredTracks = $.jStorage.get("starred");
	}
	
	_track.youtube = track.youtube;
	_track.duration = track.duration;
	_track.artist = track.artist;
	_track.views = track.views;
	_track.track = track.track;
	
	RM.starredTracks.push(_track);
	
	$.jStorage.set("starred", RM.starredTracks);	
}

RM.showStarred = function() {
	$("#mainArtistAlbums").hide();
	$("#mainTrackList").show();
	$("#mainTrackListBox").html("<div class=\"Loading\"></div>");
	RM.currentChart = RM.fetchStarred();
	RM.buildPlayListTree(RM.currentChart, RM.constants.STARRED, "mainTrackListBox");
	if (RM.getPlayerStatus() != RM.constants.PLAYER_PLAYING && RM.getPlayerStatus() != RM.constants.PLAYER_PAUSED) {
		RM.initialFirstTrackOnList();
	}
}
RM.fetchChart = function(_chartType, _channel) {
	var _url = "php/main.php?type=" + _chartType + "&channel=" + _channel;
	$.get(_url, function(response) {
		var responseParsed = response.replace(/<meta.*\/>/, "");
		var _cChart = JSON.parse(responseParsed);
		RM.currentChart = _cChart[0];
		RM.buildPlayListTree(RM.currentChart, _chartType, "mainTrackListBox");
		if (RM.getPlayerStatus() != RM.constants.PLAYER_PLAYING && RM.getPlayerStatus() != RM.constants.PLAYER_PAUSED) {
			RM.initialFirstTrackOnList();
		} else {
			var $trackDiv = RM.currentlyPlayingData.div;
			$trackDiv.addClass("MainTrackListBoxItemClicked");
		}
	});
}

RM.buildPlayListTree = function(_chart, _chartType, targetDiv) {
	var playListHTML = "";
	var $targetDiv = $("#" + targetDiv);
	$targetDiv.html("");
	
	RM.currentChartIndex  = _chartType;
	
	for (var i = 0; i < _chart.length; i++) {
		var _colored = "";
		var _playCount = "";
		var _views = "";
		var _starred = "";
		var _duration = "";
		if (_chart[i].duration == null) {
			continue;
		} else {
			_duration = _chart[i].duration;
		}
		if (_chartType == RM.constants.STARRED) {
			_starred = "MainTrackListBoxItem_trackStarredActive";
		}
		if (i % 2 == 0) {
			_colored = "MainTrackListBoxItemColored";
		} else {
			_colored = "";
		}
		if (_chartType == RM.constants.MOST_PLAYED) {
			_playCount = "  (played " + _chart[i].count + "times)";
		} else {
			_playCount = "";
		}
		if (_chart[i].views == null) {
			_views = "";
		} else {
			_views = _chart[i].views;
		}
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"" + _colored + " MainTrackListBoxItem\" id=\"" + _chart[i].youtube + "_" + i + "_" + _chartType + "\" youtube=\"" + _chart[i].youtube + "\">";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_trackNumber\">" +  (i + 1) + "</div>";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_trackStarred " + _starred + "\"></div>";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_trackName\">" + _chart[i].track + "</div>";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_artistName\">" + _chart[i].artist + "</div>";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_trackTime\">" + _duration + _playCount + "</div>";
		playListHTML = playListHTML + "<div data=\"" + i + "\" class=\"MainTrackListBoxItem_raw MainTrackListBoxItem_trackViews\">" + _views + "</div>";
		playListHTML = playListHTML + "</div>";
	}
	$targetDiv.html(playListHTML);
}





