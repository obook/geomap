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
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/i18n/dict-en.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/i18n/dict-fr.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/i18n/i18n.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/storage.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main/main.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main/layers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main/timer.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main/state.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/main/accessors.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/gps/gps.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/gps/handlers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/gps/state-label.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/network/user/user.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/network/user/sender.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/markers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/network.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/process.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/public.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/marker.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/marker-update.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/marker-position.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/markers/marker-state.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/audio/sound-player.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/map/latlng-control.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/core/tools/tools.js"></script>');

/* UI layer: home.js sets up SoundManager and reads the storage globals,
 * then app-init.js creates the Framework7 instance and the routes. The
 * page-* and helper files register handlers that depend on app being
 * defined, so they load last. */
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/home.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/app-init.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/helpers.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/page-home.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/page-map.js"></script>');
document.write('<script type="text/javascript" charset="utf-8" src="app/js/ui/page-others.js"></script>');
