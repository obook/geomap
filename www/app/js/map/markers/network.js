/*
 * Project: GeoMap
 * File: network.js
 * Description: Class_Markers prototype methods that poll the server and animate the network indicator icon
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Periodic timer callback. After the warm-up window (3 cycles at
 * MARKERS_WARMUP_INTERVAL_SEC) the cadence drops to the user-tunable
 * GLOBAL_NETWORK_GETDATA. */
Class_Markers.prototype._refresh_users_timer = function ()
{
	if (this._intervalID == null) return;

	window.clearInterval(this._intervalID);
	this._intervalID = null;

	this._request_data();
	this._request_data_number++;

	var self = this;
	var nextInterval = (this._request_data_number < 3)
		? MARKERS_WARMUP_INTERVAL_SEC
		: GLOBAL_NETWORK_GETDATA;
	this._intervalID = window.setInterval(function () {
		self._refresh_users_timer();
	}, nextInterval * 1000);
};

/* Fetch the latest user list and dispatch to the response handler.
 * The clsid query parameter is a cache-buster (HTTP caches in the
 * wild ignore the no-store / no-cache headers we set otherwise). */
Class_Markers.prototype._request_data = function ()
{
	var random_id = GetRandomID();
	var startTime = new Date().getTime();
	var self = this;

	jQuery.ajax({
		url: GLOBAL_SERVER + "/geomap-server-read.php",
		crossDomain: true,
		cache: false,
		dataType: "json",
		type: "POST",
		data: { mission: this._mission, clsid: random_id },
		success: function (json) {
			var elapsed = new Date().getTime() - startTime;
			if (json == null) {
				console.error('[GeoMap] Server read: null response');
				return;
			}
			console.log('[GeoMap] Server read: ' + (elapsed / 1000) + 's');
			self._request_data_process_done(json);
		},
		error: function (json) {
			console.error('[GeoMap] Server read failed: ' + JSON.stringify(json));
			if (self._toggle_animation != 3) {
				self._toggle_animation = 3;
				jQuery('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-error');
			}
		}
	});
};
