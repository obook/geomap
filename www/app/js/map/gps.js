/*
 * Project: GeoMap
 * File: geomap-gps.js
 * Description: GPS geolocation wrapper (Class_GPS)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/*
 * Public
 * 
 * */

var gps_lastposition_status = STATE_POSITION_UNKNOWN;
var gps_lastposition_date = null;
var gps_lastposition_latitude = null;
var gps_lastposition_longitude = null;
var gps_lastposition_accuracy = null;
var gps_lastposition_speed = null;
var gps_lastposition_altitude = null;
var gps_lastposition_altitudeAccuracy = null;
var gps_lastposition_heading = null;

/*
 * 
 * Class
 * 
 * */

function Class_GPS(gmap,user_id,user_name)
{
var guser_id = user_id;
var guser_name = user_name;

var WatchPositionId = null;

var shown_info_speed = false;

// We only accept cached positions whose age is not
// greater than 10 minutes. If the user agent does not have a fresh
// enough cached position object, it will immediately invoke the error
// callback.

/*
 * ! DONOT use enableHighAccuracy: false (tested on NexuS-S)
 * */
 
var geoOptions = { maximumAge: 0, enableHighAccuracy: true, timeout: 30000, frequency: 30000 };

var first_fix_centered = false;
var last_gps_error_shown = null;

function gps_show_toast(msg)
{
	if (last_gps_error_shown === msg) return;
	last_gps_error_shown = msg;
	if (typeof app !== 'undefined' && app && app.toast)
	{
		app.toast.create({
			text: msg,
			position: 'center',
			closeTimeout: 4000
		}).open();
	}
}

function gps_clear_toast_state()
{
	last_gps_error_shown = null;
}

	/*
	 *  Constructor
	 * 
	 * 
	 * 
	 */
	
	console.log('[GeoMap] GPS init: ' + user_name);
	
	/* jquery mobile button */

	$('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-inactive');

	/*
	 *  Functions
	 * 
	 * 
	 * 
	 */
	 	
	this.start=function()
	{
		console.log('[GeoMap] GPS started: ' + user_name);

		if (!navigator.geolocation)
		{
			console.warn('[GeoMap] Geolocation not supported');
			gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
			return;
		}

		if( gps_lastposition_status != STATE_POSITION_OK )
		{
			gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
		}

		/* One-shot initial fix to populate the position quickly. The
		 * continuous watchPosition below then keeps the position fresh
		 * on its own; no periodic getCurrentPosition is needed and would
		 * only cause spurious timeouts on platforms without GPS hardware
		 * (e.g. Chrome Linux relying on network-based geolocation). */
		navigator.geolocation.getCurrentPosition(private_GetPosition_Success, private_GetPosition_Error, geoOptions);
		WatchPositionId = navigator.geolocation.watchPosition(private_watchPosition_Success, private_watchPosition_Error, geoOptions);
	}

	var toogle_animation = -1;
	
	/*
	 * 
	 *  Returns by getCurrentPosition
	 * 
	 * 
	 * */
	
	function private_GetPosition_Success(currposition)
	{
		/* Memorize */
		gps_lastposition_status = STATE_POSITION_OK;
		gps_lastposition_latitude = currposition.coords.latitude;
		gps_lastposition_longitude = currposition.coords.longitude;
		gps_lastposition_accuracy = currposition.coords.accuracy;
		gps_lastposition_speed = currposition.coords.speed;
		gps_lastposition_altitude = currposition.coords.altitude;
		gps_lastposition_altitudeAccuracy = currposition.coords.altitudeAccuracy;
		gps_lastposition_heading = currposition.coords.heading;
		gps_lastposition_date = new Date();

		console.log('[GeoMap] GPS fix: lat=' + gps_lastposition_latitude + ' lon=' + gps_lastposition_longitude + ' acc=' + gps_lastposition_accuracy + 'm');
		gps_clear_toast_state();
		private_center_on_first_fix();
	}

	function private_center_on_first_fix()
	{
		if (first_fix_centered) return;
		if (typeof Class_GeoMap !== 'undefined' && Class_GeoMap.skipLocate)
		{
			first_fix_centered = true;
			return;
		}
		if (gmap && gps_lastposition_latitude != null && gps_lastposition_longitude != null)
		{
			/* Zoom level matches ZoomToUserMarker so the manual button and
			 * the automatic first-fix view are visually consistent. */
			gmap.setView([gps_lastposition_latitude, gps_lastposition_longitude], 16);
			first_fix_centered = true;
		}
	}
	
	function private_GetPosition_Error(error)
	{
		console.error('[GeoMap] GPS error: ' + error.message);
		gps_lastposition_date = new Date();
		var toast_msg = '';
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				gps_lastposition_status = STATE_PERMISSION_DENIED;
				toast_msg = t('gps.toast_denied');
			break;

			case error.POSITION_UNAVAILABLE:
				gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
				toast_msg = t('gps.toast_unavail');
			break;

			case error.TIMEOUT:
				gps_lastposition_status = STATE_POSITION_TIMEOUT;
				toast_msg = t('gps.toast_timeout');
			break;

			default:
				gps_lastposition_status = STATE_POSITION_ERROR;
				toast_msg = t('gps.toast_error') + (error.message || t('gps.toast_unknown'));
			break;
		}
		gps_show_toast(toast_msg);
	}

	function private_watchPosition_Success(newposition)
	{
		/* Memorize */
		gps_lastposition_status = STATE_POSITION_OK;
		gps_lastposition_latitude = newposition.coords.latitude;
		gps_lastposition_longitude = newposition.coords.longitude;
		gps_lastposition_accuracy = newposition.coords.accuracy;
		gps_lastposition_speed = newposition.coords.speed;
		gps_lastposition_altitude = newposition.coords.altitude;
		gps_lastposition_altitudeAccuracy = newposition.coords.altitudeAccuracy;
		gps_lastposition_heading = newposition.coords.heading;
		gps_lastposition_date = new Date();

		gps_clear_toast_state();
		private_center_on_first_fix();
	}

	function private_watchPosition_Error(error)
	{
		gps_lastposition_date = new Date();
		var toast_msg = '';
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				console.warn('[GeoMap] GPS watch: permission denied');
				gps_lastposition_status = STATE_PERMISSION_DENIED;
				toast_msg = t('gps.toast_denied');
			break;

			case error.POSITION_UNAVAILABLE:
				console.warn('[GeoMap] GPS watch: position unavailable');
				gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
				toast_msg = t('gps.toast_unavail');
			break;

			case error.TIMEOUT:
				console.warn('[GeoMap] GPS watch: timeout');
				gps_lastposition_status = STATE_POSITION_TIMEOUT;
				toast_msg = t('gps.toast_timeout');
			break;

			default:
				console.warn('[GeoMap] GPS watch: unknown error ' + error.code);
				gps_lastposition_status = STATE_POSITION_ERROR;
				toast_msg = t('gps.toast_watch_error') + (error.message || t('gps.toast_unknown'));
			break;
		}
		if (toast_msg) gps_show_toast(toast_msg);
	}
	
	function private_update_state_label()
	{
		var text = t('gps.wait');
		var color = 'var(--text-ghost)';
		switch (gps_lastposition_status)
		{
			case STATE_POSITION_OK:
				if (gps_lastposition_accuracy != null && gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY)
				{
					var acc = ' ' + Math.round(gps_lastposition_accuracy) + 'M';
					if (gps_lastposition_accuracy < 50)
					{
						text = t('gps.lock') + acc;
						color = 'var(--green, #00ff41)';
					}
					else if (gps_lastposition_accuracy < 200)
					{
						text = t('gps.ok') + acc;
						color = 'var(--green, #00ff41)';
					}
					else
					{
						text = t('gps.weak') + acc;
						color = 'var(--amber, #ff9500)';
					}
				}
				else
				{
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
		if ($label.length)
		{
			if ($label.text() !== text) $label.text(text);
			$label.css('color', color);
		}
	}

	this.update=function()
	{
		private_update_state_label();
		if( (gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY) && (gps_lastposition_status == STATE_POSITION_OK) )
		{
			if( toogle_animation != 1 )
			{
				/* old method
				$('#gps_image').attr('src','images/gps-active.gif');
				 */
				 
				/* jquery mobile button */

				$('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-active');

				toogle_animation = 1;
			}
			
			if( gps_lastposition_speed > 10 )
			{
				/* meters per second -> kilometers per hour */
				var format_speed = Math.round(gps_lastposition_speed * 3.6);
				jQuery('#map_speed_id').html( format_speed + ' KM/H' );
				shown_info_speed = true;
			}
			else if (shown_info_speed == true )
			{
				shown_info_speed = false;
				jQuery('#map_speed_id').html( GLOBAL_APPNAME );				
			}
		}
		else
		{
			if( toogle_animation != 2 )
			{
				console.warn('[GeoMap] GPS bad conditions: acc=' + gps_lastposition_accuracy + 'm status=' + gps_lastposition_status);
				$('#button_GPS .toolbar-icon').attr('class', 'toolbar-icon icon-gps-bad-conditions');
				
								
				toogle_animation = 2;
				if (shown_info_speed == true )
				{
					shown_info_speed = false;
					jQuery('#map_speed_id').html( GLOBAL_APPNAME );
				}
			}
		}
	}
		
	this.stop=function() /*  Called only when 'Quit' button is pressed */
	{
		if( WatchPositionId != null )
		{
			navigator.geolocation.clearWatch(WatchPositionId);
			WatchPositionId = null;
		}
	}
	
}
