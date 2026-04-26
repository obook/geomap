/*
 * Project: GeoMap
 * File: timer.js
 * Description: Refresh timer that drives marker/GPS animation and the offline fallback marker
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Per-tick callback - called every GLOBAL_REFRESH_INFO_SCREEN seconds.
 * Updates HUD state, refreshes markers, and shows a local fallback
 * marker if the server has not responded yet. */
Class_GeoMap.prototype._refresh_data_timer = function ()
{
	if (this._id_data_timer_refresh == -1) return;

	window.clearInterval(this._id_data_timer_refresh);
	this._id_data_timer_refresh = -1;

	if (this._markers != null) this._markers.update();
	if (this._gps != null) this._gps.update();

	this._renderLocalFallbackMarker();

	var self = this;
	this._id_data_timer_refresh = window.setInterval(function () {
		self._refresh_data_timer();
	}, GLOBAL_REFRESH_INFO_SCREEN * 1000);
};

/* When the server has not responded yet but the local GPS already has
 * a fix, draw a temporary marker for ourselves so the map is not
 * empty. Removed by ServerResponded() once the first server reply
 * arrives. */
Class_GeoMap.prototype._renderLocalFallbackMarker = function ()
{
	if (this._server_responded) return;
	if (gps_lastposition_status != STATE_POSITION_OK) return;
	if (gps_lastposition_latitude == null) return;

	var latlng = L.latLng(gps_lastposition_latitude, gps_lastposition_longitude);

	if (this._local_marker == null) {
		this._local_marker = L.marker(latlng, {
			icon: L.AwesomeMarkers.icon({ icon: 'icon-user', color: 'green', spin: false }),
			title: this._guser_name
		}).addTo(this._markers_layer);
		this._local_marker.bindPopup('<b>' + this._guser_name + '</b><br/>LOCAL').bindLabel(this._guser_name);
	} else {
		this._local_marker.setLatLng(latlng);
	}

	if (gps_lastposition_accuracy && gps_lastposition_accuracy > 0
		&& gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY)
	{
		if (this._local_accuracy_circle == null) {
			this._local_accuracy_circle = L.circle(latlng, gps_lastposition_accuracy, {
				color: '#ffffff', fillColor: '#cccccc', fillOpacity: 0.25, weight: 2
			}).addTo(this._accuracy_layer);
		} else {
			this._local_accuracy_circle.setLatLng(latlng);
			this._local_accuracy_circle.setRadius(gps_lastposition_accuracy);
		}
	}
};

/* Clear the local fallback marker once a server reply has arrived. */
Class_GeoMap.prototype.ServerResponded = function ()
{
	if (this._server_responded) return;
	this._server_responded = true;
	if (this._local_marker != null) {
		this._markers_layer.removeLayer(this._local_marker);
		this._local_marker = null;
	}
	if (this._local_accuracy_circle != null) {
		this._accuracy_layer.removeLayer(this._local_accuracy_circle);
		this._local_accuracy_circle = null;
	}
};
