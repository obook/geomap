<?php
/*
 * Project: GeoMap-Air
 * File: geomap-server-write.php
 * Description: Persist user position to JSON file
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

require_once('geomap-json-storage.php');

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

storage_init();

/* Required parameters */
$required = array('active', 'frequency', 'mission', 'userid', 'username', 'state', 'latitude', 'longitude', 'accuracy', 'altitude', 'altitudeAccuracy');
foreach ($required as $p) {
	if (!isset($_REQUEST[$p])) {
		echo 'geomap-server-write : parm-error ' . __LINE__ . ' (' . $p . ')';
		exit(1);
	}
}

$active = sanitize($_REQUEST['active']);
$frequency = sanitize($_REQUEST['frequency']);
$mission = sanitize($_REQUEST['mission']);
$userid = sanitize($_REQUEST['userid']);
$username = sanitize($_REQUEST['username']);
$state = sanitize($_REQUEST['state']);
$latitude = sanitize($_REQUEST['latitude']);
$longitude = sanitize($_REQUEST['longitude']);
$accuracy = sanitize($_REQUEST['accuracy']);
$altitude = sanitize($_REQUEST['altitude']);
$altitudeAccuracy = sanitize($_REQUEST['altitudeAccuracy']);

$speed = 0;
if (isset($_REQUEST['speed'])) {
	$speed = sanitize($_REQUEST['speed']);
	if ($speed === 'NaN') $speed = -1;
}

$heading = -1;
if (isset($_REQUEST['heading'])) {
	$heading = sanitize($_REQUEST['heading']);
	if ($heading === 'NaN') $heading = -1;
}

$battery = -1;
if (isset($_REQUEST['battery'])) {
	$battery = sanitize($_REQUEST['battery']);
}

$client = get_client_info();

/* Load existing users for this mission */
$filepath = users_file($mission);
$users = load_json($filepath);

/* Find existing user or create new entry */
$found = false;
foreach ($users as &$u) {
	if ($u['userid'] === $userid) {
		$u['active'] = intval($active);
		$u['username'] = $username;
		$u['state'] = intval($state);
		$u['latitude'] = floatval($latitude);
		$u['longitude'] = floatval($longitude);
		$u['accuracy'] = floatval($accuracy);
		$u['speed'] = floatval($speed);
		$u['altitude'] = floatval($altitude);
		$u['altitudeAccuracy'] = floatval($altitudeAccuracy);
		$u['heading'] = floatval($heading);
		$u['battery'] = intval($battery);
		$u['frequency'] = intval($frequency);
		$u['time'] = time();
		$u['ip'] = $client['ip'];
		$u['httpuseragent'] = $client['httpuseragent'];
		$found = true;
		break;
	}
}
unset($u);

if (!$found) {
	$users[] = array(
		'mission' => $mission,
		'userid' => $userid,
		'username' => $username,
		'active' => intval($active),
		'state' => intval($state),
		'latitude' => floatval($latitude),
		'longitude' => floatval($longitude),
		'accuracy' => floatval($accuracy),
		'speed' => floatval($speed),
		'altitude' => floatval($altitude),
		'altitudeAccuracy' => floatval($altitudeAccuracy),
		'heading' => floatval($heading),
		'battery' => intval($battery),
		'frequency' => intval($frequency),
		'time' => time(),
		'ip' => $client['ip'],
		'hostname' => $client['hostname'],
		'proxyip' => $client['proxyip'],
		'proxyhostname' => $client['proxyhostname'],
		'httpuseragent' => $client['httpuseragent']
	);
}

if (!save_json($filepath, $users)) {
	echo "geomap-server-write : ERROR writing " . $filepath . " (check data/ permissions)";
	exit(1);
}

echo "position accepted for [" . $username . "] GPS=" . $state;
exit;
