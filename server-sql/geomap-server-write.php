<?php

require("geomap-server-config.php");

/*
 * Project: GeoMap
 * File: geomap-server-write.php
 * Description: Persist user position to MySQL
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

$ip = "none";
$hostname = "";

$proxyip = "";
$proxyhostname = "";
$httpuseragent = "";

	if ( isset( $_SERVER["HTTP_X_FORWARDED_FOR"] ) )
	{
		$ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
		$hostname = @gethostbyaddr($_SERVER["HTTP_X_FORWARDED_FOR"]);

		$proxyip = $_SERVER["REMOTE_ADDR"];
		$proxyhostname = @gethostbyaddr($_SERVER["REMOTE_ADDR"]);

	}
	else
	{
		$ip = $_SERVER["REMOTE_ADDR"];
		$hostname = @gethostbyaddr($_SERVER["REMOTE_ADDR"]);
	}

	if ( isset( $_SERVER["HTTP_USER_AGENT"] ) )
	{
		$httpuseragent = $_SERVER["HTTP_USER_AGENT"];
	}

/*
 * On récupère les paramètres
 */

	if( !isset( $_REQUEST['active']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$active = htmlentities($_REQUEST['active'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['frequency']) )
	{
		echo 'geomap-server-write : Your position can not be recorded ! : parm-error '.__LINE__.' ';
		exit(1);
	}
	$frequency = htmlentities($_REQUEST['frequency'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['mission']) )
	{
		echo 'geomap-server-write : Your position can not be recorded ! : parm-error '.__LINE__.' ';
		exit(1);
	}
	$mission = htmlentities($_REQUEST['mission'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['userid']) )
	{
		echo 'geomap-server-write : Your position can not be recorded ! : parm-error '.__LINE__.' ';
		exit(1);
	}
	$userid = htmlentities($_REQUEST['userid'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['username']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$username=nl2br(htmlentities($_REQUEST['username'],ENT_QUOTES,'UTF-8'));

	if( !isset( $_REQUEST['state']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$state = htmlentities($_REQUEST['state'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['latitude']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$latitude = htmlentities($_REQUEST['latitude'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['longitude']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$longitude = htmlentities($_REQUEST['longitude'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['accuracy']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$accuracy = htmlentities($_REQUEST['accuracy'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['speed']) )
	{
		$speed = 0;
	}
	else
	{
		$speed = htmlentities($_REQUEST['speed'], ENT_QUOTES, 'UTF-8');
		if( $speed == 'NaN' )
		{
			$speed = -1;
		}
	}

	if( !isset( $_REQUEST['altitude']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$altitude = htmlentities($_REQUEST['altitude'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['altitudeAccuracy']) )
	{
		echo 'geomap-server-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$altitudeAccuracy = htmlentities($_REQUEST['altitudeAccuracy'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['heading']) )
	{
		$heading = -1;
	}
	else
	{
		$heading = htmlentities($_REQUEST['heading'], ENT_QUOTES, 'UTF-8');
		if( $heading == 'NaN' )
		{
			$heading = -1;
		}
	}

	$connexion = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	if( !$connexion )
	{
		echo "geomap-server-write : Le serveur de bases de données n'est pas actuellement disponible : ".mysqli_connect_error();
		exit(1);
	}

	mysqli_set_charset($connexion, 'utf8');

	/* Escape all user input for SQL */
	$active = mysqli_real_escape_string($connexion, $active);
	$frequency = mysqli_real_escape_string($connexion, $frequency);
	$mission = mysqli_real_escape_string($connexion, $mission);
	$userid = mysqli_real_escape_string($connexion, $userid);
	$username = mysqli_real_escape_string($connexion, $username);
	$state = mysqli_real_escape_string($connexion, $state);
	$latitude = mysqli_real_escape_string($connexion, $latitude);
	$longitude = mysqli_real_escape_string($connexion, $longitude);
	$accuracy = mysqli_real_escape_string($connexion, $accuracy);
	$speed = mysqli_real_escape_string($connexion, $speed);
	$altitude = mysqli_real_escape_string($connexion, $altitude);
	$altitudeAccuracy = mysqli_real_escape_string($connexion, $altitudeAccuracy);
	$heading = mysqli_real_escape_string($connexion, $heading);
	$ip = mysqli_real_escape_string($connexion, $ip);
	$hostname = mysqli_real_escape_string($connexion, $hostname);
	$proxyip = mysqli_real_escape_string($connexion, $proxyip);
	$proxyhostname = mysqli_real_escape_string($connexion, $proxyhostname);
	$httpuseragent = mysqli_real_escape_string($connexion, $httpuseragent);

	/*
	 * Check for update or create
	 */

	$request =  "SELECT * FROM geomap_users WHERE userid='$userid' AND mission='$mission' LIMIT 1;";
	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-write : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	if(mysqli_num_rows($result)>0)	/* Update */
	{
		$request =  "UPDATE geomap_users SET active=$active, ip='$ip', hostname='$hostname', proxyip='$proxyip', proxyhostname='$proxyhostname', httpuseragent='$httpuseragent',
		 username='$username',latitude='$latitude',longitude='$longitude',accuracy='$accuracy',speed='$speed',altitude='$altitude',altitudeAccuracy='$altitudeAccuracy',
		 heading='$heading',state='$state',frequency='$frequency',time=".time()."
		 WHERE (userid='$userid' AND mission='$mission');";
	}
	else /* insert */
	{
		$request =  "INSERT INTO geomap_users( active, ip, hostname, proxyip, proxyhostname, httpuseragent,
		 mission, userid , username, latitude, longitude, accuracy, speed, altitude, altitudeAccuracy, heading, state, frequency, time )
				VALUES( '$active', '$ip', '$hostname', '$proxyip', '$proxyhostname', '$httpuseragent',
		 '$mission', '$userid', '$username', '$latitude', '$longitude', '$accuracy', '$speed', '$altitude', '$altitudeAccuracy', '$heading', '$state','$frequency', ".time().")";
	}

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	/* Nouveau : on stocke dans une nouvelle table geomap_history */

	$request =  "INSERT INTO geomap_history( active, ip, hostname, proxyip, proxyhostname, httpuseragent, mission, userid , username, latitude, longitude, accuracy,
	 speed, altitude, altitudeAccuracy, heading, state, frequency, time )
				VALUES( '$active', '$ip', '$hostname', '$proxyip', '$proxyhostname', '$httpuseragent', '$mission', '$userid', '$username', '$latitude', '$longitude', '$accuracy',
	'$speed', '$altitude', '$altitudeAccuracy', '$heading', '$state','$frequency', ".time().")";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	mysqli_close($connexion);

	echo "position accepted for [".$username."] GPS=".$state;

exit;
?>
