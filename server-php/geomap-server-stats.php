<?php
/*
 * Project: GeoMap-Air
 * File: geomap-server-stats.php
 * Description: Usage statistics endpoint
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

require_once('geomap-json-storage.php');

header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

storage_init();

if (!isset($_REQUEST['mission'])) {
	echo 'geomap-server-stats : parm-error ' . __LINE__;
	exit(1);
}
$mission = sanitize($_REQUEST['mission']);

/* Load users and messages for this mission */
$users = load_json(users_file($mission));
$messages = load_json(messages_file($mission));

$msg_by_user = array();
foreach ($messages as $m) {
	$msg_by_user[$m['userid']] = $m['message'];
}

$data = array();
foreach ($users as $u) {
	$data[] = array(
		'mission' => $u['mission'],
		'userid' => $u['userid'],
		'username' => $u['username'],
		'latitude' => floatval($u['latitude']),
		'state' => intval($u['state']),
		'longitude' => floatval($u['longitude']),
		'accuracy' => floatval($u['accuracy']),
		'speed' => floatval($u['speed']),
		'altitude' => floatval($u['altitude']),
		'altitudeAccuracy' => floatval($u['altitudeAccuracy']),
		'heading' => floatval($u['heading']),
		'active' => intval($u['active']),
		'message' => isset($msg_by_user[$u['userid']]) ? $msg_by_user[$u['userid']] : null,
		'time' => intval($u['time'])
	);
}

$master = json_encode(array('userid' => 'master', 'username' => 'master', 'latitude' => 0, 'longitude' => 0, 'state' => 1, 'message' => '', 'time' => time()));
$users_json = '';
foreach ($data as $d) {
	$users_json .= ',' . json_encode($d);
}

echo '{"users":[ ' . $master . $users_json . ' ],"hits":' . (count($data) + 1) . ',"type":"makers","pages":1,"date":' . time() . '}';
exit;
