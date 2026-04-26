/*
 * Project: GeoMap
 * File: state.js
 * Description: Persist and restore the Leaflet view (center, zoom, active base/overlay layers)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Capture the current map state into a plain object that can be saved
 * to localStorage and restored later via RestoreState. */
Class_GeoMap.prototype.SaveState = function ()
{
	if (this._gmap == null) return null;

	var state = {
		center: this._gmap.getCenter(),
		zoom: this._gmap.getZoom()
	};

	/* Find the currently active base layer */
	var baseNames = Object.keys(this._baseMaps);
	for (var i = 0; i < baseNames.length; i++) {
		if (this._gmap.hasLayer(this._baseMaps[baseNames[i]])) {
			state.baseLayer = baseNames[i];
			break;
		}
	}

	/* Find active overlay layers */
	state.overlays = [];
	var overlayNames = Object.keys(this._overlayMaps);
	for (var j = 0; j < overlayNames.length; j++) {
		if (this._gmap.hasLayer(this._overlayMaps[overlayNames[j]])) {
			state.overlays.push(overlayNames[j]);
		}
	}

	return state;
};

/* Re-apply a state object previously produced by SaveState. */
Class_GeoMap.prototype.RestoreState = function (state)
{
	if (this._gmap == null || state == null) return;

	/* Restore center and zoom level */
	this._gmap.setView(state.center, state.zoom);

	/* Restore base layer */
	if (state.baseLayer && this._baseMaps[state.baseLayer]) {
		var baseNames = Object.keys(this._baseMaps);
		for (var i = 0; i < baseNames.length; i++) {
			if (this._gmap.hasLayer(this._baseMaps[baseNames[i]])) {
				this._gmap.removeLayer(this._baseMaps[baseNames[i]]);
			}
		}
		this._gmap.addLayer(this._baseMaps[state.baseLayer]);
	}

	/* Restore overlay layers */
	if (state.overlays) {
		var overlayNames = Object.keys(this._overlayMaps);
		for (var j = 0; j < overlayNames.length; j++) {
			var name = overlayNames[j];
			if (state.overlays.indexOf(name) >= 0) {
				if (!this._gmap.hasLayer(this._overlayMaps[name])) {
					this._gmap.addLayer(this._overlayMaps[name]);
				}
			} else {
				if (this._gmap.hasLayer(this._overlayMaps[name])) {
					this._gmap.removeLayer(this._overlayMaps[name]);
				}
			}
		}
	}
};
