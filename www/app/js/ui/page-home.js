/*
 * Project: GeoMap
 * File: page-home.js
 * Description: Home page handlers - field validation, random username, ENGAGE click + iOS-friendly geolocation prefetch
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function get_server_display()
{
	var s = get_server();
	return (s === '.') ? '' : s;
}

function validateEngageButton()
{
	var u = jQuery('#username-id').val().trim();
	var c = jQuery('#select-choice-mission-id').val().trim();
	var s = jQuery('#server-url-id').val().trim();
	if (u !== '' && c !== '' && s !== '') {
		jQuery('#submit-id').removeClass('disabled');
	} else {
		jQuery('#submit-id').addClass('disabled');
	}
}

app.on('pageInit', function (page) {
	if (page.name === 'home') {
		jQuery('#username-id').val(get_username());
		jQuery('#select-choice-mission-id').val(get_channel());
		jQuery('#server-url-id').val(get_server_display());
		validateEngageButton();
	}
});

app.on('pageAfterIn', function (page) {
	if (page.name === 'home') {
		jQuery('#username-id').val(get_username());
		jQuery('#select-choice-mission-id').val(get_channel());
		jQuery('#server-url-id').val(get_server_display());
		validateEngageButton();
	}
});

jQuery(document).on('input', '#username-id, #select-choice-mission-id, #server-url-id', validateEngageButton);

jQuery(document).on('click', '#random-callsign-id', function (e) {
	e.preventDefault();
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var name = '';
	for (var i = 0; i < 4; i++) name += chars.charAt(Math.floor(Math.random() * chars.length));
	jQuery('#username-id').val(name);
	validateEngageButton();
});

/* Initial pass: the inline home page may have fired pageInit during the
 * Framework7 constructor in app-init.js, before this file registered
 * its handler. The Framework7 init callback already populated the
 * fields from localStorage and URL parameters, so all we still owe is
 * a single validation pass to refresh the disabled state of the
 * Connect button now that validateEngageButton is reachable. */
validateEngageButton();

jQuery(document).on('click', '#submit-id', function () {
	username = jQuery('#username-id').val().trim();
	team = jQuery('#select-choice-mission-id').val().trim();
	var serverUrl = jQuery('#server-url-id').val().trim().replace(/\/+$/, '');
	if (username == '') username = 'NEWBIE';
	if (team == '') team = '1234';
	if (serverUrl == '') serverUrl = '.';
	set_username(username);
	set_channel(team);
	set_server(serverUrl);
	GLOBAL_SERVER = serverUrl;
	if (typeof soundManager !== 'undefined') soundManager.play('player_digital_beep_id');

	/* Trigger the geolocation permission prompt while we are still inside
	 * the ENGAGE click handler. iOS Safari only reliably shows the prompt
	 * when the call is made within an active user-gesture context. The
	 * navigation to /map/ happens immediately via the link href, so the
	 * success callback may resolve after Class_GeoMap is constructed: in
	 * that case Class_GPS.private_center_on_first_fix takes over the
	 * initial map centering on the next watchPosition update. */
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function (pos) {
				gps_lastposition_status = STATE_POSITION_OK;
				gps_lastposition_latitude = pos.coords.latitude;
				gps_lastposition_longitude = pos.coords.longitude;
				gps_lastposition_accuracy = pos.coords.accuracy;
				gps_lastposition_speed = pos.coords.speed;
				gps_lastposition_altitude = pos.coords.altitude;
				gps_lastposition_altitudeAccuracy = pos.coords.altitudeAccuracy;
				gps_lastposition_heading = pos.coords.heading;
				gps_lastposition_date = new Date();
				console.log('[GeoMap] Pre-engage GPS fix: lat=' + pos.coords.latitude + ' lon=' + pos.coords.longitude);
			},
			function (err) {
				console.warn('[GeoMap] Pre-engage geolocation failed: code=' + err.code + ' msg=' + err.message);
			},
			{ maximumAge: 0, enableHighAccuracy: true, timeout: 30000 }
		);
	}
});
