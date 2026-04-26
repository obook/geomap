<?php

require("geomap-server-config.php");

/*
 * Project: GeoMap-Air
 * File: geomap-server-message-write.php
 * Description: Persist a chat message to MySQL
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
		echo 'geomap-server-message-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	else
	{
		$active = htmlentities($_REQUEST['active'], ENT_QUOTES, 'UTF-8');
	}

	if( !isset( $_REQUEST['mission']) )
	{
		echo 'geomap-server-message-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$mission = htmlentities($_REQUEST['mission'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['userid']) )
	{
		echo 'geomap-server-message-write : parm-error '.__LINE__.' ';
		exit(1);
	}
	$userid = htmlentities($_REQUEST['userid'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['username']) )
	{
		$username='unknown';
	}
	else
	{
		$username = htmlentities($_REQUEST['username'], ENT_QUOTES, 'UTF-8');
	}

	if( !isset( $_REQUEST['message']) )
	{
		$message='';
	}
	else
	{	/* to UTF8 */
		$message=nl2br(htmlentities($_REQUEST['message'],ENT_QUOTES,'UTF-8'));
	}

	$connexion = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	if( !$connexion )
	{
		echo "Le serveur de bases de données n'est pas actuellement disponible : ".mysqli_connect_error();
		exit;
	}

	mysqli_set_charset($connexion, 'utf8');

	/* Escape all user input for SQL */
	$active = mysqli_real_escape_string($connexion, $active);
	$mission = mysqli_real_escape_string($connexion, $mission);
	$userid = mysqli_real_escape_string($connexion, $userid);
	$username = mysqli_real_escape_string($connexion, $username);
	$message = mysqli_real_escape_string($connexion, $message);
	$ip = mysqli_real_escape_string($connexion, $ip);
	$hostname = mysqli_real_escape_string($connexion, $hostname);
	$proxyip = mysqli_real_escape_string($connexion, $proxyip);
	$proxyhostname = mysqli_real_escape_string($connexion, $proxyhostname);
	$httpuseragent = mysqli_real_escape_string($connexion, $httpuseragent);

	/*
	 * Check for update or create
	 */

	$request =  "SELECT * FROM geomap_messages WHERE userid='$userid' AND mission='$mission' LIMIT 1;";
	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit;
	}

	if(mysqli_num_rows($result)>0)	/* Update */
	{
		$request =  "UPDATE geomap_messages SET active=$active, ip='$ip', hostname='$hostname', proxyip='$proxyip', proxyhostname='$proxyhostname', httpuseragent='$httpuseragent', mission='$mission', userid='$userid', username='$username', message='$message', time=".time()."
		 WHERE (userid='$userid' AND mission='$mission');";
	}
	else /* insert */
	{
		$request =  "INSERT INTO geomap_messages( active, ip, hostname, proxyip, proxyhostname, httpuseragent, mission, userid , username , message, time )
					VALUES( '$active', '$ip', '$hostname', '$proxyip', '$proxyhostname', '$httpuseragent', '$mission', '$userid', '$username', '$message', ".time().")";
	}

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit;
	}

	mysqli_close($connexion);

	echo "Your message [".$message."] is stored in SQL database !\n";

exit;
?>
