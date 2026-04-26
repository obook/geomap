/*
 * Project: GeoMap
 * File: user.js
 * Description: Class_User constructor and lifecycle - keeps the per-session state and starts/stops the periodic server sync
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * The data-sending behaviour (timer callback, AJAX writes, message
 * posting) lives in sender.js as prototype methods on Class_User. Both
 * files must load to get a fully working class.
 */

/* Initial timer interval used during the warm-up phase before the user
 * preference (set via the Settings slider) takes over. */
var USER_WARMUP_INTERVAL_SEC = 10;

function Class_User(map, mission, id, name)
{
	this._gmap = map;
	this._gmission = mission;
	this._guser_id = id;
	this._guser_name = name;

	this._intervalDataID = null;
	this._send_data_number = 0;
	this._store_active = false;

	this._startTime = new Date().getTime();

	console.log('[GeoMap] User init: ' + name);
}

Class_User.prototype.start = function ()
{
	console.log('[GeoMap] User started: ' + this._guser_name);
	var self = this;
	this._intervalDataID = window.setInterval(function () {
		self._refresh_users_timer();
	}, USER_WARMUP_INTERVAL_SEC * 1000);
};

Class_User.prototype.stop = function ()
{
	if (this._intervalDataID != null) {
		window.clearInterval(this._intervalDataID);
		this._intervalDataID = null;
	}
};
