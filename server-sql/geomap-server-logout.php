<?php

header("Refresh: 10; url=/index.php#bye"); /* in case of database pb */
require("geomap-server-config.php");

/*
 * Project: GeoMap
 * File: geomap-server-logout.php
 * Description: Mark a user inactive
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

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

	if( !isset( $_REQUEST['mission']) )
	{
		echo "geomap-server-logout : parm-error 1\n";
		echo " <a href='./index.php#bye'>Redirection ...</a>";
		exit(1);
	}
	$mission = htmlentities($_REQUEST['mission'], ENT_QUOTES, 'UTF-8');

	if( !isset( $_REQUEST['userid']) )
	{
		echo "geomap-server-logout : parm-error 2\n";
		echo " <a href='/'>Redirection ...</a>";
		exit(1);
	}
	$userid = htmlentities($_REQUEST['userid'], ENT_QUOTES, 'UTF-8');

	$connexion = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	if( !$connexion )
	{
		echo "<html><header><meta http-equiv='refresh' content='4;URL=../index.php#bye'></header><body>geomap-server-logout : Le serveur de bases de données n'est pas actuellement disponible : ".mysqli_connect_error()." <a href='../index.php#bye'>Please click here or wait ...</a></body></html>";
		exit(1);
	}

	mysqli_set_charset($connexion, 'utf8');

	/* Escape user input for SQL */
	$mission = mysqli_real_escape_string($connexion, $mission);
	$userid = mysqli_real_escape_string($connexion, $userid);

	$request =  "SELECT * FROM geomap_users WHERE userid='$userid' AND mission='$mission' LIMIT 1;";
	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		mysqli_close($connexion);
		echo "<html><header><meta http-equiv='refresh' content='4;URL=../index.php#bye'></header><body>geomap-server-logout : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion)." <a href='../index.php#bye'>Please click here or wait ...</a></body></html>";
		exit(1);
	}

	if(mysqli_num_rows($result)<=0)	/* NOT Exist */
	{
		mysqli_close($connexion);
		header("Location: ../index.php#bye");
		exit(0); /* It is not really an error here */
	}

	$request =  "UPDATE geomap_users SET active=0 WHERE (userid='$userid' AND mission='$mission');";
	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		/* Possible if geolocalization failed -> user without database record */
		mysqli_close($connexion);
		echo "<html><header><meta http-equiv='refresh' content='4;URL=../index.php#bye'></header><body>geomap-server-logout : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion)." <a href='../index.php#bye'>Please click here or wait ...</a></body></html>";
		exit(1);
	}

	/* NO ERROR -> REDIRECT */
	mysqli_close($connexion);
	header("Location: ../index.php#bye");
	echo "<html><header><meta http-equiv='refresh' content='3;URL=../index.php#bye'></header><body><a href='../index.php#bye'>Please click here or wait ...</a></body></html>";

	exit;

?>
