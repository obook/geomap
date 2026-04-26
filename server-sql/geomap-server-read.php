<?php

require("geomap-server-config.php");

/*
 * Project: GeoMap
 * File: geomap-server-read.php
 * Description: Read users and messages from MySQL
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/*
 * On récupère les paramètres, exemple : "http://127.0.0.1/geo/server/geomap-server-read.php?mission=1111"
 */

	if( isset( $_REQUEST['mission']) )
	{
		$mission = htmlentities($_REQUEST['mission'], ENT_QUOTES, 'UTF-8');
	}
	else
	{
		echo 'geomap-server-read : parm-error '.__LINE__.' ';
		exit(1);
	}

	$connexion = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

	if( !$connexion )
	{
		echo "geomap-server-read : Le serveur de bases de données n'est pas actuellement disponible : ".mysqli_connect_error();
		exit(1);
	}

	mysqli_set_charset($connexion, 'utf8');

	/* Échappement de l'entrée utilisateur pour le SQL */
	$mission = mysqli_real_escape_string($connexion, $mission);

	$request = "SELECT * FROM geomap_users WHERE active != 0;";
	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-read : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	$usersonline_number = mysqli_num_rows($result);

	$request = "SELECT *
	FROM geomap_messages
	RIGHT JOIN geomap_users
	ON geomap_messages.userid = geomap_users.userid
	WHERE geomap_users.mission='$mission'
	AND geomap_users.active = 1
	GROUP BY geomap_users.userid
	ORDER BY geomap_messages.time ASC;";

	$result = mysqli_query( $connexion, $request );
	if( !$result )
	{
		echo "geomap-server-read : Erreur dans l'exécution de la commande ".$request. " : ".mysqli_error($connexion);
		mysqli_close($connexion);
		exit(1);
	}

	$data_json = "";
	$data_count = 0;

	if(mysqli_num_rows($result)>0)
	{
		while($row = mysqli_fetch_object($result))
		{
			$cur_user_data = ','.json_encode(array(
				'mission' => $row->mission,
				'userid' => $row->userid,
				'username' => $row->username,
				'latitude' => floatval($row->latitude),
				'state' => intval($row->state),
				'longitude' => floatval($row->longitude),
				'accuracy' => floatval($row->accuracy),
				'speed' => floatval($row->speed),
				'altitude' => floatval($row->altitude),
				'altitudeAccuracy' => floatval($row->altitudeAccuracy),
				'heading' => floatval($row->heading),
				'active' => intval($row->active),
				'frequency' => intval($row->frequency),
				'message' => $row->message,
				'time' => intval($row->time)
			));
			$data_json = $data_json.$cur_user_data;
			$data_count++;
		}
	}

	mysqli_close($connexion);

header('Content-type: application/json; charset=utf-8');
echo '{"users":[ '.json_encode(array('userid'=>'master','username'=>'master','total'=>$usersonline_number,'state'=>1,'time'=>time())).$data_json.' ],"hits":'.($data_count+1).',"type":"makers","pages":1,"date":'.time().'}';
exit;
?>
