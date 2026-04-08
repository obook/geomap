<?php

require("geomap-server-config.php");

/*
 * Project : GeoMap
 * Maintenance cron for GeoMap server
 * Copyright (c) Olivier Booklage
 * Dual licensed under the MIT and GPL licenses.
 *
 * Last commit by $Author: obooklage $
 * Date - $Date: 2012-03-17 10:46:39 +0100 (sam. 17 mars 2012) $
 * Revision - $Rev: 317 $
 * Id : $Id: geomap-server-maintenance.php 317 2012-03-17 09:46:39Z obooklage $
 *
 *
 * */

header("Content-Type: text/plain");

	$message_life = 3600;		// 3600 = 60*60 = 60 mins time, in seconds

	// DOIT etre superieur a GLOBAL_MAXI_TTL (8 heures)
	// time, in seconds 36000 = 10*60*60 = 10 hours

	$user_disconnected = 259200;	/* status -1 disconnected by itself ( maps can remove )  : 72 hours 72*60*60=259200 => status 0 */
	$user_lost = 259200;			/* status -1 : 72 hours 72*60*60 =>  status 0 (inactive) */

	$user_unknown = 259200;			/* status 1 connected : 72 hours 72*60*60=259200 => status -1 ( maps can remove ) */

	$connexion = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	echo "Maintenance at ".time()."\n";

	if( !$connexion )
	{
		echo "geomap-server-maintenance : Le serveur de bases de données n'est pas actuellement disponible : ".mysqli_connect_error();
		exit(1);
	}

	mysqli_set_charset($connexion, 'utf8');

	/* Update to active=0 for old messages */

	$request =  "DELETE FROM geomap_messages WHERE time < ".(time()-($message_life))."; ";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-maintenance : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	echo $request." = ".mysqli_affected_rows($connexion)."\n";

	/* 1/ user logout : set to inactive .. */

	$request =  "UPDATE geomap_users SET active=0 WHERE ( time < ".(time()-($user_disconnected))." AND active = -2  ); ";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-maintenance : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	echo $request." = ".mysqli_affected_rows($connexion)."\n";

	/* 2/ lost since user_unknown : set to unknown */

	$request =  "UPDATE geomap_users SET active=-1 WHERE ( time < ".(time()-($user_unknown))." AND active != 0 AND active != 2  ); ";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-maintenance : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	echo $request." = ".mysqli_affected_rows($connexion)."\n";

	/* 3/ lost since user_unknown and then user_lost : set to inactive */

	$request =  "UPDATE geomap_users SET active=0 WHERE ( time < ".(time()-($user_lost))." AND active != 0 AND active != 2  ); ";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-maintenance : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	echo $request." = ".mysqli_affected_rows($connexion)."\n";

	/* 4/ Add maintenance date */

	$request =  "INSERT INTO geomap_system( time )
		VALUES(".time().")";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-maintenance : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	echo $request." = ".mysqli_affected_rows($connexion)."\n";


	mysqli_close($connexion);

	echo "maint done.";

exit;
?>
