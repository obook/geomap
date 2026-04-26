/*
 * Project: GeoMap
 * File: main.js
 * Description: Class_GeoMap orchestrator - constructor, lifecycle, and the per-tick refresh timer
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * Layer setup, persistent state save/restore, and small accessors live
 * in sibling files (layers.js, state.js, accessors.js) as prototype
 * methods on Class_GeoMap. All four files must load to get a fully
 * working class.
 */

function Class_GeoMap(map_id, server_url)
{
	this._map_id = map_id;

	this._gmap = null;
	this._markers_layer = null;
	this._accuracy_layer = null;
	this._draw_tools_layer = null;
	this._baseMaps = null;
	this._overlayMaps = null;

	this._local_marker = null;
	this._local_accuracy_circle = null;
	this._server_responded = false;

	this._gmission_id = null;
	this._guser_id = null;
	this._guser_name = null;

	this._id_data_timer_refresh = -1;
	this._count_server_animation = -1;
	this._new_marker_index = 0;

	this._gps = null;
	this._airuser = null;
	this._markers = null;

	console.log('[GeoMap] Map init: ' + map_id);

	GLOBAL_SERVER = server_url;

	var gmapdiv = document.getElementById(map_id);
	if (gmapdiv) {
		gmapdiv.style.overflow = "hidden";
	}

	this._setupLayers();
	this._restoreInitialView();
	this._setupDrawHandler();
}

Class_GeoMap.prototype.start = function (mission_id, user_id, user_name)
{
	console.log('[GeoMap] Start session: ' + user_name);

	this._gmission_id = mission_id;
	this._guser_id = user_id;
	this._guser_name = user_name;

	this._gps = new Class_GPS(this._gmap, user_id, user_name);
	this._gps.start();

	this._airuser = new Class_User(this._gmap, mission_id, user_id, user_name);
	this._airuser.start();

	this._markers = new Class_Markers(this._gmap, mission_id, user_id);
	this._markers.start(this._markers_layer, this._accuracy_layer);

	var self = this;
	this._id_data_timer_refresh = window.setInterval(function () {
		self._refresh_data_timer();
	}, GLOBAL_REFRESH_INFO_SCREEN * 1000);
};

Class_GeoMap.prototype.stop = function ()
{
	console.log('[GeoMap] Stopping...');
	if (this._gps != null) this._gps.stop();
	if (this._markers != null) this._markers.stop();
	if (this._airuser != null) this._airuser.stop();
	if (this._id_data_timer_refresh != -1) {
		window.clearInterval(this._id_data_timer_refresh);
		this._id_data_timer_refresh = -1;
	}
};

Class_GeoMap.prototype.logout = function ()
{
	$.post(GLOBAL_SERVER + "/geomap-server-logout.php",
		{ mission: this._gmission_id, userid: this._guser_id })
		.done(function () { console.log('[GeoMap] Logout success'); })
		.fail(function () { console.error('[GeoMap] Logout failed'); });
};

Class_GeoMap.prototype.destroy = function ()
{
	this.stop();
	if (this._gmap != null) {
		this._gmap.remove();
		this._gmap = null;
	}
};

/* Static flag: when true, the next Class_GeoMap construction must not
 * recenter the map on the user position (used when restoring a saved
 * view). Initialised once at module load so any reader that runs
 * before the first construction sees a defined boolean. */
Class_GeoMap.skipLocate = false;
