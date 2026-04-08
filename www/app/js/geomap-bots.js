/*
 * Class Class_AirBot
 *
 * Last commit by $Author: obooklage $
 * Date - $Date: 2012-06-18 16:37:05 +0200 (lun. 18 juin 2012) $
 * Revision - $Rev: 319 $
 * Id : $Id: geomap-bots.js 319 2012-06-18 14:37:05Z obooklage $
 *
 * Migrated from Google Maps to Leaflet
 * */

function Class_AirBot(map)
{
var gmap = map;

var tyrosse_vpsp_droite_marker = null;
var dax_vpsp_droite_marker = null;
var mdm_vpsp_droite_marker = null;

var intervalID = null;
var data_timer_refresh = 5000; /* 5 secondes */

	/*
	 *  Functions
	 *
	 */

	this.create=function(location)
	{
		var vpspIcon = L.icon({
			iconUrl: './images/vpsp-droite.png',
			iconSize: [60, 29],
			iconAnchor: [30, 15]
		});

		/* Saint Vincent de Tyrosse */
		tyrosse_vpsp_droite_marker = L.marker([43.6601, -1.3148], {
			icon: vpspIcon,
			title: "PimpomPIN ! a Tyrosse"
		}).addTo(gmap);

		/* Arènes de DAX */
		dax_vpsp_droite_marker = L.marker([43.7121, -1.0511], {
			icon: vpspIcon,
			title: "PimpomPIN ! aux Arenes de DAX"
		}).addTo(gmap);

		/* Mont de Marsan */
		mdm_vpsp_droite_marker = L.marker([43.8977, -0.4674], {
			icon: vpspIcon,
			title: "PimpomPIN ! a Mont de Marsan"
		}).addTo(gmap);

		/* Put a timer for update the bots on the map */
		intervalID = window.setInterval(private_refresh_bots_timer, data_timer_refresh);
	}

	function private_refresh_bots_timer()
	{
		if( intervalID != null )
		{
			window.clearInterval(intervalID); /* DO NOT LOOP! as Ajax Asynchron */
			intervalID = window.setInterval(private_refresh_bots_timer, data_timer_refresh);
		}
	}

}
