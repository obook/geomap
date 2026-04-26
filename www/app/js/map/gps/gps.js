/*
 * Project: GeoMap
 * File: gps.js
 * Description: Class_GPS constructor and lifecycle, plus the module-level globals that hold the latest position
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * Geolocation handlers and the navbar state label live in handlers.js
 * and state-label.js as prototype methods on Class_GPS. All three
 * files must load to get a fully working class.
 */

/* Latest known position is exposed at module scope so non-GPS modules
 * (markers, user, page-home) can read it without holding a reference
 * to the active Class_GPS instance. */
var gps_lastposition_status = STATE_POSITION_UNKNOWN;
var gps_lastposition_date = null;
var gps_lastposition_latitude = null;
var gps_lastposition_longitude = null;
var gps_lastposition_accuracy = null;
var gps_lastposition_speed = null;
var gps_lastposition_altitude = null;
var gps_lastposition_altitudeAccuracy = null;
var gps_lastposition_heading = null;

/* enableHighAccuracy stays true; the legacy comment in the previous
 * version reported a regression on Nexus-S when it was set to false. */
var GPS_GEO_OPTIONS = {
	maximumAge: 0,
	enableHighAccuracy: true,
	timeout: 30000,
	frequency: 30000
};

function Class_GPS(gmap, user_id, user_name)
{
	this._gmap = gmap;
	this._guser_id = user_id;
	this._guser_name = user_name;

	this._watchPositionId = null;
	this._first_fix_centered = false;
	this._last_gps_error_shown = null;
	this._toggle_animation = -1;
	this._shown_info_speed = false;

	console.log('[GeoMap] GPS init: ' + user_name);
	jQuery('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-inactive');
}

Class_GPS.prototype.start = function ()
{
	console.log('[GeoMap] GPS started: ' + this._guser_name);

	if (!navigator.geolocation) {
		console.warn('[GeoMap] Geolocation not supported');
		gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
		return;
	}

	if (gps_lastposition_status != STATE_POSITION_OK) {
		gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
	}

	var self = this;
	/* One-shot initial fix to populate the position quickly. The
	 * continuous watchPosition below then keeps the position fresh on
	 * its own; no periodic getCurrentPosition is needed and would only
	 * cause spurious timeouts on platforms without GPS hardware (e.g.
	 * Chrome Linux relying on network-based geolocation). */
	navigator.geolocation.getCurrentPosition(
		function (pos) { self._on_position_success(pos); },
		function (err) { self._on_position_error(err); },
		GPS_GEO_OPTIONS
	);
	this._watchPositionId = navigator.geolocation.watchPosition(
		function (pos) { self._on_watch_success(pos); },
		function (err) { self._on_watch_error(err); },
		GPS_GEO_OPTIONS
	);
};

Class_GPS.prototype.stop = function ()
{
	if (this._watchPositionId != null) {
		navigator.geolocation.clearWatch(this._watchPositionId);
		this._watchPositionId = null;
	}
};
