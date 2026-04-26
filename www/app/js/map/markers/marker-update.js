/*
 * Project: GeoMap
 * File: marker-update.js
 * Description: Class_Marker.update - redraws the label, accuracy circle, and icon based on the current state
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Refresh this marker on screen. Called by Class_Markers.update once
 * per tick. */
Class_Marker.prototype.update = function ()
{
	var format_speed = Math.round(this._mylastspeed * 3.6); /* m/s -> km/h */
	var now = new Date();

	this._server_ttl = Math.round((now.getTime() - this._last_update_date.getTime()) / 1000);

	var user_date = Math.round((now.getTime() / 1000) - this._gps_date);
	var format_user_date = user_date;
	var unit_user_date = ' sec';
	if (format_user_date > 60) {
		format_user_date = Math.round(format_user_date / 60);
		unit_user_date = ' min';
	}
	if (format_user_date > 60) {
		format_user_date = Math.round(format_user_date / 60);
		unit_user_date = ' h';
	}

	/*  item time -> (PHP) Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT). SQL -> bigint(20)
	 *  getTime  -> (JAVASCRIPT) Returns the number of milliseconds since midnight Jan 1, 1970 */

	var noGps = (!this._mylastaccuracy || this._mylastaccuracy <= 0
		|| this._mylastaccuracy >= GLOBAL_MINIMUM_ACCURAY);
	var labelSuffix = noGps
		? '<br><span style="font-size:9px;opacity:0.6;">(no GPS)</span>'
		: '';

	if (this._gps_date > 0) {
		if (!noGps && format_speed > 5) {
			this._marker.updateLabelContent(
				this._myname + '<br>'
				+ format_user_date + ' ' + unit_user_date
				+ '<br>' + format_speed + ' km/h'
			);
		} else {
			this._marker.updateLabelContent(
				this._myname + '<br>'
				+ format_user_date + ' ' + unit_user_date
				+ labelSuffix
			);
		}
	} else {
		this._marker.updateLabelContent(this._myname + labelSuffix);
	}

	if (this._circle_accuracy != null) {
		this._circle_accuracy.setLatLng(
			new L.LatLng(this._mylastposition_latitude, this._mylastposition_longitude)
		);
		if (this._mylastaccuracy && this._mylastaccuracy > 0
			&& this._mylastaccuracy < GLOBAL_MINIMUM_ACCURAY)
		{
			this._circle_accuracy.setRadius(this._mylastaccuracy);
			this._circle_accuracy.setStyle({ opacity: 1, fillOpacity: 0.25 });
		} else {
			this._circle_accuracy.setStyle({ opacity: 0, fillOpacity: 0 });
		}
	}

	if (this._reception == 2) {
		/* Good signal: agent on time and accurate */
		this._marker.setIcon(L.AwesomeMarkers.icon({
			icon: 'icon-male',
			color: AwesomeColors[this._default_icon_color_index],
			spin: false
		}));
	} else {
		/* Late or imprecise: clock icon */
		this._marker.setIcon(L.AwesomeMarkers.icon({
			icon: 'icon-time',
			color: AwesomeColors[this._default_icon_color_index],
			spin: false
		}));
	}
};
