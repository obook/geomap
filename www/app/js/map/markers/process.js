/*
 * Project: GeoMap
 * File: process.js
 * Description: Class_Markers - per-tick response handler. Walks the server JSON, updates or creates each marker
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Handler for a successful read. Notifies the orchestrator that the
 * server is alive (so the local-fallback marker can be removed),
 * animates the network icon, then walks json.users to update or
 * create one marker per user. */
Class_Markers.prototype._request_data_process_done = function (json)
{
	if (typeof geomap !== 'undefined' && geomap != null
		&& typeof geomap.ServerResponded === 'function')
	{
		geomap.ServerResponded();
	}

	this._animate_network_icon();

	var self = this;
	$.each(json.users, function (i, item) {
		LAST_TIME_READ = new Date();
		if (!self._toggle_server_respond) self._toggle_server_respond = true;

		if (item['userid'] == null || item['time'] == null) {
			console.warn('[GeoMap] Received incomplete data');
			return;
		}

		/* Special master record: only carries the global clock and
		 * the total user count. */
		if (item['userid'] == 'master') {
			self._master_clock = item['time'];
			total_users_online = item['total'];
			return;
		}

		var existingIndex = self._find_marker_index(item['userid']);
		if (existingIndex >= 0) {
			self._update_existing_marker(self._markers_array[existingIndex], existingIndex, item);
		} else {
			self._create_new_marker(item);
		}
	});
};

Class_Markers.prototype._animate_network_icon = function ()
{
	if (this._toggle_animation == 1) {
		this._toggle_animation = 2;
		jQuery('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-active-dextre');
	} else {
		this._toggle_animation = 1;
		jQuery('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-active-senestre');
	}
};

Class_Markers.prototype._find_marker_index = function (userid)
{
	for (var j = 0; j < this._markers_array.length; j++) {
		if (this._markers_array[j].GetId() == userid) return j;
	}
	return -1;
};

Class_Markers.prototype._update_existing_marker = function (marker_exist, existing_index, item)
{
	var ttl = marker_exist.GetMarkerTTL();
	var newposition = new L.LatLng(item['latitude'], item['longitude']);

	if (ttl <= (item['frequency'] + 30) && item['accuracy'] < 500 && item['state'] == STATE_POSITION_OK) {
		marker_exist.SetVisible(true);
		marker_exist.SetReceptionLevel(2);
		if (follow_marker_id != null && item['userid'] == follow_marker_id) {
			this._map.panTo(newposition);
		}
	} else if (ttl <= (item['frequency'] + 60) && item['accuracy'] < 500) {
		marker_exist.SetVisible(true);
		marker_exist.SetReceptionLevel(1);
	} else if (ttl <= (item['frequency'] + 900) && item['accuracy'] < 500) {
		marker_exist.SetVisible(true);
		marker_exist.SetReceptionLevel(0);
	} else {
		marker_exist.SetReceptionLevel(0);
		marker_exist.SetVisible(item['accuracy'] <= GLOBAL_MINIMUM_ACCURAY);
	}

	if (item['state'] == STATE_POSITION_OK) {
		marker_exist.SetPosition(item['username'], newposition,
			item['accuracy'], item['heading'], item['speed'], item['time']);
		marker_exist.SetNoGpsMode(false);
	} else {
		/* User has lost GPS; hide the pin but keep the floating
		 * username label at the last known position. */
		marker_exist.SetNoGpsMode(true);
	}

	marker_exist.SetMarkerTTL(this._master_clock - item['time']);

	var format_ttl = marker_exist.GetMarkerTTL();
	var unit_ttl = ' sec';
	if (format_ttl > 60) { format_ttl = Math.round(format_ttl / 60); unit_ttl = ' min'; }
	if (format_ttl > 60) { format_ttl = Math.round(format_ttl / 60); unit_ttl = ' h'; }
	marker_exist.SetTitle("TTL: " + format_ttl + unit_ttl + "\nACC: " + item['accuracy'] + 'm');

	if (item['message'] != null && item['message'] != '') {
		marker_exist.PrintMessage(item['message'], item['message_time']);
	}

	if (item['active'] == 0) {
		marker_exist.Remove();
		this._markers_array.splice(existing_index, 1);
		console.log('[GeoMap] Marker removed: ' + item['username']);
	}
};

Class_Markers.prototype._create_new_marker = function (item)
{
	if (item['active'] != 1 || item['state'] != STATE_POSITION_OK) return;

	console.log('[GeoMap] New marker: ' + item['username']);
	var position = new L.LatLng(item['latitude'], item['longitude']);
	var newMarker = new Class_Marker(this._map, position, item['userid'], item['username'],
		this._markers_layer, this._accuracy_layer);
	this._markers_array.push(newMarker);

	if (item['userid'] == this._guser_id) {
		newMarker.SetGreenMarker();
	}
	if (item['accuracy'] > 500 || item['state'] == STATE_POSITION_UNKNOWN) {
		newMarker.SetVisible(false);
		newMarker.SetReceptionLevel(0);
	}
};
