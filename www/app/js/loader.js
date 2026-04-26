/*
 * Project: GeoMap
 * File: loader.js
 * Description: Module loader - injects every script the app depends on, in dependency order
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Order matters: globals first, then the i18n module, then storage, then
 * the per-page modules. Module files use document.write because the codebase
 * targets older mobile browsers (no native ES modules). */
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/globals.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/i18n/i18n.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/storage.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/gps.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/network/user.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/audio/sound-player.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/latlng-control.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/tools/tools.js"></script>');
