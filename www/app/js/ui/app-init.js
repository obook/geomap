/*
 * Project: GeoMap
 * File: app-init.js
 * Description: Framework7 application instance, route table, and the global page-translation hook
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

var app = new Framework7({
	el: '#app',
	name: 'GeoMap',
	theme: 'auto',
	darkMode: true,
	routes: [
		{
			path: '/',
			pageName: 'home'
		},
		{
			path: '/map/',
			pageName: 'map',
			keepAlive: true,
			on: {
				pageInit: function (e, page) {
					console.log("#map pageInit");
					get_storage();
					geometrychanged();
				},
				pageBeforeIn: function (e, page) {
					console.log("#map pageBeforeIn");
					get_storage();
					document.title = username + '@' + team;
					geometrychanged();
				},
				pageAfterIn: function (e, page) {
					if (geomap != null) {
						console.log("[GeoMap] Map resume");
						var map = geomap.GetMap();
						if (map) map.invalidateSize();
					} else {
						console.log("[GeoMap] Map create");
						var mapCanvas = document.getElementById('map_canvas');
						if (mapCanvas) {
							mapCanvas.innerHTML = '';
							delete mapCanvas._leaflet_id;
						}
						geomap = new Class_GeoMap("map_canvas", GLOBAL_SERVER);
						geomap.SetNetworkDelay(get_netdelay());
						geomap.SetSoundsOffOn(get_sound());
						geomap.start(team, handle, username);
					}
					jQuery('#map_title_id').html(username + '@' + team);
					geometrychanged();
					/* Recompute after the full render. */
					setTimeout(geometrychanged, 100);
					setTimeout(geometrychanged, 500);
				}
			}
		},
		{ path: '/about/',     url: './app/pages/about.html' },
		{ path: '/menu/',      url: './app/pages/menu.html' },
		{ path: '/options/',   url: './app/pages/options.html' },
		{ path: '/messages/',  url: './app/pages/messages.html' },
		{ path: '/connected/', url: './app/pages/connected.html' },
		{ path: '/share/',     url: './app/pages/share.html' }
	],
	on: {
		init: function () {
			console.log('Framework7 initialized');
			I18n.init();
			get_storage();
			/* Honour ?server= and ?channel= URL parameters. */
			var params = new URLSearchParams(window.location.search);
			var urlServer = params.get('server');
			var urlChannel = params.get('channel');
			if (urlServer) {
				set_server(urlServer);
				GLOBAL_SERVER = urlServer;
			}
			if (urlChannel) {
				set_channel(urlChannel);
			}
			jQuery('#username-id').val(get_username());
			jQuery('#select-choice-mission-id').val(get_channel());
			var sv = get_server();
			jQuery('#server-url-id').val((sv === '.') ? '' : sv);
			validateEngageButton();
		}
	}
});

/* Re-apply translations whenever a Framework7 page is rendered. Static
 * pages (.html templates) carry data-i18n attributes that need to be
 * processed each time they enter the DOM. */
app.on('pageBeforeIn pageInit', function (page) {
	if (typeof I18n !== 'undefined' && page && page.el) {
		I18n.applyTo(page.el);
	}
});

var mainView = app.views.main;
