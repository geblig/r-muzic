var RMLogin = {};

RMLogin.enterButtonPressed = 0;
RMLogin.userConnectedAndAuthorized = 0;
RMLogin.lockWallpaperOverlay = 0;
RMLogin.constants = {
	'FB_NEW_USER_CONNECTION' : 200
};



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
	  RMLogin.FBuserConnect();
	  
	} else if (response.status === 'not_authorized') {
	  // The person is logged into Facebook, but not your app.
	  //RMLogin.FBuserConnect();
	  RMLogin.setLoginButton();
	  //document.getElementById('status').innerHTML = '';
	} else {
	  // The person is not logged into Facebook, so we're not sure if
	  // they are logged into this app or not.
	  RMLogin.setLoginButton();
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

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
RMLogin.FBuserConnect = function() {
	FB.login(function(response1) {
		console.log(response1);
		FB.api('/me', function(response) {
			var _url = "php/main.php";
			$.ajax({
				type: 'POST',
				url: _url,
				data: {
					fb_data: JSON.stringify(response),
					request_type: RMLogin.constants.FB_NEW_USER_CONNECTION
				},
				//dataType: 'JSON',
				success: function(result) {
					var _responseJson = result.replace(/<meta.*\/>.*\n/, "");
					console.log(_responseJson);
					RMLogin.userConnectedAndAuthorized = 1;
					if (RMLogin.enterButtonPressed == 1) {
					//$("#loginPageLoginWindow").hide();
						window.location.href = "/index.php";
						return false;
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert(errorThrown);
				}
			});
		});
	});
}
RMLogin.setLoginButton = function() {
	//var fbLoginHtml = "<fb:login-button scope=\"public_profile,email\" size=\"large\"  onlogin=\"checkLoginState();\"></fb:login-button><div id=\"status\"></div>"
	//$("#loginSection").html(fbLoginHtml);
}
RMLogin.init = function () {
	RMLogin.registerEvents();
}

RMLogin.registerEvents = function() {
	$("#loginButton").click(function(){
		
		if (RMLogin.userConnectedAndAuthorized == 1) {
			// user is authorized -> redirect to main page.
			window.location.href = "/index.php";
			return false;
		} else { // user is unauthorized
			RMLogin.lockWallpaperOverlay = 1;
			RMLogin.enterButtonPressed = 1;
			$("#loginPageLoginWindow").fadeIn(400);
			$("#pageDarkOverlay").show();
			setTimeout(function() {
				RMLogin.lockWallpaperOverlay = 0;
			}, 1000);
		}
    });
	$("#wallpaperOverlay").click(function() {
		if (RMLogin.lockWallpaperOverlay == 0) {
			$("#loginPageLoginWindow").fadeOut(400);
			$("#pageDarkOverlay").hide();
		}
	});	
}