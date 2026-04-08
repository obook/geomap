/*
 * geomap.js
 * 
 * Last commit by $Author: obooklage $
 * Date - $Date: 2013-08-03 08:32:02 +0200 (sam. 03 août 2013) $
 * Revision - $Rev: 293 $
 * Id : $Id: geomap.js 293 2013-08-03 06:32:02Z obooklage $ 
 * 
 * 
 * */
console.log('Loading geomap parts.');
/*
 * Under chromium, document.write crash for file not found (06/2013) with the message :
 * "Unknown chromium error: -6"
 */
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-globals.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-storage.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-main.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-gps.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-user.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-markers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-soundplayer.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-bots.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-latlngctrl.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/geomap-javascript-tools.js"></script>');
