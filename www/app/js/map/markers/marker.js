/*
 * Project: GeoMap
 * File: marker.js
 * Description: Class_Marker - one Leaflet marker plus its accuracy circle for a single remote user
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * The drawing/update routine lives in marker-update.js, position
 * helpers in marker-position.js, and small state mutators in
 * marker-state.js. All four files must load to get a fully working
 * class.
 */

function Class_Marker(map, position, id, name, markers_layer, accuracy_layer)
{
	this._map = map;
	this._myid = id;
	this._myname = name;
	this._markers_layer = markers_layer;
	this._accuracy_layer = accuracy_layer;

	this._mylastposition = position;
	this._mylastposition_latitude = position.lat;
	this._mylastposition_longitude = position.lng;
	this._mylastspeed = 0;
	this._mylastaccuracy = 0;

	this._visible = true;
	this._gps_date = 0;       /* last gps fix time (server-side, seconds) */
	this._marker_ttl = 0;     /* master clock - this marker time */
	this._server_ttl = 0;     /* local time - last update time */
	this._reception = 2;      /* 2 = good, 1 = degraded, 0 = lost */
	this._guser_lastmessage = '';
	this._update_gap_ttl = 0;
	this._last_update_date = new Date();

	this._default_icon_color_index = iColor;
	iColor++;
	if (iColor > 9) iColor = 1;

	if (GLOBAL_PLAY_SOUNDS == 'on') {
		playaudio('player_news_user_id', 'assets/sounds/pop1.ogg');
	}

	/* Marker + accuracy circle */
	this._marker = new L.Marker(position, { title: name })
		.bindLabel(name, { noHide: true })
		.addTo(markers_layer)
		.showLabel();
	this._marker.setIcon(L.AwesomeMarkers.icon({
		icon: 'icon-male',
		color: AwesomeColors[this._default_icon_color_index],
		spin: false
	}));
	this._circle_accuracy = L.circle(position, 0, {
		color: HtmlColors[this._default_icon_color_index],
		fillColor: HtmlColors[this._default_icon_color_index],
		fillOpacity: 0.2
	}).addTo(accuracy_layer);

	this._bindClickHandler();
}

/* Click toggles the global follow_marker_id between this marker's id
 * and null. The Class_Markers per-tick refresh reads follow_marker_id
 * to decide whether to pan the map. */
Class_Marker.prototype._bindClickHandler = function ()
{
	var self = this;
	this._marker.addEventListener('click', function () {
		if (follow_marker_id != self._myid) {
			if (GLOBAL_PLAY_SOUNDS == 'on') {
				playaudio('player_follow_on_id', 'assets/sounds/ding.ogg');
				console.log('[GeoMap] Following: ' + self._myname);
			}
			follow_marker_id = self._myid;
			toast("Following " + self._myname);
		} else {
			if (GLOBAL_PLAY_SOUNDS == 'on') {
				playaudio('player_follow_off_id', 'assets/sounds/ding-reverse.ogg');
				console.log('[GeoMap] Unfollowing: ' + self._myname);
			}
			follow_marker_id = null;
			toast("UNFollowing " + self._myname);
		}
	});
};

/* Simple getters that public callers expect. */
Class_Marker.prototype.GetId           = function () { return this._myid; };
Class_Marker.prototype.GetUsername     = function () { return this._myname; };
Class_Marker.prototype.GetMarker       = function () { return this._marker; };
Class_Marker.prototype.GetMarkerTTL    = function () { return this._marker_ttl; };
Class_Marker.prototype.GetServerTTL    = function () { return this._server_ttl; };
Class_Marker.prototype.GetVisible      = function () { return this._visible; };
Class_Marker.prototype.GetLastPosition = function () { return this._mylastposition; };
Class_Marker.prototype.GetLat          = function () { return this._mylastposition_latitude; };
Class_Marker.prototype.GetLon          = function () { return this._mylastposition_longitude; };
Class_Marker.prototype.GetAccuracy     = function () { return this._mylastaccuracy; };
Class_Marker.prototype.GetSpeed        = function () { return this._mylastspeed; };

Class_Marker.prototype.SetMarkerTTL = function (val) { this._marker_ttl = val; };
Class_Marker.prototype.SetReceptionLevel = function (val) { this._reception = val; };
