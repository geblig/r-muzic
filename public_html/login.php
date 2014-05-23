<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="en">
	<head>
		<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css" />
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js"></script>
		<script type="text/javascript" src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
		<script type="text/javascript" src="js/login.js"></script>
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<style> body {margin: 0; padding: 0} </style>
		<title> r-muzic, explore music, find, listen </title><html>
	</head>
	<script>
		$(document).ready(function() { 
			RMLogin.init();
		});
	</script>
	<body>
		<div id="loginPageMainContainer">
			
			<div id="wallpaperOverlay">
				<div id="rmuzicSlogan">
					<div id="rMuzicLogo"> </div>
					<h1> Explore your favorite music</h1>
					<button id="loginButton">Enter</button>
				</div>
				<div id="loginPageLoginWindow">
					<div id="logoSection"></div>
					<div id="loginSection">
						<fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
						</fb:login-button>
					</div>
				</div>
				<div id="pageDarkOverlay"></div>
			</div>
			
		</div>
	</body>
</html>