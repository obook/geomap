/*
 * Project: GeoMap
 * File: geomap-main.js
 * Description: Main map controller (Class_GeoMap)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function Class_GeoMap(map_id,server_url)
{
var gmapdiv = document.getElementById(map_id);

var gmap = null;
var markers_layer = null;
var accuracy_layer = null;
var draw_tools_layer = null;
var local_marker = null;
var local_accuracy_circle = null;
var server_responded = false;

var gmission_id;
var guser_id;
var guser_name;

var id_data_timer_refresh  = -1;

var count_server_animation = -1;

var gps = null;
var airuser = null;
var markers = null;

	/*
	 *  Constructor
	 *
	 *
	 *
	 */

		/* Load the map
		*
		* */

		console.log('[GeoMap] Map init: ' + map_id);

		GLOBAL_SERVER = server_url;

		if(gmapdiv)
		{
			gmapdiv.style.overflow = "hidden"; //  hidden, cache tout ce qui dépasse.
		}

		/**
		 * get url paramaters
		 */
		function getURLParameter(name) {
		    return decodeURI(
		        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,])[1]
		    );
		}

		var regionParameter = getURLParameter('region');
		var region = (regionParameter === 'undefined') ? '' : regionParameter;

		var osmAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors';

		var normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: osmAttribution});
		var terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
			attribution: osmAttribution + ', &copy; OpenTopoMap',
			/* OpenTopoMap returns 403 above zoom 17. The vendored Leaflet
			 * (0.6.2) predates maxNativeZoom, so we hard-cap maxZoom on the
			 * layer; above this zoom the terrain layer is hidden and the
			 * user can either zoom back or switch to a higher-zoom basemap. */
			maxZoom: 17
		});
		var hybrid = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: '&copy; Esri'});
		var midnight = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {attribution: '&copy; CartoDB'});
		var tactical = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; CartoDB'});

		/* Test */
		var map_style =
		[ { stylers: [ { visibility: "off" }, { invert_lightness: true } ] },{ featureType: "road", elementType: "labels", stylers: [ { visibility: "on" } ] },{ featureType: "road", elementType: "geometry", stylers: [ { visibility: "on" } ] },{ featureType: "water", stylers: [ { visibility: "on" } ] },{ featureType: "landscape", stylers: [ { visibility: "on" }, { lightness: 18 }, { hue: "#3bff00" } ] },{ featureType: "road.arterial", elementType: "labels", stylers: [ { visibility: "on" }, { gamma: 0.58 }, { hue: "#ffaa00" }, { saturation: -46 } ] },{
				featureType: 'administrative',
				elementType: 'all',
				stylers: [
					{ visibility: 'on' }
				]
			},{ } ];

		// je n'arrive pas a atteindre la map pour lui regler son style : normal.setOpacity(0);




		/* Layers */

		markers_layer = L.layerGroup();
		accuracy_layer = L.layerGroup();
		draw_tools_layer = L.layerGroup();

		gmap = L.map(map_id, {
			center: new L.LatLng(48.853289, 2.349071),
			zoom: 2,
			layers: [normal,markers_layer,accuracy_layer,draw_tools_layer]
		});


		/* Search

		new L.Control.GeoSearch({
			provider: new L.GeoSearch.Provider.OpenStreetMap()
		}).addTo(gmap);
 */
		var baseMaps = {};
		baseMaps[t('layers.normal')] = normal;
		baseMaps[t('layers.hybrid')] = hybrid;
		baseMaps[t('layers.terrain')] = terrain;
		baseMaps[t('layers.tactical')] = tactical;
		baseMaps[t('layers.night')] = midnight;

		var overlayMaps = {};
		overlayMaps[t('layers.markers')] = markers_layer;
		overlayMaps[t('layers.accuracy')] = accuracy_layer;
		overlayMaps[t('layers.tools')] = draw_tools_layer;

		/* Layer control */
		L.control.layers(baseMaps,overlayMaps).addTo(gmap);

		/* Initial map centering. If a GPS fix was already obtained on the
		 * home page (during the ENGAGE click, to keep iOS Safari's
		 * user-gesture context), use it now. Otherwise Class_GPS will
		 * center the map on its first fix. The skipLocate flag suppresses
		 * both behaviors when restoring a saved view. */
		if( !Class_GeoMap.skipLocate
			&& gps_lastposition_status === STATE_POSITION_OK
			&& gps_lastposition_latitude != null
			&& gps_lastposition_longitude != null )
		{
			gmap.setView([gps_lastposition_latitude, gps_lastposition_longitude], 16);
		}
		Class_GeoMap.skipLocate = false;

		/* Marche bien :

		var url = 'Stage_21.gpx'; // URL to your GPX file
		new L.GPX(url, {async: true}).on('loaded', function(e) {
		  gmap.fitBounds(e.target.getBounds());
		}).addTo(gmap);
		*
		* */


		/* DRAW

		var drawnItems = new L.FeatureGroup(); // Calque des elements posés sur la carte
		gmap.addLayer(drawnItems);

		var drawControl = new L.Control.Draw({
			draw: {
				position: 'topleft',
				polygon: {
					title: 'Draw a polygon!',
					allowIntersection: false,
					drawError: {
						color: '#b00b00',
						timeout: 1000
					},
					shapeOptions: {
						color: '#c0ff00'
					},
					showArea: true
				},
				circle: {
					shapeOptions: {
						color: '#662d91'
					}
				}
			},
			edit: {
				featureGroup: drawnItems
			}
		});

		gmap.addControl(drawControl);

		 */

		var new_marker_index = 0;

		gmap.on('draw:created', function (e) {
			var type = e.layerType;
			var	obj = e.layer;

			if (type === 'marker') {
				//obj.bindPopup('MARKER '+new_marker_index).openPopup();
				//new_marker_index++;

				var localname = '<font color="black">MARK'+new_marker_index+'</font>';

				obj.unbindLabel();
				obj.options.title = '';
				obj.setIcon( L.AwesomeMarkers.icon({icon: 'icon-plus-sign', color: AwesomeColors[new_marker_index], spin:false}) );
				new_marker_index++;
				if( new_marker_index > 9 )
				{
					new_marker_index = 0;
				}
				obj.bindPopup(localname).bindLabel(localname);
				// obj.setLabelNoHide(true);
				obj.showLabel();
				obj.update();
			}

			drawnItems.addLayer(obj);
		});

	/*
	 *  Functions
	 *
	 *
	 *
	 */

	this.start=function(mission_id, user_id, user_name)
	{
		console.log('[GeoMap] Start session: ' + user_name);

		gmission_id = mission_id;
		guser_id = user_id;
		guser_name = user_name;

		if( mission_id == "2222" )
		{	/*
			var MyStyle = [
			{ featureType: 'road', elementType: 'all', stylers: [ { visibility: 'off' } ] },
			{ featureType: 'poi', elementType: 'all', stylers: [ { visibility: 'off' } ] } ];
			gmap.setOptions({styles: MyStyle});
			* */
		}

		if( mission_id == "9999" )
		{
			/* Add new control to display latitude and longitude */
			/*
			var latLngControl = new LatLngControl(gmap);
			google.maps.event.addListener(gmap, 'mouseover', function(mEvent) {
			latLngControl.set('visible', true);
			});
			google.maps.event.addListener(gmap, 'mouseout', function(mEvent) {
			latLngControl.set('visible', false);
			});
			google.maps.event.addListener(gmap, 'mousemove', function(mEvent) {
			latLngControl.updatePosition(mEvent.latLng);
			});
			* */
		}

		/* Run GPS (if exist) */

		gps = new Class_GPS(gmap,guser_id,guser_name);
		gps.start();

		airuser = new Class_User(gmap,gmission_id,guser_id,guser_name);
		airuser.start();

		/* Put online users as markers 'on' the map */

		markers = new Class_Markers(gmap,gmission_id,guser_id);
		markers.start(markers_layer,accuracy_layer);

		/* Run the timer */

		id_data_timer_refresh = window.setInterval(private_refresh_data_timer, GLOBAL_REFRESH_INFO_SCREEN*1000);


	} /* function private_startmap(user_position) */

	/*
	 *
	 * Dispatch timer for animation
	 *
	 */

	function private_refresh_data_timer()
	{

		if( id_data_timer_refresh != -1 )
		{
			window.clearInterval(id_data_timer_refresh); /* DO NOT LOOP!*/
			id_data_timer_refresh = -1;

			/* Refresh markers on the map, animation */
			if( markers != null )
			{
				markers.update();
			}

			/* Refresh toolbar, animation */
			if( gps != null )
			{
				gps.update();
			}

			/* Local fallback marker when the server is unreachable */
			if( !server_responded && gps_lastposition_status == STATE_POSITION_OK && gps_lastposition_latitude != null )
			{
				var latlng = L.latLng(gps_lastposition_latitude, gps_lastposition_longitude);
				if( local_marker == null )
				{
					local_marker = L.marker(latlng, {
						icon: L.AwesomeMarkers.icon({icon: 'icon-user', color: 'green', spin: false}),
						title: guser_name
					}).addTo(markers_layer);
					local_marker.bindPopup('<b>' + guser_name + '</b><br/>LOCAL').bindLabel(guser_name);
				}
				else
				{
					local_marker.setLatLng(latlng);
				}
				if( gps_lastposition_accuracy && gps_lastposition_accuracy > 0 && gps_lastposition_accuracy < GLOBAL_MINIMUM_ACCURAY )
				{
					if( local_accuracy_circle == null )
					{
						local_accuracy_circle = L.circle(latlng, gps_lastposition_accuracy, {
							color: '#ffffff', fillColor: '#cccccc', fillOpacity: 0.25, weight: 2
						}).addTo(accuracy_layer);
					}
					else
					{
						local_accuracy_circle.setLatLng(latlng);
						local_accuracy_circle.setRadius(gps_lastposition_accuracy);
					}
				}
			}


			/* a ranger ... */

			var currentTime = new Date();
			read_gap = Math.round( (currentTime.getTime() - LAST_TIME_READ.getTime())/1000 );

			/*
			var hours = LAST_TIME_READ.getHours();
			var minutes = LAST_TIME_READ.getMinutes();
			var seconds = LAST_TIME_READ.getSeconds();

			if (hours < 10)
			hours = "0" + hours;

			if (minutes < 10)
			minutes = "0" + minutes;

			if (seconds < 10)
			seconds = "0" + seconds;
			*

			$('#toolbar_up span').html( hours + ":" + minutes + ":" + seconds);

			$('#toolbar_up_right span').html( read_gap +' sec');
			*/

			/*
			$('#readdelay').html( read_gap +' sec');
			* */

			if( read_gap <= (GLOBAL_NETWORK_GETDATA+5) ) /* The server have GLOBAL_NETWORK_GETDATA + 5 seconds for responds */
			{
				/* Animation */

				if( count_server_animation != 1 )
				{
					count_server_animation = 1;
					$('#network_image').attr('src','./images/data-active.gif');
				}

			}
			else
			{
				if( count_server_animation != 2 )
				{
					count_server_animation = 2;
					$('#network_image').attr('src','./images/data-error.png');
				}
			}

			id_data_timer_refresh = window.setInterval(private_refresh_data_timer, GLOBAL_REFRESH_INFO_SCREEN*1000);
		}
	}

	/*
	 *
	 *  Functions
	 *
	 */

	this.SendMessage=function(text)
	{
		if( (airuser != null)&&(text!="") )
		{
			airuser.SendMessage(text);
		}
		else
		{
			console.error('[GeoMap] SendMessage failed: no user or empty message');
		}
	}

	this.stop=function()
	{
		console.log('[GeoMap] Stopping...');

		if( gps != null )
		{
			gps.stop();
		}

		if( markers != null )
		{
			markers.stop();
		}

		if( airuser != null )
		{
			airuser.stop();
		}

		/* FAIT dans map.php mais PAS idéal */
		/* random value = force NO cache via http-caches
		var random_id  = GetRandomID();

		$.post(GLOBAL_SERVER + "/geomap-server-logout.php", { mission:gmission_id, userid:guser_id },
		function(data)
		{
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap.js : this.stop : geomap-server-logout.php post function = '+data);
		})
		.success(function()
		{;
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap.js : this.stop : geomap-server-logout.php post success');
		})
		.error(function(data)
		{
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap.js : this.stop : geomap-server-logout.php post error : '+data);
		})
		.complete(function()
		{
			console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++ geomap.js : this.stop : geomap-server-logout.php post complete');
		});
*/
	}

	this.logout=function()
	{
		var random_id  = GetRandomID();

		$.post(GLOBAL_SERVER + "/geomap-server-logout.php", { mission:gmission_id, userid:guser_id },
		function(data)
		{
			console.log('[GeoMap] Logout response received');
		})
		.success(function()
		{;
			console.log('[GeoMap] Logout success');
		})
		.error(function(data)
		{
			console.error('[GeoMap] Logout failed');
		})
		.complete(function()
		{
			console.log('[GeoMap] Logout complete');
		});
	}

	this.ZoomToFitAllMarkers=function()
	{
		if( markers != null )
		{
			markers.ZoomToFitAllMarkers();
		}
	}/* this.ZoomOnAllMarkers */

	this.ZoomToUserMarker=function()
	{
		if( markers != null )
		{
			markers.ZoomToUserMarker();
		}
	}/* this.ZoomToUserMarker */

	this.CleanUpMessage=function()
	{
		if( markers != null )
		{
			markers.CleanUpMessage();
		}
	}

	this.GetMap=function()
	{
		return(gmap);
	}

	this.destroy=function()
	{
		this.stop();
		if( gmap != null )
		{
			gmap.remove();
			gmap = null;
		}
	}

	this.SaveState=function()
	{
		if( gmap == null ) return null;
		var state = {
			center: gmap.getCenter(),
			zoom: gmap.getZoom()
		};
		/* Find the currently active base layer */
		var baseNames = Object.keys(baseMaps);
		for( var i = 0; i < baseNames.length; i++ )
		{
			if( gmap.hasLayer(baseMaps[baseNames[i]]) )
			{
				state.baseLayer = baseNames[i];
				break;
			}
		}
		/* Find active overlay layers */
		state.overlays = [];
		var overlayNames = Object.keys(overlayMaps);
		for( var j = 0; j < overlayNames.length; j++ )
		{
			if( gmap.hasLayer(overlayMaps[overlayNames[j]]) )
			{
				state.overlays.push(overlayNames[j]);
			}
		}
		return state;
	}

	this.RestoreState=function(state)
	{
		if( gmap == null || state == null ) return;
		/* Restore center and zoom level */
		gmap.setView(state.center, state.zoom);
		/* Restore base layer */
		if( state.baseLayer && baseMaps[state.baseLayer] )
		{
			var baseNames = Object.keys(baseMaps);
			for( var i = 0; i < baseNames.length; i++ )
			{
				if( gmap.hasLayer(baseMaps[baseNames[i]]) )
				{
					gmap.removeLayer(baseMaps[baseNames[i]]);
				}
			}
			gmap.addLayer(baseMaps[state.baseLayer]);
		}
		/* Restore overlay layers */
		if( state.overlays )
		{
			var overlayNames = Object.keys(overlayMaps);
			for( var j = 0; j < overlayNames.length; j++ )
			{
				var name = overlayNames[j];
				if( state.overlays.indexOf(name) >= 0 )
				{
					if( !gmap.hasLayer(overlayMaps[name]) ) gmap.addLayer(overlayMaps[name]);
				}
				else
				{
					if( gmap.hasLayer(overlayMaps[name]) ) gmap.removeLayer(overlayMaps[name]);
				}
			}
		}
	}


	this.ServerResponded=function()
	{
		if( !server_responded )
		{
			server_responded = true;
			if( local_marker != null )
			{
				markers_layer.removeLayer(local_marker);
				local_marker = null;
			}
			if( local_accuracy_circle != null )
			{
				accuracy_layer.removeLayer(local_accuracy_circle);
				local_accuracy_circle = null;
			}
		}
	}

	this.PrintUserlist=function(id)
	{
		if( markers != null )
		{
			return( markers.PrintUserlist(id) );
		}
	}


	/* Special Settings */

	this.SetNetworkDelay=function(delay)
	{
		if( delay < 15 )
		{
			delay = 15;
		}

		GLOBAL_NETWORK_SENDATA_MAXITIME = delay;
		GLOBAL_NETWORK_GETDATA = delay;

		GLOBAL_LIMIT_TTL = (delay+30)*2;

	}

	this.SetSoundsOffOn=function(toggle) /* true or false */
	{
		GLOBAL_PLAY_SOUNDS = toggle;
	}

}

/* Static flag: when true, the next Class_GeoMap construction must not
 * recenter the map on the user position (used when restoring a saved view).
 * Initialized once at module load so any reader that runs before the first
 * construction sees a defined boolean. */
Class_GeoMap.skipLocate = false;
