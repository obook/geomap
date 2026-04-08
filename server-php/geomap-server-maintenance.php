<?php
/*
 * Project : GeoMap
 * Maintenance cron (JSON file version)
 * Copyright (c) Olivier Booklage
 * Dual licensed under the MIT and GPL licenses.
 */

require_once('geomap-json-storage.php');

header("Content-Type: text/plain");

storage_init();

$message_life = 3600;        // 1 hour
$user_stale = 3600;          // 1 hour: no ping -> remove user and messages

$now = time();
echo "Maintenance at " . $now . "\n";

/* Remove stale users (no ping for 1 hour) */
$user_files = glob(DATA_DIR . '/users_*.json');
if ($user_files) {
	foreach ($user_files as $filepath) {
		$users = load_json($filepath);
		$before = count($users);
		$users = array_values(array_filter($users, function($u) use ($now, $user_stale) {
			return ($now - $u['time']) < $user_stale;
		}));
		if (count($users) !== $before) {
			$removed = $before - count($users);
			save_json($filepath, $users);
			echo "Cleaned users: " . basename($filepath) . " (" . $removed . " removed)\n";
		}
	}
}

/* Clean old messages */
$msg_files = glob(DATA_DIR . '/messages_*.json');
if ($msg_files) {
	foreach ($msg_files as $filepath) {
		$messages = load_json($filepath);
		$before = count($messages);
		$messages = array_values(array_filter($messages, function($m) use ($now, $message_life) {
			return ($now - $m['time']) < $message_life;
		}));
		if (count($messages) !== $before) {
			save_json($filepath, $messages);
			echo "Cleaned messages: " . basename($filepath) . " (" . ($before - count($messages)) . " removed)\n";
		}
	}
}

echo "maint done.";
exit;
