<?php
/*
 * Project: GeoMap
 * File: geomap-json-storage.php
 * Description: JSON file storage helpers (atomic writes, sanitisation)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

require_once(__DIR__ . '/geomap-server-config.php');

function storage_init()
{
	if (!is_dir(DATA_DIR)) {
		mkdir(DATA_DIR, 0755, true);
	}
}

function users_file($mission)
{
	return DATA_DIR . '/users_' . preg_replace('/[^a-zA-Z0-9]/', '', $mission) . '.json';
}

function messages_file($mission)
{
	return DATA_DIR . '/messages_' . preg_replace('/[^a-zA-Z0-9]/', '', $mission) . '.json';
}

function load_json($filepath)
{
	if (!file_exists($filepath)) {
		return array();
	}
	$content = file_get_contents($filepath);
	if ($content === false || $content === '') {
		return array();
	}
	$data = json_decode($content, true);
	if (!is_array($data)) {
		return array();
	}
	return $data;
}

function save_json($filepath, $data)
{
	$tmp = $filepath . '.tmp';
	if (file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) !== false) {
		rename($tmp, $filepath);
		return true;
	}
	return false;
}

function get_client_info()
{
	$info = array(
		'ip' => 'none',
		'hostname' => '',
		'proxyip' => '',
		'proxyhostname' => '',
		'httpuseragent' => ''
	);

	if (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
		$info['ip'] = $_SERVER["HTTP_X_FORWARDED_FOR"];
		$info['hostname'] = @gethostbyaddr($_SERVER["HTTP_X_FORWARDED_FOR"]);
		$info['proxyip'] = $_SERVER["REMOTE_ADDR"];
		$info['proxyhostname'] = @gethostbyaddr($_SERVER["REMOTE_ADDR"]);
	} else {
		$info['ip'] = $_SERVER["REMOTE_ADDR"];
		$info['hostname'] = @gethostbyaddr($_SERVER["REMOTE_ADDR"]);
	}

	if (isset($_SERVER["HTTP_USER_AGENT"])) {
		$info['httpuseragent'] = $_SERVER["HTTP_USER_AGENT"];
	}

	return $info;
}

function sanitize($value)
{
	return htmlentities(trim($value), ENT_QUOTES, 'UTF-8');
}
