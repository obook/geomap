/*
 * Project: GeoMap
 * File: public.js
 * Description: Class_Markers public API - per-tick refresh, follow control, zoom shortcuts, message clear, user list
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Called on every Class_GeoMap tick. Counts visible markers, refreshes
 * the user-count badge, and asks each marker to redraw itself. */
Class_Markers.prototype.update = function ()
{
	var users_online = 0;
	for (var i = 0; i < this._markers_array.length; i++) {
		if (this._markers_array[i].GetVisible()) users_online++;
	}

	if (this._toggle_server_respond) {
		jQuery('#usersnumbers').html(
			"<font color='white'>" + users_online + "</font>"
			+ "<font color='grey'>" + (this._markers_array.length - users_online) + "</font>"
			+ "<font color='white'>" + total_users_online + "</font>"
		);
	} else {
		jQuery('#usersnumbers').html('---');
	}

	for (var i2 = 0; i2 < this._markers_array.length; i2++) {
		this._markers_array[i2].update();
	}
};

/* Stop following any marker; the click handler in Class_Marker is the
 * counterpart that starts following. */
Class_Markers.prototype.unfollow = function ()
{
	console.log('[GeoMap] Unfollow marker');
	if (GLOBAL_PLAY_SOUNDS == 'on' && follow_marker_id != null) {
		playaudio('player_follow_off_id', 'assets/sounds/ding-reverse.ogg');
	}
	for (var i = 0; i < this._markers_array.length; i++) {
		this._markers_array[i].SetDefaultIcon();
	}
	follow_marker_id = null;
};

Class_Markers.prototype.ZoomToFitAllMarkers = function ()
{
	if (this._markers_array.length > 0) {
		var markersgroup = new L.featureGroup();
		for (var i = 0; i < this._markers_array.length; i++) {
			var marker = this._markers_array[i];
			if (marker.GetVisible()) {
				markersgroup.addLayer(marker.GetMarker());
			}
		}
		this._map.fitBounds(markersgroup.getBounds());
	}
	this.unfollow();
};

Class_Markers.prototype.ZoomToUserMarker = function ()
{
	if (gps_lastposition_latitude != null && gps_lastposition_longitude != null) {
		this._map.setView(new L.LatLng(gps_lastposition_latitude, gps_lastposition_longitude), 16, false);
	} else {
		console.warn('[GeoMap] Cannot zoom: no GPS position');
	}
	this.unfollow();
};

Class_Markers.prototype.CleanUpMessage = function ()
{
	jQuery('#messages_toolbar').hide(800);
	jQuery('#messages_id').empty();
};

/* Render the connected-users data table inside the element with the
 * given selector. Used by the Field Agents page. */
Class_Markers.prototype.PrintUserlist = function (id)
{
	var html = "<table id='table-column-toggle' class='data-table' style='width:100%;'>"
		+ "<thead><tr>"
		+ "<th>" + t('connected.col_user') + "</th>"
		+ "<th data-priority='1'>" + t('connected.col_distance') + "</th>"
		+ "<th data-priority='3'>" + t('connected.col_acc') + "</th>"
		+ "<th data-priority='4'>" + t('connected.col_speed') + "</th>"
		+ "<th data-priority='2'>" + t('connected.col_time') + "</th>"
		+ "</tr></thead><tbody><tr>";

	for (var i = 0; i < this._markers_array.length; i++) {
		html += this._render_userlist_row(this._markers_array[i]);
	}

	html += "</tbody></table>";
	jQuery(id).html(html);
};

Class_Markers.prototype._render_userlist_row = function (marker)
{
	var username = marker.GetUsername();
	var accuracy = marker.GetAccuracy();
	var speed = marker.GetSpeed();
	var TTL = marker.GetMarkerTTL();
	var unit_ttl = ' sec';

	var lat1 = marker.GetLat();
	var lon1 = marker.GetLon();
	var distKm = GetDistance(lat1, lon1, gps_lastposition_latitude, gps_lastposition_longitude);

	var distance;
	if (distKm < 0 || isNaN(distKm)) {
		distance = '-';
	} else if (distKm < 1) {
		distance = Math.round(distKm * 1000) + ' m';
	} else {
		distance = Math.round(distKm * 10) / 10 + ' km';
	}

	if (!accuracy || accuracy <= 0) {
		accuracy = '-';
	} else if (accuracy > 1000) {
		accuracy = Math.round(accuracy / 1000) + ' km';
	} else {
		accuracy = Math.round(accuracy) + ' m';
	}

	/* Speed in m/s; below 1 m/s is GPS noise at rest. */
	if (speed == null || isNaN(speed) || speed < 1) {
		speed = '-';
	} else {
		speed = Math.round(speed * 3.6) + ' km/h';
	}

	if (TTL > 60) { TTL = Math.round(TTL / 60); unit_ttl = ' m'; }
	if (TTL > 60) { TTL = Math.round(TTL / 60); unit_ttl = ' h'; }

	return "<th><a href=\"https://maps.google.com/?daddr=" + lat1 + "," + lon1
		+ "\" target='_blank' data-rel='external'>" + username + "</a></th>"
		+ "<td>" + distance + "</td>"
		+ "<td>" + accuracy + "</td>"
		+ "<td>" + speed + "</td>"
		+ "<td>" + TTL + unit_ttl + "</td>"
		+ "</tr>";
};
