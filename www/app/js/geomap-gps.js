/*
 * geomap-gps.js
 * Description: GPS geolocation wrapper — tracks user position via the
 *              W3C Geolocation API and updates the toolbar icon state.
 * Author: O. Booklage
 * Date: April 2026
 * License: MIT
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

var GetPositionID = -1;
var WatchPositionId = null;

var shown_info_speed = false;

// We only accept cached positions whose age is not
// greater than 10 minutes. If the user agent does not have a fresh
// enough cached position object, it will immediately invoke the error
// callback.

/*
 * ! DONOT use enableHighAccuracy: false (tested on NexuS-S)
 * */
 
var geoOptions = { maximumAge: 0, enableHighAccuracy: true, timeout: 600000, frequency: 600000 };

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

		if( gps_lastposition_status != STATE_POSITION_OK )
		{
			gps_lastposition_status = STATE_POSITION_UNAVAILABLE;
		}
		private_getPosition();
		GetPositionID = window.setInterval(private_timer, 1*1000);
		WatchPositionId = navigator.geolocation.watchPosition(private_watchPosition_Success, private_watchPosition_Error, geoOptions);
	
	}
	
	/* Timer : get position and animate  */
	
	var toogle_animation = -1;

	function private_timer()
	{
		if (!navigator.geolocation) {
			console.warn('[GeoMap] Geolocation not supported');
			return;
		}

		if( GetPositionID != -1 )
		{
			window.clearInterval(GetPositionID); /* DO NOT LOOP */
			GetPositionID = -1;

			private_getPosition();
					
			GetPositionID = window.setInterval(private_timer, GLOBAL_SERVER_PING*1000);					
		}
	}
		
	function private_getPosition()
	{
		// geo_position_js.getCurrentPosition(private_GetPosition_Success, private_GetPosition_Error, {maximumAge:3, timeout:10000} );
		
		/* Sous SAFARI : on passe pas là et c'est BLOQUé !!  */
		// geo_position_js.getCurrentPosition(private_GetPosition_Success,private_GetPosition_Error);		
		
		navigator.geolocation.getCurrentPosition(private_GetPosition_Success,private_GetPosition_Error, geoOptions);

	}
	
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
	}
	
	function private_GetPosition_Error(error)
	{
		console.error('[GeoMap] GPS error: ' + error.message);
		gps_lastposition_date = new Date();	
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				gps_lastposition_status = STATE_PERMISSION_DENIED;	
			break;
			
			case error.POSITION_UNAVAILABLE:	
				gps_lastposition_status = STATE_POSITION_UNAVAILABLE;	
			break;
			
			case error.TIMEOUT:	
				gps_lastposition_status = STATE_POSITION_TIMEOUT;	
			break;
			
			default:		
				gps_lastposition_status = STATE_POSITION_ERROR;	
			break;
		}
	}	

	function private_watchPosition_Success(newposition)
	{
		// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-GPS : private_watchPosition_Success ');
		
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
	}

	function private_watchPosition_Error(error)
	{
		gps_lastposition_date = new Date();
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				console.warn('[GeoMap] GPS watch: permission denied');
				gps_lastposition_status = STATE_PERMISSION_DENIED;	
			break;
			
			case error.POSITION_UNAVAILABLE:
				console.warn('[GeoMap] GPS watch: position unavailable');
				gps_lastposition_status = STATE_POSITION_UNAVAILABLE;	
			break;
			
			case error.TIMEOUT:
				console.warn('[GeoMap] GPS watch: timeout');
				gps_lastposition_status = STATE_POSITION_TIMEOUT;	
			break;
			
			default:		
				console.warn('[GeoMap] GPS watch: unknown error ' + error.code);
				gps_lastposition_status = STATE_POSITION_ERROR;	
			break;
		}
	}
	
	this.update=function()
	{
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
			console.warn('[GeoMap] GPS bad conditions: acc=' + gps_lastposition_accuracy + 'm status=' + gps_lastposition_status);
			if( toogle_animation != 2 )
			{

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
		
	this.stop=function() /*  Called only then 'Quit' button is pressed */
	{
		if( GetPositionID != -1 )
		{
			window.clearInterval(GetPositionID);
		}
		if( WatchPositionId != null )
		{
			navigator.geolocation.clearWatch(WatchPositionId);
		}
	}
	
}
