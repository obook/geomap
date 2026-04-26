/*
 * Project: GeoMap
 * File: handlers.js
 * Description: navigator.geolocation success/error callbacks, toast helper, and first-fix map centering
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Toast helpers - de-duplicate consecutive identical messages so the
 * UI does not spam the user when the same error repeats every poll. */
Class_GPS.prototype._show_toast = function (msg)
{
	if (this._last_gps_error_shown === msg) return;
	this._last_gps_error_shown = msg;
	if (typeof app !== 'undefined' && app && app.toast) {
		app.toast.create({
			text: msg,
			position: 'center',
			closeTimeout: 4000
		}).open();
	}
};

Class_GPS.prototype._clear_toast_state = function ()
{
	this._last_gps_error_shown = null;
};

/* Recenter the map on the first valid fix. Suppressed when restoring a
 * saved view (Class_GeoMap.skipLocate). */
Class_GPS.prototype._center_on_first_fix = function ()
{
	if (this._first_fix_centered) return;
	if (typeof Class_GeoMap !== 'undefined' && Class_GeoMap.skipLocate) {
		this._first_fix_centered = true;
		return;
	}
	if (this._gmap && gps_lastposition_latitude != null && gps_lastposition_longitude != null) {
		/* Zoom level matches ZoomToUserMarker so the manual button and
		 * the automatic first-fix view are visually consistent. */
		this._gmap.setView([gps_lastposition_latitude, gps_lastposition_longitude], 16);
		this._first_fix_centered = true;
	}
};

/* getCurrentPosition success - populate globals and try first-fix center. */
Class_GPS.prototype._on_position_success = function (currposition)
{
	gps_lastposition_status = STATE_POSITION_OK;
	gps_lastposition_latitude = currposition.coords.latitude;
	gps_lastposition_longitude = currposition.coords.longitude;
	gps_lastposition_accuracy = currposition.coords.accuracy;
	gps_lastposition_speed = currposition.coords.speed;
	gps_lastposition_altitude = currposition.coords.altitude;
	gps_lastposition_altitudeAccuracy = currposition.coords.altitudeAccuracy;
	gps_lastposition_heading = currposition.coords.heading;
	gps_lastposition_date = new Date();

	console.log('[GeoMap] GPS fix: lat=' + gps_lastposition_latitude
		+ ' lon=' + gps_lastposition_longitude
		+ ' acc=' + gps_lastposition_accuracy + 'm');
	this._clear_toast_state();
	this._center_on_first_fix();
};

Class_GPS.prototype._on_position_error = function (error)
{
	console.error('[GeoMap] GPS error: ' + error.message);
	gps_lastposition_date = new Date();
	var toast_msg = '';
	switch (error.code) {
		case error.PERMISSION_DENIED:
			gps_lastposition_status = STATE_PERMISSION_DENIED;
			toast_msg = t('gps.toast_denied');
			break;
		case error.POSITION_UNAVAILABLE:
			gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
			toast_msg = t('gps.toast_unavail');
			break;
		case error.TIMEOUT:
			gps_lastposition_status = STATE_POSITION_TIMEOUT;
			toast_msg = t('gps.toast_timeout');
			break;
		default:
			gps_lastposition_status = STATE_POSITION_ERROR;
			toast_msg = t('gps.toast_error') + (error.message || t('gps.toast_unknown'));
			break;
	}
	this._show_toast(toast_msg);
};

/* watchPosition success - same pattern as the one-shot success. */
Class_GPS.prototype._on_watch_success = function (newposition)
{
	gps_lastposition_status = STATE_POSITION_OK;
	gps_lastposition_latitude = newposition.coords.latitude;
	gps_lastposition_longitude = newposition.coords.longitude;
	gps_lastposition_accuracy = newposition.coords.accuracy;
	gps_lastposition_speed = newposition.coords.speed;
	gps_lastposition_altitude = newposition.coords.altitude;
	gps_lastposition_altitudeAccuracy = newposition.coords.altitudeAccuracy;
	gps_lastposition_heading = newposition.coords.heading;
	gps_lastposition_date = new Date();

	this._clear_toast_state();
	this._center_on_first_fix();
};

Class_GPS.prototype._on_watch_error = function (error)
{
	gps_lastposition_date = new Date();
	var toast_msg = '';
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.warn('[GeoMap] GPS watch: permission denied');
			gps_lastposition_status = STATE_PERMISSION_DENIED;
			toast_msg = t('gps.toast_denied');
			break;
		case error.POSITION_UNAVAILABLE:
			console.warn('[GeoMap] GPS watch: position unavailable');
			gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
			toast_msg = t('gps.toast_unavail');
			break;
		case error.TIMEOUT:
			console.warn('[GeoMap] GPS watch: timeout');
			gps_lastposition_status = STATE_POSITION_TIMEOUT;
			toast_msg = t('gps.toast_timeout');
			break;
		default:
			console.warn('[GeoMap] GPS watch: unknown error ' + error.code);
			gps_lastposition_status = STATE_POSITION_ERROR;
			toast_msg = t('gps.toast_watch_error') + (error.message || t('gps.toast_unknown'));
			break;
	}
	if (toast_msg) this._show_toast(toast_msg);
};
