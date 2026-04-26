/*
 * Project: GeoMap
 * File: layers.js
 * Description: Tile layer setup, layer control, draw handler, and the initial map view restore for Class_GeoMap
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

Class_GeoMap.prototype._setupLayers = function ()
{
	var osmAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

	var normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{ attribution: osmAttribution });
	var terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		attribution: osmAttribution + ', &copy; OpenTopoMap',
		/* OpenTopoMap returns 403 above zoom 17. The vendored Leaflet
		 * (0.6.2) predates maxNativeZoom, so we hard-cap maxZoom on
		 * the layer; above this zoom the terrain layer is hidden and
		 * the user can either zoom back or switch basemap. */
		maxZoom: 17
	});
	var hybrid = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		{ attribution: '&copy; Esri' });
	var midnight = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
		{ attribution: '&copy; CartoDB' });
	var tactical = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		{ attribution: '&copy; CartoDB' });

	this._markers_layer = L.layerGroup();
	this._accuracy_layer = L.layerGroup();
	this._draw_tools_layer = L.layerGroup();

	this._gmap = L.map(this._map_id, {
		center: new L.LatLng(48.853289, 2.349071),
		zoom: 2,
		layers: [normal, this._markers_layer, this._accuracy_layer, this._draw_tools_layer]
	});

	this._baseMaps = {};
	this._baseMaps[t('layers.normal')] = normal;
	this._baseMaps[t('layers.hybrid')] = hybrid;
	this._baseMaps[t('layers.terrain')] = terrain;
	this._baseMaps[t('layers.tactical')] = tactical;
	this._baseMaps[t('layers.night')] = midnight;

	this._overlayMaps = {};
	this._overlayMaps[t('layers.markers')] = this._markers_layer;
	this._overlayMaps[t('layers.accuracy')] = this._accuracy_layer;
	this._overlayMaps[t('layers.tools')] = this._draw_tools_layer;

	L.control.layers(this._baseMaps, this._overlayMaps).addTo(this._gmap);
};

/* Initial map centering. If a GPS fix was already obtained on the home
 * page (during the ENGAGE click, to keep iOS Safari's user-gesture
 * context), use it now. Otherwise Class_GPS will center the map on
 * its first fix. The skipLocate flag suppresses both behaviours when
 * restoring a saved view. */
Class_GeoMap.prototype._restoreInitialView = function ()
{
	if (!Class_GeoMap.skipLocate
		&& gps_lastposition_status === STATE_POSITION_OK
		&& gps_lastposition_latitude != null
		&& gps_lastposition_longitude != null)
	{
		this._gmap.setView([gps_lastposition_latitude, gps_lastposition_longitude], 16);
	}
	Class_GeoMap.skipLocate = false;
};

/* Decorate user-drawn markers (when the Leaflet.draw control is
 * enabled - currently disabled but the handler is kept ready). */
Class_GeoMap.prototype._setupDrawHandler = function ()
{
	var self = this;
	this._gmap.on('draw:created', function (e) {
		var type = e.layerType;
		var obj = e.layer;
		if (type === 'marker') {
			var localname = '<font color="black">MARK' + self._new_marker_index + '</font>';
			obj.unbindLabel();
			obj.options.title = '';
			obj.setIcon(L.AwesomeMarkers.icon({
				icon: 'icon-plus-sign',
				color: AwesomeColors[self._new_marker_index],
				spin: false
			}));
			self._new_marker_index++;
			if (self._new_marker_index > 9) self._new_marker_index = 0;
			obj.bindPopup(localname).bindLabel(localname);
			obj.showLabel();
			obj.update();
		}
		self._draw_tools_layer.addLayer(obj);
	});
};
