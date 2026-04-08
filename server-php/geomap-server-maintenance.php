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
$user_disconnected = 259200; // 72 hours: active=-2 -> active=0
$user_unknown = 259200;      // 72 hours: active=1 -> active=-1
$user_lost = 259200;         // 72 hours: active=-1 -> active=0

$now = time();
echo "Maintenance at " . $now . "\n";

/* Process all mission files */
$user_files = glob(DATA_DIR . '/users_*.json');
if ($user_files) {
	foreach ($user_files as $filepath) {
		$users = load_json($filepath);
		$modified = false;

		foreach ($users as &$u) {
			$age = $now - $u['time'];

			/* Step 1: disconnected (active=-2) older than threshold -> inactive */
			if ($u['active'] == -2 && $age > $user_disconnected) {
				$u['active'] = 0;
				$modified = true;
			}
			/* Step 2: connected (active=1) older than threshold -> unknown */
			elseif ($u['active'] == 1 && $age > $user_unknown) {
				$u['active'] = -1;
				$modified = true;
			}
			/* Step 3: unknown (active=-1) older than threshold -> inactive */
			elseif ($u['active'] == -1 && $age > $user_lost) {
				$u['active'] = 0;
				$modified = true;
			}
		}
		unset($u);

		if ($modified) {
			save_json($filepath, $users);
			echo "Updated: " . basename($filepath) . "\n";
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
