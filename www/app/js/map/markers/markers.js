/*
 * Project: GeoMap
 * File: markers.js
 * Description: Class_Markers - the orchestrator that polls the server, keeps the marker collection, and forwards to the public methods
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * Network polling lives in network.js, the per-tick response handler
 * in process.js, and the navbar/userlist commands in public.js. The
 * standalone Class_Marker (one per remote user) lives in marker.js,
 * marker-update.js, marker-position.js, and marker-state.js. All
 * eight files must load to get a fully working class.
 */

/* Module-level state shared by Class_Markers and Class_Marker. */

/* Round-robin colour index for new markers (0 is reserved to the
 * local user). */
var iColor = 1;

/* Total user count provided by the server master record. */
var total_users_online = 0;

/* Currently followed marker (null when no marker is followed). The
 * Class_Marker click handler reads / writes it; Class_Markers reads
 * it during the per-tick refresh to decide whether to pan the map. */
var follow_marker_id = null;

/* Initial fast-poll cadence used during the first few cycles. */
var MARKERS_WARMUP_INTERVAL_SEC = 10;

function Class_Markers(map, mission, id)
{
	this._map = map;
	this._mission = mission;
	this._guser_id = id;

	this._markers_array = [];
	this._master_clock = null;

	this._intervalID = null;
	this._request_data_number = 0;
	this._toggle_animation = -1;
	this._toggle_server_respond = false;

	this._markers_layer = null;
	this._accuracy_layer = null;

	console.log('[GeoMap] Markers init: mission ' + mission);
	jQuery('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-inactive');
}

Class_Markers.prototype.start = function (markerslayer, accuracylayer)
{
	this._markers_layer = markerslayer;
	this._accuracy_layer = accuracylayer;
	var self = this;
	/* The first cycle is short so the server learns about us quickly. */
	this._intervalID = window.setInterval(function () {
		self._refresh_users_timer();
	}, 2000);
};

Class_Markers.prototype.stop = function ()
{
	if (this._intervalID != null) {
		window.clearInterval(this._intervalID);
		this._intervalID = null;
	}
};
