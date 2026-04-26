/*
 * Project: GeoMap-Air
 * File: geomap.js
 * Description: Module loader (document.write of all geomap-*.js scripts)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/*
 * Under chromium, document.write crash for file not found (06/2013) with the message :
 * "Unknown chromium error: -6"
 */
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-globals.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-i18n.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-storage.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-main.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-gps.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-user.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-markers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-soundplayer.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-bots.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-latlngctrl.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-javascript-tools.js"></script>');
