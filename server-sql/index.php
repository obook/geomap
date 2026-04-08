<?php

/*
 *
 *
 * Last commit by $Author: obooklage $
 * Date - $Date: 2012-01-24 10:09:02 +0100 (mar. 24 janv. 2012) $
 * Revision - $Rev: 276 $
 * Id : $Id: index.php 276 2012-01-24 09:09:02Z obooklage $
 *
 *
 * */



	echo "<!DOCTYPE html>\n";
	echo "<!--\n\n";	
	echo "/*\n";	
	echo "* GMA - GeoMap-Air © Olivier Booklage ".date("Y")." obooklage@free.fr all rights reserved.\n";
	// echo "* user_id=$user_id user_name=$user_name mission_id=$mission_id theme=$theme\n";
	echo "* \n";	
	echo "* \$Author: obooklage $\n";	
	echo "* \$Date: 2012-01-24 10:09:02 +0100 (mar. 24 janv. 2012) $\n";	
	echo "* \$Rev: 276 $\n";	
	echo "* \$Id: index.php 276 2012-01-24 09:09:02Z obooklage $\n";	
	echo "* \n";	
	echo "*/\n\n-->\n";

?>
<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />

<!-- Favicons 
<link rel='shortcut icon' type='image/x-icon' href='images/favicon.ico' />
<link rel='icon' type='image/png' href='images/favicon.png' />
-->
<link rel="icon" type="image/x-icon" href="../favicon.ico" />
<link rel='shortcut icon' type='image/x-icon' href='../favicon.ico' />

<!-- !!!!!! Google Chrome do NOT known 'device-width' -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">

<!-- In test : -->
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320"/>
<link rel="apple-touch-icon-precomposed" href="images/favicon.png">
<link rel="apple-touch-startup-image" href="images/splash.png">

<!-- SplashScreen for iPhone -->
<link rel="apple-touch-startup-image" href="../images/splash.png">

<!-- Run in full screen mode as appication on iPhone -->
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- Black status mode on iPhone -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />

<!-- Icon for iPhone -->
<link rel="apple-touch-icon" type='image/png' href="../images/geomap.png">

<!-- JQuery and JQuery-mobile -->
<link rel="stylesheet" href="../lib/jquery.mobile.css" />
<link rel="stylesheet" href="../lib/glossify_jquery_mobile_theme_1.0/jquery.mobile.glossify.theme.css" />
<script type="text/javascript" lang="JavaScript" charset="utf-8" src="../lib/jquery-1.7.1.js"></script> 
<script type="text/javascript">
    $(document).bind("mobileinit", function(){
        $.mobile.page.prototype.options.addBackBtn= true;
    });
</script>
<script type="text/javascript" lang="JavaScript" charset="utf-8" src="../lib/jquery.mobile.js"></script> 

<!-- CSS -->
<link rel="stylesheet" type="text/css" href="index.css" />

<title>GeoMap-Air © Manager</title>
	
</head>
<body>


	<!------------------------------------------------------- Start of home page ------------------------------------------------------->
	
	<div data-role="page" id="home" data-fullscreen="true" data-position="fixed" data-title="GeoMap © Manager" data-theme="a">	

		<div data-role="header" data-theme="a">
				<h1>GeoMap © Manager</h1>
		</div><!-- /header -->

		<!-- content -->
		<div class='content' data-role="content">	
						
			<!-- problems with <div data-role="fieldcontain"> so we use fieldset or just listview -->
							
			<ul data-role="listview" data-theme="a" data-inset="true" data-dividertheme="c" data-counttheme="e">
			
				<li data-theme="a">
					<center>Open, free and anonymous geolocalization gadget</center>
				</li>
				
				<li>							
					<label for="username-id">Name :</label>
					<input data-theme="c" type="text" id="username-id" name="username" value="NEW" title='6 alpha keys' placeholder="Your name" maxlength="8" />
					<label for="select-choice-mission-id">Team:</label>
					<input data-theme="c" type="number" id="select-choice-mission-id" name="select-choice-mission" value="1111" title="5 digits code from 1111 to 99999" placeholder="1111" min="1111" max="99999" />			
					<label for="latitude-id">Latitude :</label>
					<input data-theme="c" type="text" id="latitude-id" name="latitude" value="NEW" title='6 alpha keys' placeholder="Your name" maxlength="8" />
					<label for="longitude-id">Longitude :</label>
					<input data-theme="c" type="text" id="longitude-id" name="longitude" value="NEW" title='6 alpha keys' placeholder="Your name" maxlength="8" />
				</li>
				
			</ul>
			
			<a href="#map" id='submit-id' data-role="button" data-theme="g"><blink>ADD</blink></a>

			<!-- <center><img src='images/work-in-progress.png'></center> -->

		</div><!-- /content -->
		
	</div>
	<!-- /page -->
    	
</body>
</html>