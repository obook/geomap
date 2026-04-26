<?php
/*
 * Project: GeoMap-Air
 * File: geomap-server-message-write.php
 * Description: Persist a chat message to JSON file
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

require_once('geomap-json-storage.php');

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

storage_init();

/* Required parameters */
if (!isset($_REQUEST['active'])) {
	echo 'geomap-server-message-write : parm-error ' . __LINE__;
	exit(1);
}
$active = sanitize($_REQUEST['active']);

if (!isset($_REQUEST['mission'])) {
	echo 'geomap-server-message-write : parm-error ' . __LINE__;
	exit(1);
}
$mission = sanitize($_REQUEST['mission']);

if (!isset($_REQUEST['userid'])) {
	echo 'geomap-server-message-write : parm-error ' . __LINE__;
	exit(1);
}
$userid = sanitize($_REQUEST['userid']);

$username = 'unknown';
if (isset($_REQUEST['username'])) {
	$username = sanitize($_REQUEST['username']);
}

$message = '';
if (isset($_REQUEST['message'])) {
	$message = nl2br(sanitize($_REQUEST['message']));
}

$client = get_client_info();

/* Load existing messages for this mission */
$filepath = messages_file($mission);
$messages = load_json($filepath);

/* Find existing message or create new entry */
$found = false;
foreach ($messages as &$m) {
	if ($m['userid'] === $userid) {
		$m['active'] = intval($active);
		$m['username'] = $username;
		$m['message'] = $message;
		$m['time'] = time();
		$m['ip'] = $client['ip'];
		$m['httpuseragent'] = $client['httpuseragent'];
		$found = true;
		break;
	}
}
unset($m);

if (!$found) {
	$messages[] = array(
		'mission' => $mission,
		'userid' => $userid,
		'username' => $username,
		'active' => intval($active),
		'message' => $message,
		'time' => time(),
		'ip' => $client['ip'],
		'hostname' => $client['hostname'],
		'proxyip' => $client['proxyip'],
		'proxyhostname' => $client['proxyhostname'],
		'httpuseragent' => $client['httpuseragent']
	);
}

if (!save_json($filepath, $messages)) {
	echo "geomap-server-message-write : ERROR writing " . $filepath . " (check data/ permissions)";
	exit(1);
}

echo "Your message [" . $message . "] is stored!\n";
exit;
