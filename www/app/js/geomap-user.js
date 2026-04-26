/*
 * Project: GeoMap
 * File: geomap-user.js
 * Description: User session and server sync (Class_AirUser)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function Class_AirUser(map,mission,id,name)
{
var gmap = map;
var gmission = mission;
var guser_id = id;
var guser_name= name;

var glastposition_date = null; /* !!!! TODO !!! */
var glastposition_zoom = null; /* !!!! TODO !!! */

var intervalDataID = null;
var TEMPORARY_GLOBAL_NETWORK_SENDATA_MAXITIME = 10; /* sec */
var send_data_number = 0;

var geoOptions = { 
maximumAge: 0,
enableHighAccuracy: true,
timeout: 20000,
frequency: 15000
};

var startTime = new Date().getTime();
var elapsedTime = 0;

	/*
	 *  Constructor
	 * 
	 * 
	 * 
	 */
	
	console.log('[GeoMap] User init: ' + name);
	
	var d = new Date();
	var label = ""+d.getHours()+d.getMinutes()+d.getSeconds();

	/*
	 *  Functions
	 * 
	 * 
	 * 
	 */
	 	
	this.start=function()
	{
		console.log('[GeoMap] User started: ' + name);
		/* Fait TROP tot car GPS pas pret : */
		// je me gourait de variables (ordre) ci dessous ???? -> oui GLOBAL_NETWORK_SENDATA_MAXITIME mais je le laisse inhibé quand même
		// private_store_to_server(1,GLOBAL_NETWORK_SENDATA_MAXITIME,gmission,guser_id,guser_name,gps_lastposition_status, gps_lastposition_latitude,gps_lastposition_longitude,gps_lastposition_accuracy,gps_lastposition_speed,gps_lastposition_altitude,gps_lastposition_altitudeAccuracy,gps_lastposition_heading);

		intervalDataID = window.setInterval(private_refresh_users_timer, TEMPORARY_GLOBAL_NETWORK_SENDATA_MAXITIME*1000);/* Pas trop long pour une premiere fois = 5 secondes */
				
	}
	
	/* Timer : send position get via gps javascript */
	
	function private_refresh_users_timer() /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CA LOOP QUAND MEME !! */
	{
		if( intervalDataID != null )
		{
			window.clearInterval(intervalDataID); /* DO NOT LOOP */
			intervalDataID = null;
			// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : private_refresh_users_timer');
			
			private_store_to_server(1,GLOBAL_NETWORK_SENDATA_MAXITIME,gmission,guser_id,guser_name,gps_lastposition_status, gps_lastposition_latitude,gps_lastposition_longitude,gps_lastposition_accuracy,gps_lastposition_speed,gps_lastposition_altitude,gps_lastposition_altitudeAccuracy,gps_lastposition_heading);
			send_data_number++;
			if( send_data_number < 2 )
			{
				intervalDataID = window.setInterval(private_refresh_users_timer, TEMPORARY_GLOBAL_NETWORK_SENDATA_MAXITIME*1000);
			}
			else
			{
				intervalDataID = window.setInterval(private_refresh_users_timer, GLOBAL_NETWORK_SENDATA_MAXITIME*1000);			
			}

		}
		else
		{
			
		}
	}
	
	/*
	 *  Store data to the server via JQuery (Ajax) function
	 * 
	 * 
	 * 
	 */	
	
	var store_active = false;
	
	function private_store_to_server(active, frequency, missionid, id, name, state, latitude, longitude, accuracy, speed, altitude, altitudeAccuracy, heading)
	{
		if( store_active == true ) /* Pas sur quand ça empeche les LOOPS !!! si je crois que c'est bien .. */
		{
			console.warn('[GeoMap] Write skipped: previous request pending');
			return;
		}
			
		store_active = true;
		startTime = new Date().getTime();
		elapsedTime = 0;
		
		/*
		if( gps_lastposition_status == STATE_POSITION_UNKNOWN )
		{
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : private_store_to_server for ' + guser_name + ' can not store STATE_POSITION_UNKNOWN');
			store_active = false;
			return; // rustine ! il faudrait latlong non null
		}
		* */
		
		// console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : private_store_to_server for ' + guser_name + " LAT:"+latitude+" LONG:"+longitude+" ACC:"+accuracy);
		
		/* random value = force NO cache via http-caches */
		var random_id = GetRandomID();
		var batterylevel = get_batterylevel();
		
		// console.log("Call ajax for geomap-server-write.php");
		var obj = { active:active, frequency:frequency, mission:missionid, userid:id, username:name, state:state, latitude:latitude, longitude:longitude, accuracy:accuracy, speed:speed, altitude:altitude, altitudeAccuracy:altitudeAccuracy, heading:heading, battery:batterylevel, clsid:random_id };
		$.ajax({
			url: GLOBAL_SERVER +"/geomap-server-write.php",
			crossDomain: true,
			cache: false,
			type:"POST",
			dataType: "html",
			data:obj,
			success: function(json) {
				elapsedTime = new Date().getTime() - startTime;
				console.log('[GeoMap] Server write: ' + (elapsedTime/1000) + 's');
				store_active = false;
			},
			error : function(json){
				/* Pas besoin de JSON.stringify car le retour est du html ! */
				console.error('[GeoMap] Server write failed: ' + JSON.stringify(json));
				store_active = false; 
			}
		});
				
		
				/*
		//$.post("http://geo.lapetitesouris.net/geomap-server-write.php", { active:active, frequency:frequency, mission:missionid, userid:id, username:name, state:state, latitude:latitude, longitude:longitude, accuracy:accuracy, speed:speed, altitude:altitude, altitudeAccuracy:altitudeAccuracy, heading:heading, clsid:random_id },
		$.post("./geomap-server-write.php", { active:active, frequency:frequency, mission:missionid, userid:id, username:name, state:state, latitude:latitude, longitude:longitude, accuracy:accuracy, speed:speed, altitude:altitude, altitudeAccuracy:altitudeAccuracy, heading:heading, clsid:random_id },
		function(data)
		{	
			// for stats we set LAST_TIME_WRITE
			LAST_TIME_WRITE = new Date();
			
			store_active = false;
		})
		.success(function()
		{; 
			store_active = false;	
		})
		.error(function(data)
		{ 
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : store error : '+data);	
			store_active = false;
		})
		.complete(function()
		{
			store_active = false;
		});
		
		/* Can not handle for device without GPS or with GPS errors */

		
	}
	
	this.SendMessage=function(text)
	{
		/* random value = force NO cache via http-caches */
		var random_id = GetRandomID();	
			
		console.log('[GeoMap] Sending message...');
		var obj = { active:1, mission:gmission, userid:guser_id, username:guser_name, message:text, clsid:random_id };
		$.ajax({
			url: GLOBAL_SERVER + "/geomap-server-message-write.php",
			crossDomain: true,
			cache: false,
			type:"POST",
			dataType: "html",
			data:obj
		}).done(function( arg )
		{
			console.log('[GeoMap] Message sent');
			// for stats we set LAST_TIME_WRITE
			LAST_TIME_WRITE = new Date();
		}).fail(function(jqXHR, textStatus)
		{
			console.error('[GeoMap] Message send failed: ' + textStatus);
		});
		
		/* random value = force NO cache via http-caches
		var random_id = GetRandomID();
				
		$.post("./geomap-server-message-write.php", { active:1, mission:gmission, userid:guser_id, username:guser_name, message:text, clsid:random_id },
		function(data)
		{
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : SendMessage post function = '+data);		
			// for stats we set LAST_TIME_WRITE
			
			LAST_TIME_WRITE = new Date();
		})
		.success(function()
		{; 
			// On passe par là en cas de succès (au moins) console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : SendMessage post success');
		})
		.error(function(data)
		{ 
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : SendMessage post error : '+data);	
		})
		.complete(function()
		{
			// On passe par là en cas de succès (au moins) console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap-user : SendMessage post complete');	
		});
		* 
		*  */


	}
	
	this.stop=function() /*  Called only then 'Quit' button is pressed */
	{

		if( intervalDataID != null )
		{
			window.clearInterval(intervalDataID);
		}
		
	}

}
