/*
 * Project: GeoMap
 * File: accessors.js
 * Description: Public Class_GeoMap methods that delegate to inner workers (markers, user, gps) or to globals
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

Class_GeoMap.prototype.GetMap = function ()
{
	return this._gmap;
};

Class_GeoMap.prototype.SendMessage = function (text)
{
	if (this._airuser != null && text !== '') {
		this._airuser.SendMessage(text);
	} else {
		console.error('[GeoMap] SendMessage failed: no user or empty message');
	}
};

Class_GeoMap.prototype.ZoomToFitAllMarkers = function ()
{
	if (this._markers != null) this._markers.ZoomToFitAllMarkers();
};

Class_GeoMap.prototype.ZoomToUserMarker = function ()
{
	if (this._markers != null) this._markers.ZoomToUserMarker();
};

Class_GeoMap.prototype.CleanUpMessage = function ()
{
	if (this._markers != null) this._markers.CleanUpMessage();
};

Class_GeoMap.prototype.PrintUserlist = function (id)
{
	if (this._markers != null) {
		return this._markers.PrintUserlist(id);
	}
};

/* Live-tunable globals, driven by the Settings sliders. SetNetworkDelay
 * keeps the read interval, write interval, and stale-marker TTL in
 * lockstep so users do not end up with mismatched timers. */
Class_GeoMap.prototype.SetNetworkDelay = function (delay)
{
	if (delay < 15) delay = 15;
	GLOBAL_NETWORK_SENDATA_MAXITIME = delay;
	GLOBAL_NETWORK_GETDATA = delay;
	GLOBAL_LIMIT_TTL = (delay + 30) * 2;
};

Class_GeoMap.prototype.SetSoundsOffOn = function (toggle)
{
	GLOBAL_PLAY_SOUNDS = toggle;
};
