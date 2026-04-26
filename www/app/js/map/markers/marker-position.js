/*
 * Project: GeoMap
 * File: marker-position.js
 * Description: Class_Marker position and visibility mutators - SetPosition, SetVisible, SetNoGpsMode
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

Class_Marker.prototype.SetPosition = function (name, LatLng, accuracy, heading, speed, date)
{
	this._myname = name;

	this._marker.hideLabel();
	if (this._circle_accuracy != null) {
		this._circle_accuracy.setLatLng(LatLng);
		if (accuracy && accuracy > 0 && accuracy < GLOBAL_MINIMUM_ACCURAY) {
			this._circle_accuracy.setRadius(accuracy);
			this._circle_accuracy.setStyle({ opacity: 1, fillOpacity: 0.25 });
		} else {
			this._circle_accuracy.setStyle({ opacity: 0, fillOpacity: 0 });
		}
	}
	this._marker.setLatLng(LatLng);
	this._marker.showLabel();
	this._marker.update();

	this._mylastposition = LatLng;
	this._mylastposition_latitude = LatLng.lat;
	this._mylastposition_longitude = LatLng.lng;
	this._mylastspeed = speed;
	this._mylastaccuracy = accuracy;

	var now = new Date();
	this._update_gap_ttl = now.getTime() - this._last_update_date.getTime();
	this._last_update_date = now;

	this._gps_date = date;
};

/* Toggle the marker between fully visible (opacity 1) and faded
 * (opacity 0.3) when the agent is stale. The label hides too. */
Class_Marker.prototype.SetVisible = function (val)
{
	if (this._visible == val) return;
	this._visible = val;

	if (val == true) {
		this._marker.setOpacity(1.0);
		this._marker.showLabel();
		if (this._circle_accuracy != null) {
			this._circle_accuracy.setStyle({ opacity: 1, fillOpacity: 0.25 });
		}
	} else {
		this._marker.setOpacity(0.3);
		this._marker.hideLabel();
		if (this._circle_accuracy != null) {
			this._circle_accuracy.setStyle({ opacity: 0, fillOpacity: 0 });
		}
	}
};

/* When a remote user reports anything other than STATE_POSITION_OK,
 * their last known position is stale. We hide the pin icon (so the
 * map does not falsely place them at that point) but keep the
 * floating username label visible at the same lat/lon when the
 * marker is otherwise visible (visible=true). When the marker has
 * already been faded out by SetVisible(false) (stale TTL or accuracy
 * beyond GLOBAL_MINIMUM_ACCURAY) we leave the label hidden so we do
 * not resurrect a ghost label. The accuracy circle is hidden either
 * way. */
Class_Marker.prototype.SetNoGpsMode = function (val)
{
	if (val) {
		this._marker.setOpacity(0);
		if (this._visible) this._marker.showLabel();
		else this._marker.hideLabel();
		if (this._circle_accuracy != null) {
			this._circle_accuracy.setStyle({ opacity: 0, fillOpacity: 0 });
		}
	} else {
		this._marker.setOpacity(this._visible ? 1.0 : 0.3);
		if (this._visible) this._marker.showLabel();
		else this._marker.hideLabel();
		if (this._circle_accuracy != null && this._visible) {
			this._circle_accuracy.setStyle({ opacity: 1, fillOpacity: 0.25 });
		}
	}
};
