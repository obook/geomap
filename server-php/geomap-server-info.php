<?php
/*
 * Project : GeoMap
 * Server info/stats endpoint (JSON file version)
 * Copyright (c) Olivier Booklage
 * Dual licensed under the MIT and GPL licenses.
 */

require_once('geomap-json-storage.php');

header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

storage_init();

if (!isset($_REQUEST['id'])) {
	echo 'geomap-server-info : parm-error ' . __LINE__;
	exit(1);
}

if (!isset($_REQUEST['mission'])) {
	echo 'geomap-server-info : parm-error ' . __LINE__;
	exit(1);
}
$mission = sanitize($_REQUEST['mission']);

/* Count all active users across all missions */
$usersonline_number = 0;
$all_files = glob(DATA_DIR . '/users_*.json');
if ($all_files) {
	foreach ($all_files as $f) {
		$all = load_json($f);
		foreach ($all as $u) {
			if (isset($u['active']) && $u['active'] != 0) {
				$usersonline_number++;
			}
		}
	}
}

/* Load users and messages for this mission */
$users = load_json(users_file($mission));
$messages = load_json(messages_file($mission));

$msg_by_user = array();
foreach ($messages as $m) {
	$msg_by_user[$m['userid']] = $m['message'];
}

$data = array();
foreach ($users as $u) {
	if ($u['active'] != 1) {
		continue;
	}
	$data[] = array(
		'mission' => $u['mission'],
		'userid' => $u['userid'],
		'username' => $u['username'],
		'latitude' => floatval($u['latitude']),
		'state' => intval($u['state']),
		'battery' => intval(isset($u['battery']) ? $u['battery'] : -1),
		'longitude' => floatval($u['longitude']),
		'accuracy' => floatval($u['accuracy']),
		'speed' => floatval($u['speed']),
		'altitude' => floatval($u['altitude']),
		'altitudeAccuracy' => floatval($u['altitudeAccuracy']),
		'heading' => floatval($u['heading']),
		'active' => intval($u['active']),
		'frequency' => intval($u['frequency']),
		'message' => isset($msg_by_user[$u['userid']]) ? $msg_by_user[$u['userid']] : null,
		'time' => intval($u['time'])
	);
}

$master = json_encode(array('userid' => 'master', 'username' => 'master', 'total' => $usersonline_number, 'state' => 1, 'time' => time()));
$users_json = '';
foreach ($data as $d) {
	$users_json .= ',' . json_encode($d);
}

echo '{"users":[ ' . $master . $users_json . ' ],"hits":' . (count($data) + 1) . ',"type":"makers","pages":1,"date":' . time() . '}';
exit;
