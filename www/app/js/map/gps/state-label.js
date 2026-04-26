/*
 * Project: GeoMap
 * File: state-label.js
 * Description: Class_GPS.update - drives the navbar GPS state pill, the toolbar icon, and the speed display
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Refresh the navbar GPS pill (#gps_state_label) text + colour from
 * the current gps_lastposition_status / accuracy. */
Class_GPS.prototype._update_state_label = function ()
{
	var text = t('gps.wait');
	var color = 'var(--text-ghost)';

	switch (gps_lastposition_status) {
		case STATE_POSITION_OK:
			if (gps_lastposition_accuracy != null && gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY) {
				var acc = ' ' + Math.round(gps_lastposition_accuracy) + 'M';
				if (gps_lastposition_accuracy < 50) {
					text = t('gps.lock') + acc;
					color = 'var(--green, #00ff41)';
				} else if (gps_lastposition_accuracy < 200) {
					text = t('gps.ok') + acc;
					color = 'var(--green, #00ff41)';
				} else {
					text = t('gps.weak') + acc;
					color = 'var(--amber, #ff9500)';
				}
			} else {
				text = t('gps.weak');
				color = 'var(--amber, #ff9500)';
			}
			break;

		case STATE_PERMISSION_DENIED:
			text = t('gps.denied');
			color = 'var(--red, #ff0000)';
			break;

		case STATE_POSITION_UNAVAILABLE:
			text = t('gps.unavail');
			color = 'var(--red, #ff0000)';
			break;

		case STATE_POSITION_TIMEOUT:
			text = t('gps.timeout');
			color = 'var(--amber, #ff9500)';
			break;

		case STATE_POSITION_ERROR:
			text = t('gps.error');
			color = 'var(--red, #ff0000)';
			break;

		case STATE_POSITION_UNKNOWN:
		default:
			text = t('gps.wait');
			color = 'var(--text-ghost)';
			break;
	}

	var $label = jQuery('#gps_state_label');
	if ($label.length) {
		if ($label.text() !== text) $label.text(text);
		$label.css('color', color);
	}
};

/* Public update - called every Class_GeoMap.GLOBAL_REFRESH_INFO_SCREEN
 * tick by the orchestrator timer. Refreshes the state pill, switches
 * the GPS toolbar icon class, and shows speed in km/h above 10 m/s. */
Class_GPS.prototype.update = function ()
{
	this._update_state_label();

	var goodFix = (gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY)
		&& (gps_lastposition_status == STATE_POSITION_OK);

	if (goodFix) {
		if (this._toggle_animation != 1) {
			jQuery('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-active');
			this._toggle_animation = 1;
		}
		if (gps_lastposition_speed > 10) {
			/* m/s -> km/h */
			var format_speed = Math.round(gps_lastposition_speed * 3.6);
			jQuery('#map_speed_id').html(format_speed + ' KM/H');
			this._shown_info_speed = true;
		} else if (this._shown_info_speed) {
			this._shown_info_speed = false;
			jQuery('#map_speed_id').html(GLOBAL_APPNAME);
		}
	} else {
		if (this._toggle_animation != 2) {
			console.warn('[GeoMap] GPS bad conditions: acc=' + gps_lastposition_accuracy + 'm status=' + gps_lastposition_status);
			jQuery('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-bad-conditions');
			this._toggle_animation = 2;
			if (this._shown_info_speed) {
				this._shown_info_speed = false;
				jQuery('#map_speed_id').html(GLOBAL_APPNAME);
			}
		}
	}
};
