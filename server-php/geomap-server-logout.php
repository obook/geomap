<?php
/*
 * Project : GeoMap
 * Logout user (JSON file version)
 * Copyright (c) Olivier Booklage
 * Dual licensed under the MIT and GPL licenses.
 */

require_once('geomap-json-storage.php');

header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

storage_init();

if (!isset($_REQUEST['mission'])) {
	echo "geomap-server-logout : parm-error 1";
	exit(1);
}
$mission = sanitize($_REQUEST['mission']);

if (!isset($_REQUEST['userid'])) {
	echo "geomap-server-logout : parm-error 2";
	exit(1);
}
$userid = sanitize($_REQUEST['userid']);

/* Load users for this mission */
$filepath = users_file($mission);
$users = load_json($filepath);

$found = false;
foreach ($users as &$u) {
	if ($u['userid'] === $userid) {
		$u['active'] = 0;
		$found = true;
		break;
	}
}
unset($u);

if ($found) {
	save_json($filepath, $users);
}

echo "logout ok";
exit;
