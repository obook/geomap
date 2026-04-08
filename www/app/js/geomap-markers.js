/*
 * Class Class_AirMarkers
 * 
 * Last commit by $Author: obooklage $
 * Date - $Date: 2012-07-31 12:32:12 +0200 (mar. 31 juil. 2012) $
 * Revision - $Rev: 326 $
 * Id : $Id: geomap-markers.js 326 2012-07-31 10:32:12Z obooklage $ 
 * 
 * 
 * */

var iColor = 1; /* 0 is reserved to local user */

function Class_AirMarkers(map,mission,id)
{
var guser_id = id;

var markers_array = []; /* Objects Array */

var master_clock;
var follow_marker_id = null;

var intervalID = null;
/* var data_timer_refresh = 2000;  2 secondes -> see Class_AirUser for set the same value */
TEMPORARY_GLOBAL_NETWORK_GETDATA = 5; /* seconds */
var request_data_number = 0;

var toogle_server_respond = false;

var toolbar_hiden = true;
var toogle_animation = -1;

var markers_layer = null;
var accuracy_layer = null;

	/*
	 *  Constructor
	 * 
	 * 
	 * 
	 */
	 
	console.log('[GeoMap] Markers init: mission ' + mission);
		
	/* jquery mobile button */

	$('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-inactive');

	
	/*
	 *  Functions
	 * 
	 * 
	 * 
	 */
	 	
	this.start=function(markerslayer,accuracylayer)
	{	
		markers_layer = markerslayer;
		accuracy_layer = accuracylayer;
		/* Put a timer for update the markers on the map */
		intervalID = window.setInterval(private_refresh_users_timer, 2000);/* Pas trop long pour une premiere fois =  2 secondes ni même la deuxième !!!! */
	}

	function private_refresh_users_timer()
	{
		if( intervalID != null )
		{
			window.clearInterval(intervalID); /* DO NOT LOOP! as Ajax Asynchron */	
			intervalID = null;
			private_request_data();
			request_data_number++;
			if( request_data_number < 3 )
			{
				intervalID = window.setInterval(private_refresh_users_timer, TEMPORARY_GLOBAL_NETWORK_GETDATA*1000);
			}
			else
			{
				intervalID = window.setInterval(private_refresh_users_timer, GLOBAL_NETWORK_GETDATA*1000);				
			}
		}
	}
	
	function private_request_data()
	{
		// console.log("geomap-markers private_request_data : Call ajax for geomap-server-read");
		/* random value = force NO cache via http-caches */
		var random_id  = GetRandomID();
		var startTime = new Date().getTime();
		var elapsedTime = 0;

		jQuery.ajax({
			url: GLOBAL_SERVER + "/geomap-server-read.php",
			crossDomain: true,
			cache: false,
			dataType: "json",
			type:"POST",
			data:{ mission: mission, clsid: random_id },
			success: function(json) {
				elapsedTime = new Date().getTime() - startTime;
				if( json==null )
				{
					console.error('[GeoMap] Server read: null response');
					return;
				}
				console.log('[GeoMap] Server read: ' + (elapsedTime/1000) + 's');
				private_request_data_process_done(json);
			},
			error : function(json){
				console.error('[GeoMap] Server read failed: ' + JSON.stringify(json));
				if( toogle_animation != 3 )
				{
					toogle_animation = 3;
					
					
					$('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-error');
				
				}
			}
		});			
			
	}
	
	function private_request_data_process_done(json)
	{
		/* Signaler que le serveur a répondu — retirer le marqueur local */
		if( typeof geomap !== 'undefined' && geomap != null && typeof geomap.ServerResponded === 'function' )
		{
			geomap.ServerResponded();
		}

		/* Animate */

		if( toogle_animation == 1 )
		{

			toogle_animation = 2;

			$('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-active-dextre');
		}
		else
		{
			toogle_animation = 1;

			$('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-active-senestre');

		}
					
		$.each(json.users, 
			function(i,item)
			{
			var marker_exist = null;
			var marker_clock;
			
					
				/* for stats we set LAST_TIME_READ */
				
				LAST_TIME_READ = new Date();
			
				/* we mark : a server respond */
				
				if( toogle_server_respond == false )
				{
					toogle_server_respond = true;
				}

				/* Check datas complete : MUST exist for master !! */
			
				if( (item['userid'] == null) ||	(item["time"] == null)  )
				{
					console.warn('[GeoMap] Received incomplete data');
					return;
				}
													
				/* Search for existing marker */
				
				var existing_index = -1;
				
				for( var j = 0; j < markers_array.length; j++)
				{
					var marker = markers_array[j];
					if( marker.GetId() == item['userid'] )
					{
						marker_exist = marker;
						existing_index = j;
					}
				}

				if( item["userid"] == 'master' ) /* this is a special marker, give the master clock */
				{
					master_clock = item["time"];
					total_users_online = item["total"];
				}
				
				/* Maker already exist : update */
				else if( marker_exist != null )
				{
				var ttl = marker_exist.GetMarkerTTL();
				var newposition = new L.LatLng(item['latitude'],item['longitude']);
				
					if( (ttl <= (item["frequency"]+30) ) && (item["accuracy"] < 500) && (item["state"] == STATE_POSITION_OK) ) /* 30 sec */
					{		
						marker_exist.SetVisible(true);
						marker_exist.SetReceptionLevel(2);
						
						//console.log('Maker exist : %s UPDATED with reception level 2.',item["userid"]);

						/* Follow a (this?) marker. Only here, when signal is good */
						
						if( (follow_marker_id!=null) && (item["userid"] == follow_marker_id) )
						{
							map.panTo(newposition);
						}

					}
					else if( (ttl <= (item["frequency"]+60) ) && (item["accuracy"] < 500) ) /* 1 min */
					{
						marker_exist.SetVisible(true);
						marker_exist.SetReceptionLevel(1);
						//console.log('Maker exist : %s UPDATED ** but ** reception level = 1.',item["userid"]);				
					}
					else if ( (ttl <= (item["frequency"]+900)) && (item["accuracy"] < 500) ) /* 15 min */
					{
						marker_exist.SetVisible(true);
						marker_exist.SetReceptionLevel(0);
						//console.log('Maker exist : %s UPDATED ** but ** reception level = 0.',item["userid"]);			
					}
					else
					{
						/* pour l'instant, idem <= 900
						 * */
						marker_exist.SetReceptionLevel(0);
						if( item["accuracy"] > GLOBAL_MINIMUM_ACCURAY )
						{
							marker_exist.SetVisible(false);
						}
						else
						{
							marker_exist.SetVisible(true);							
						}
						//console.log('Maker exist : %s UPDATED ** but ** ttl > 900.',item["userid"]);	
						/*
						 * 
						 * PAS POUR L'INSTANT
						 * 
						 * marker_exist.SetVisible(false);						
						
						
						
						
						
						console.log('Maker exist : %s UPDATED ** but ** INVISIBLE.',item["userid"]);	
						* 
						* 
						* */
						
						/* Effacer ????? -> il risque d'être recréé si le fichier existe
						 * 
						 * */
					}
					
					if( item["state"] == STATE_POSITION_OK )
					{
						marker_exist.SetPosition(item["username"], newposition, item["accuracy"], item["heading"], item["speed"], item["battery"], item["time"]); /* bizarre pas de redraw si je le mets qu'en level 2 ?! */
					}
					
					marker_exist.SetMarkerTTL(master_clock - item['time']);
					
					var format_ttl = marker_exist.GetMarkerTTL();
					var unit_ttl = ' sec';
							
					if( format_ttl > 60 )
					{
						format_ttl = Math.round(format_ttl / 60);
						unit_ttl = ' min';
					}
					
					if( format_ttl > 60 )
					{
						format_ttl = Math.round(format_ttl / 60);
						unit_ttl = ' h';
					}
					
					marker_exist.SetTitle( "TTL: " + format_ttl + unit_ttl + "\nACC: " + item["accuracy"] + "m\nBAT: "+item["battery"]+"%" );	
					
					/* Message present ? */

					if( (item['message'] != null) && (item['message'] != "") )
					{
						marker_exist.PrintMessage(item['message'], item['time']);
						/*
						 * Ca ne marche pas su deux messages existes sur les markers qui sont offline -> toogle
						 * */
					}
					
					/* value 'active' changed ? */
					
					if ( item['active'] == 0 )
					{
						marker_exist.Remove();
						markers_array.splice(existing_index,1);
						marker_exist = null;   // free()?
						console.log('[GeoMap] Marker removed: ' + item["username"]);
					}


				}
				
				/* Maker not exist : create but not the master */
				else
				{
				var ttl = master_clock - item['time'];
				
					/* if( (ttl < (GLOBAL_MAXI_TTL*60*60) ) && (item['active'] == 1) && (item["state"] == STATE_POSITION_OK) ) /* eg : 24 heures : 24x60x60 = 86400 */
					
					if( (item['active'] == 1) && (item["state"] == STATE_POSITION_OK) ) /* eg : 24 heures : 24x60x60 = 86400 */
					{
						console.log('[GeoMap] New marker: ' + item["username"]);
						
						var position = new L.LatLng(item['latitude'],item['longitude']);
						var newMarker = new Class_Marker(map,position,item["userid"],item["username"]);
						
						markers_array.push(newMarker);
						
						if( item["userid"] == guser_id ) /* Its me => green marker */
						{
							newMarker.SetGreenMarker();
						}
						
						if( (item["accuracy"] > 500) || (item["state"] == STATE_POSITION_UNKNOWN ))
						{
							newMarker.SetVisible(false);
							newMarker.SetReceptionLevel(0);
						}
					}
					
				}	
			});	
	}
			
	function private_request_data_process()
	{
			
		/* Must be a valid JSON string. You can check at http://jsonlint.com/ */
		
		/* random value = force NO cache via http-caches */
		var random_id  = GetRandomID();
		
		// console.log('----------------------------------------------------- geomap-markers.js : private_request_data : getJSON');
		//var jqxhr = $.getJSON("http://geo.lapetitesouris.net/geomap-server-read.php?mission="+mission+"&clisd="+random_id,
		
		var jqxhr = $.getJSON("./geomap-server-read.php?mission="+mission+"&clisd="+random_id,  
		function(json)
		{

				
				
				
			
		}) /* function(json) */
		.success(function(json)
		{ 


		})
		.error(function(json)
		{ 
			// $('#network_image').attr('src','./images/radar-red.png');
			console.error('[GeoMap] Server read failed: ' + JSON.stringify(json));
			if( toogle_animation != 3 )
			{
				toogle_animation = 3;

				$('#button_network .toolbar-icon').attr('class', 'toolbar-icon icon-data-error');

			}
		})
		.complete(function(json)
		{

					
			/* Deboggage + essai d'effacement
			
			//console.log('** DEBUG - Liste des '+markers_array.length+' markers : ');
			
			for( var i = 0; i < markers_array.length; i++)
			{
				var marker = markers_array[i];
				var marker_ttl = marker.GetMarkerTTL();
				var server_ttl = marker.GetServerTTL();
				
				console.log('** DEBUG - Maker index %d = %s MarkerTTL = %d sec ServerTTL = %d sec', i, marker.GetId(), marker_ttl, server_ttl);
				
				/*
				 * 
				 * 
				 *  Essai de suppression :
				 * 
				 * */
				
				/* Retiré pour l'instant
				
				if( ( marker_ttl > 60 ) && (server_ttl > 900)) // No information from client since 1 min and no information from server about client since 15 min (file deleted)
				{
					marker.Remove();
					markers_array.splice(i,1);
					marker = null;   // free()?
					console.log('*********** DEBUG - marker_ttl = ' + marker_ttl + '    ' + server_ttl + ' : REMOVE index %d', i);
				}
				
			}		
			
			//console.log('** DEBUG - Liste des markers end. ');
			
			*/
											
		});		
	}
	
	/* External timer : called by external */
	
	this.update=function()
	{	

		
		/* Refrech infos : peut être TROP souvent ?!!! (1sec) */
		var users_online = 0;
		
		for( var i = 0; i < markers_array.length; i++)
		{
			var marker = markers_array[i];
			var ttl = marker.GetMarkerTTL();
			// if( (ttl < 60) && ( marker.GetVisible() == true ) )
			if( marker.GetVisible() == true )
			{
				users_online++;
			}
		}		
		

		/* Fill infobox */
		if( toogle_server_respond == true )
		{
			jQuery('#usersnumbers').html( "<font color='white'>" + (users_online) +"</font>" + "<font color='grey'>" + (markers_array.length-users_online) +"</font>"+"<font color='white'>"  + (total_users_online) + "</font>");
		}
		else
		{
			jQuery('#usersnumbers').html( '---' );		
		}

		for( var i = 0; i < markers_array.length; i++) /* !!!! Je NE reviens JAMAIS d'ici !! :donc probleme de marker.update() */
		{
			var marker = markers_array[i];
			marker.update(); /* update data infos on screen */
		}	
		
		/* Toolbar */
		
		if( toolbar_hiden == true )
		{
			toolbar_hiden = false;
			jQuery('#toolbar_up_right').show(1000);
		}	
		
			
	}
	
	this.unfollow=function()
	{
		console.log('[GeoMap] Unfollow marker');
		if( (GLOBAL_PLAY_SOUNDS == 'on') && (follow_marker_id!=null) )
		{
			playaudio('player_follow_off_id','assets/sounds/ding-reverse.ogg');
		}
		
		for( var i = 0; i < markers_array.length; i++)
		{
			var marker = markers_array[i];
			marker.SetDefaultIcon();
		}
		
		follow_marker_id = null;
	}
	
	this.ZoomToFitAllMarkers=function()
	{

		if( markers_array.length > 0 ) // markers presents
		{
		var markersgroup = new L.featureGroup();
		
			for( var i = 0; i < markers_array.length; i++)
			{
				var marker = markers_array[i];
				// console.log("ZoomToFitAllMarkers find marker " + marker.GetUsername());
				 if( marker.GetVisible() == true )
				 {
					var obj = marker.GetMarker();
					markersgroup.addLayer(obj);
				 }
			}
			
			map.fitBounds(markersgroup.getBounds());

		}
		
		this.unfollow();

	}

	this.ZoomToUserMarker=function()
	{
		if( (gps_lastposition_latitude!=null) && (gps_lastposition_longitude!=null) )
		{
			var latlng = new L.LatLng(gps_lastposition_latitude, gps_lastposition_longitude);
			map.setView( latlng, 16, false);
		}
		else
		{
			console.warn('[GeoMap] Cannot zoom: no GPS position');
		}
		
		this.unfollow();
	}

	this.CleanUpMessage=function()
	{
		jQuery('#messages_toolbar').hide(800);
		jQuery('#messages_id').empty();
	}
		
	this.PrintUserlist=function(id)
	{
		var html = "";

		html = "<table id='table-column-toggle' class='data-table' style='width:100%;'>\
		<thead>\
		<tr>\
		<th>USER</th>\
		<th data-priority='1'>DISTANCE</th>\
		<th data-priority='3'>ACC.</th>\
		<th data-priority='2'>TIME</th>\
		<th data-priority='4'>BATT.</th>\
		</tr>\
		</thead>\
		<tbody>\
		<tr>";
		

		for( var i = 0; i < markers_array.length; i++)
		{
			var marker = markers_array[i];
			var username = marker.GetUsername();
			var accuracy = marker.GetAccuracy();
			var battery = marker.GetBatteryLevel();
			var TTL = marker.GetMarkerTTL();
			var unit_ttl = ' sec';
			
			var lat1 = marker.GetLat();
			var lon1 = marker.GetLon();
			var lat2 = gps_lastposition_latitude;
			var lon2 = gps_lastposition_longitude;
									
			distance = Math.round(GetDistance(lat1,lon1,lat2,lon2));
			
			
			if( accuracy > 1000 )
			{
				accuracy = Math.round(accuracy/1000) + " Km";
			}
			else
			{
				accuracy = Math.round(accuracy) + " m";				
			}
			
			if( battery == -1 )
			{
				battery = '-';
			}
			else
			{
				battery = battery + " %";
			}
			
			if( TTL > 60 )
			{
				TTL = Math.round(TTL / 60);
				unit_ttl = ' m';
			}
			
			if( TTL > 60 )
			{
				TTL = Math.round(TTL / 60);
				unit_ttl = ' h';
			}
			
			// jQuery('<li></li>').html('<a rel="external" target="_blank" href="https://maps.google.com/?daddr='+marker.GetLat()+','+marker.GetLon()+'">' + username + ' - ' + distance + ' km </a>').appendTo(id);

			html = html +   "<th><a href=\"https://maps.google.com/?daddr="+lat1+","+lon1+"\" target='_blank' data-rel='external'>"+username+"</a></th>\
							<td>"+distance+" km</td>\
							<td>"+accuracy+"</td>\
							<td>"+TTL+unit_ttl+"</td>\
							<td>"+battery+"</td>\
							</tr>";
		}
		
		html = html + "</tbody></table>";
		
		jQuery(id).html(html);

		
	}
	
	

	this.stop=function() /*  Called only then 'Quit' button is pressed */
	{

		// alert('geomap-user : this.stop=function');
		if( intervalID != null )
		{
			window.clearInterval(intervalID);
		}
	}
	
	
	
	
	
		
	/*
	 * 
	 * 
	 * 
	 *  Class : Class_Marker
	 * 
	 * 
	 * 
	 * */
	
	
	/* J'ai déplacé la classe DANS la principale -> ça ne change rien donc je remets ici */

	function Class_Marker(map,position,id,name)
	{
	var marker = null; /* This is the marker obj */
	var circle_accuracy = null /* This is the accuracy circle obj */
			
	var myid = id;
	var myname = name;
	var my_html_color = null;
	var mylastposition = position;
	var mylastposition_latitude = position.lat;
	var mylastposition_longitude = position.lng;
	
	var mylastspeed = 0;
	var mylastaccuracy =0;
	var mylastbatterylevel = 0;
	
	var visible = true;
	
	var gps_date = 0;		/* marker GPS clock : last time GPS send , field 'date' in JSON eg : 1326206896 */
	var marker_ttl = 0; 	/* master - marker delay */
	var server_ttl = 0; 	/* local - master delay */
	var reception = 2; 		/* niveau de reception : 2=ok ,1=moyen,0=plus de reception */
	var toogle_animation_icon = true; /* toogle true or true */
	var toogle_animation_info = true;
	var toogle_animation_char = '<img src="./images/led-green-1.png">';
	
	var guser_lastmessage = "";
	
	var update_gap_ttl = 0;
	
	var default_icon_color_index = 1;

	
		/*
		 *  Constructor
		 * 
		 * 
		 * 
		 */
		
		// console.log('Create New Class_Marker name [%s] %s',name, id);
		
		/* Play sound */
		
		if( GLOBAL_PLAY_SOUNDS == 'on' )
		{
			playaudio('player_news_user_id','assets/sounds/pop1.ogg');
		}
		
		var last_update_date = new Date();		
		
		var IsIcon = L.divIcon({ 
			iconSize: new L.Point(64, 68), 
			html: name
		});
		
		default_icon_color_index = iColor;
		iColor++;
		if( iColor > 9 )
		{
			iColor = 1;
		}
		
		// console.log("Marker "+name+" color = "+AwesomeColors[default_icon_color_index]);
		 
		/*
		 * For icon, see http://fortawesome.github.io/Font-Awesome/icons/
		 * */
		
		marker = new L.Marker(position, { title: name }).bindLabel(name, { noHide: true }).addTo(markers_layer).showLabel();
		marker.setIcon( L.AwesomeMarkers.icon({icon: 'icon-male', color: AwesomeColors[default_icon_color_index], spin:false}) );

		/* Accuracy circle */

		circle_accuracy = L.circle(position, 0, {
			color: HtmlColors[default_icon_color_index],
			fillColor: HtmlColors[default_icon_color_index],
			fillOpacity: 0.2
		}).addTo(accuracy_layer);

		marker.addEventListener('click', function()
		{
			// il faut suivre ou ne plus suivre.
			if (follow_marker_id != myid )
			{
				// pas d'accès à : this.unfollow();
				// Play sound
				if( GLOBAL_PLAY_SOUNDS == 'on' )
				{
					playaudio('player_follow_on_id','assets/sounds/ding.ogg');
					console.log('[GeoMap] Following: ' + name)
				}
				
				follow_marker_id = myid;;
				toast("Following " + name);
		
			}
			else if (follow_marker_id == myid )
			{
				// Play sound
				if( GLOBAL_PLAY_SOUNDS == 'on' )
				{
					playaudio('player_follow_off_id','assets/sounds/ding-reverse.ogg');
					console.log('[GeoMap] Unfollowing: ' + name);
				}
				
				follow_marker_id = null;
				toast("UNFollowing " + name);

			}
		});
		
		// console.log('End New Class_Marker ' + id);
					
		/*
		 *  Functions
		 * 
		 * 
		 * 
		 */
		
		function update() /* called by external for refresh screen */
		{
		var format_ttl = marker_ttl;
		var unit_ttl = ' sec';
				
			if( format_ttl > 60 )
			{
				format_ttl = Math.round(format_ttl / 60);
				unit_ttl = ' min';
			}
			
			if( format_ttl > 60 )
			{
				format_ttl = Math.round(format_ttl / 60);
				unit_ttl = ' h';
			}
		/*				
			if( format_ttl > 24 )
			{
				format_ttl = Math.round(format_ttl / 24);
				unit_ttl = ' d';
			}

			if( format_ttl > 189 )
			{
				format_ttl = Math.round(format_ttl / 189);
				unit_ttl = ' w';
			}
			*/
			
			/* meters per second -> kilometers per hour */
			var format_speed = Math.round(mylastspeed * 3.6);
			
						
			/*
			 * 
			 *  Combien de difference entre last_update et now ??
			 * 
			 * */
			
			var now = new Date();
			server_ttl = Math.round( ( now.getTime() - last_update_date.getTime() ) / 1000 ); /* diff IS NOT a Date() object but milliseconds difference between the two dates*/
			var format_server_ttl = server_ttl;
			var unit_server_ttl = ' sec';
					
			if( format_server_ttl > 60 )
			{
				format_server_ttl = Math.round(format_server_ttl / 60);
				unit_server_ttl = ' min';
			}
			
			if( format_server_ttl > 60 )
			{
				format_server_ttl = Math.round(format_server_ttl / 60);
				unit_server_ttl = ' h';
			}
	
			user_date = Math.round( ( (now.getTime()/1000) - gps_date ) ); /* diff IS NOT a Date() object but milliseconds difference between the two dates*/
			var format_user_date = user_date;
			var unit_user_date = ' sec';
					
			if( format_user_date > 60 )
			{
				format_user_date = Math.round(format_user_date / 60);
				unit_user_date = ' min';
			}
			
			if( format_user_date > 60 )
			{
				format_user_date = Math.round(format_user_date / 60);
				unit_user_date = ' h';
			}
			
			/*
			if( format_user_date > 24 )
			{
				format_user_date = Math.round(format_user_date / 24);
				unit_user_date = ' d';
			}
			* */
			
			/*
			 * 
			 *  la diff est égale 1 ou 2 secondes si le fichier est présent
			 *  Si le fichier devient absent : ça augmente, tout comme la TTL
			 * 
			 * */
			
			if( marker_ttl < GLOBAL_LIMIT_TTL*1000 )
			{
				//toogle_animation_char = '<img src="./images/led-green-1.png">';	
			}
			else
			{
				//toogle_animation_char = '<img src="./images/led-gray.png">';				
			}

			
/*
 *  item time -> (PHP) Returns the current time measured in the number of seconds since the Unix Epoch (January 1 1970 00:00:00 GMT). SQL -> bigint(20) 
 *  getTime -> (JAVASCRIPT) Returns the number of milliseconds since midnight Jan 1, 1970
 * */	

			if( gps_date > 0 )
			{
				if( format_speed > 5 )
				{
					marker.updateLabelContent( myname + '<br>' + format_user_date + ' ' + unit_user_date + '<br>' + format_speed + ' km/h' );
				}
				else
				{
					marker.updateLabelContent( myname + '<br>' + format_user_date + ' ' + unit_user_date );
				}
			}
			else
			{
				marker.updateLabelContent( myname );
			}
				
			/* il FAUT absolument séparer le temps de réponse et la précision */
			

			if( circle_accuracy != null )
			{
				circle_accuracy.setLatLng( new L.LatLng(mylastposition_latitude,mylastposition_longitude) );
				circle_accuracy.setRadius(mylastaccuracy);
			}

			if( reception == 2 ) /* Très bonne : réponse dans les délais et avec une bonne précision */
			{
				marker.setIcon( L.AwesomeMarkers.icon({icon: 'icon-male', color: AwesomeColors[default_icon_color_index], spin:false}) );
			}
			else /* ne répond pas dans les délais OU n'a pas une bonne précision */
			{
				marker.setIcon( L.AwesomeMarkers.icon({icon: 'icon-time', color: AwesomeColors[default_icon_color_index], spin:false}) );
			}
		}
		
		function GetId()
		{
			return(myid);
		}
		
		function GetUsername()
		{
			return(myname);
		}
		
		function GetMarker()
		{
			return(marker);
		}
		
		function SetPosition(name, LatLng, accuracy, heading, speed, battery, date)
		{
			myname = name; /* If name changed */
			
			marker.hideLabel();
			// marker.unbindLabel();
			if( circle_accuracy != null )
			{
				circle_accuracy.setLatLng(LatLng);
				circle_accuracy.setRadius(accuracy);
			}
			marker.setLatLng(LatLng);
			// marker.bindLabel(myLabeLText,{noHide: true});
			marker.showLabel();
			marker.update();

			mylastposition = LatLng;
			mylastposition_latitude = LatLng.lat;
			mylastposition_longitude = LatLng.lng;
			mylastspeed = speed;
			mylastaccuracy = accuracy;
			mylastbatterylevel = battery;

			/*
			 * 
			 * Essai pour detecter : plus d'update
			 * */
			
			var now = new Date();
			update_gap_ttl = now.getTime() - last_update_date.getTime();
			last_update_date = now;
			
			gps_date = date;
			
		}
		
		function SetTitle(title)
		{
			marker.options.title = '['+myname+']\n'+title;
		}
		
		function SetMarkerTTL(val)
		{
			marker_ttl = val;
		}
		
		function GetMarkerTTL()
		{
			return(marker_ttl);
		}
		
		function GetServerTTL()
		{
			return(server_ttl);
		}
		
		function SetVisible(val)
		{
			// console.log("Marker " + myname + " setvisibility " + val);

			
			if( visible != val )
			{
				visible = val;

				if(val == true)
				{
					marker.setOpacity(1.0);
					marker.showLabel();				
				}
				else
				{
					marker.setOpacity(0.3);
					marker.hideLabel();
				}
			}
		}

		function GetVisible(val)
		{
			return(visible);
		}
		
		function SetDefaultIcon()
		{
			marker.setIcon( L.AwesomeMarkers.icon({icon: 'icon-male', color: AwesomeColors[default_icon_color_index], spin:false}) );
		}
				
		function SetReceptionLevel(val)
		{
			reception = val;  /* 2 to 0 */
		}
		
		function SetGreenMarker()
		{
			// For icons list : http://fortawesome.github.io/Font-Awesome/icons/
			default_icon_color_index = 0; /* RED in fact now */
			
			marker.setIcon( L.AwesomeMarkers.icon({icon: 'icon-eye-open', color: AwesomeColors[default_icon_color_index], spin:false}) );
			circle_accuracy.setStyle({ 	color: HtmlColors[default_icon_color_index] , fillColor: HtmlColors[default_icon_color_index] });
		}
		
		function Remove()
		{
			if( circle_accuracy != null )
			{
				accuracy_layer.removeLayer(circle_accuracy);
				circle_accuracy = null;
			}
			if( marker != null )
			{
				markers_layer.removeLayer(marker);
				marker = null;
			}
		}
		
		function GetLastPosition()
		{
			return(mylastposition);
		}
		
		function PrintMessage(text, serverTime)
		{
		var current_message = myname + ": " + text;

			if( current_message != guser_lastmessage )
			{
				// Play sound
				if( GLOBAL_PLAY_SOUNDS == 'on' )
				{
					playaudio('player_newmessage_id', 'assets/sounds/ccir_small.ogg');
				}

				console.log('[GeoMap] New message: ' + $("<div/>").html(current_message).text());

				var d = serverTime ? new Date(serverTime * 1000) : new Date();
				var hh = ('0'+d.getHours()).slice(-2);
				var mm = ('0'+d.getMinutes()).slice(-2);
				var ss = ('0'+d.getSeconds()).slice(-2);
				jQuery('#messages_id').prepend('<div style="margin-bottom:4px;"><span style="font-size:9px;opacity:0.5;">' + hh+':'+mm+':'+ss + '</span> ' + current_message + '</div>');
				jQuery('#messages_toolbar').show(1000);
				/* toast(current_message); */
					
				guser_lastmessage = current_message;
			}	
		}
		
		function GetLat()
		{
			return(mylastposition_latitude);
		}
	
		function GetLon()
		{
			return(mylastposition_longitude);
		}
		
		function GetAccuracy()
		{
			return(mylastaccuracy);
		}
		
		function GetBatteryLevel()
		{
			return(mylastbatterylevel);
		}
			
		// gmarkerList[item['userid']].setIcon(guser_icon);
		
		return{update:update,GetId:GetId,GetUsername:GetUsername,
		GetMarker:GetMarker,SetPosition:SetPosition,SetTitle:SetTitle,
		SetMarkerTTL:SetMarkerTTL,GetMarkerTTL:GetMarkerTTL,GetServerTTL:GetServerTTL,
		SetVisible:SetVisible,GetVisible:GetVisible,SetDefaultIcon:SetDefaultIcon,
		SetReceptionLevel:SetReceptionLevel,SetGreenMarker:SetGreenMarker,
		Remove:Remove,GetLastPosition:GetLastPosition,PrintMessage:PrintMessage,
		GetLat:GetLat,GetLon:GetLon,GetAccuracy:GetAccuracy,GetBatteryLevel:GetBatteryLevel};
	} /* Class_Marker(map,position,id) */
	
	
	
} /* Class_AirMarkers(map,mission,id) */

