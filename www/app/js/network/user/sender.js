/*
 * Project: GeoMap
 * File: sender.js
 * Description: Class_User prototype methods that talk to the back-end - periodic position write, on-demand chat message
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Periodic timer callback. Pushes the latest GPS position to the
 * server, then re-arms itself. The first few cycles run faster
 * (USER_WARMUP_INTERVAL_SEC) so the server learns about the user
 * quickly; subsequent cycles use the user-configured interval. */
Class_User.prototype._refresh_users_timer = function ()
{
	if (this._intervalDataID == null) return;

	window.clearInterval(this._intervalDataID);
	this._intervalDataID = null;

	this._store_to_server(
		1,
		GLOBAL_NETWORK_SENDATA_MAXITIME,
		this._gmission,
		this._guser_id,
		this._guser_name,
		gps_lastposition_status,
		gps_lastposition_latitude,
		gps_lastposition_longitude,
		gps_lastposition_accuracy,
		gps_lastposition_speed,
		gps_lastposition_altitude,
		gps_lastposition_altitudeAccuracy,
		gps_lastposition_heading
	);

	this._send_data_number++;

	var self = this;
	var nextInterval = (this._send_data_number < 2)
		? USER_WARMUP_INTERVAL_SEC
		: GLOBAL_NETWORK_SENDATA_MAXITIME;
	this._intervalDataID = window.setInterval(function () {
		self._refresh_users_timer();
	}, nextInterval * 1000);
};

/* Persist the current user position via geomap-server-write.php. The
 * single-flight guard prevents request pile-up when the server is slow. */
Class_User.prototype._store_to_server = function (
	active, frequency, missionid, id, name, state,
	latitude, longitude, accuracy, speed, altitude, altitudeAccuracy, heading)
{
	if (this._store_active === true) {
		console.warn('[GeoMap] Write skipped: previous request pending');
		return;
	}

	this._store_active = true;
	var startTime = new Date().getTime();
	var self = this;
	var random_id = GetRandomID();

	var obj = {
		active: active,
		frequency: frequency,
		mission: missionid,
		userid: id,
		username: name,
		state: state,
		latitude: latitude,
		longitude: longitude,
		accuracy: accuracy,
		speed: speed,
		altitude: altitude,
		altitudeAccuracy: altitudeAccuracy,
		heading: heading,
		clsid: random_id
	};

	$.ajax({
		url: GLOBAL_SERVER + "/geomap-server-write.php",
		crossDomain: true,
		cache: false,
		type: "POST",
		dataType: "html",
		data: obj,
		success: function () {
			var elapsed = new Date().getTime() - startTime;
			console.log('[GeoMap] Server write: ' + (elapsed / 1000) + 's');
			self._store_active = false;
		},
		error: function (json) {
			console.error('[GeoMap] Server write failed: ' + JSON.stringify(json));
			self._store_active = false;
		}
	});
};

/* Post a short chat message to the same channel. */
Class_User.prototype.SendMessage = function (text)
{
	console.log('[GeoMap] Sending message...');
	var random_id = GetRandomID();
	var obj = {
		active: 1,
		mission: this._gmission,
		userid: this._guser_id,
		username: this._guser_name,
		message: text,
		clsid: random_id
	};

	$.ajax({
		url: GLOBAL_SERVER + "/geomap-server-message-write.php",
		crossDomain: true,
		cache: false,
		type: "POST",
		dataType: "html",
		data: obj
	}).done(function () {
		console.log('[GeoMap] Message sent');
		LAST_TIME_WRITE = new Date();
	}).fail(function (jqXHR, textStatus) {
		console.error('[GeoMap] Message send failed: ' + textStatus);
	});
};
