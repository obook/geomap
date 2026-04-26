# Architecture

This document describes the structure of GeoMap, the runtime data flow between the front-end and the two interchangeable back-ends, and the client-side module hierarchy.

## Directory layout

```
geomap/
  www/                           Front-end (deployed to GitHub Pages)
    index.html                   Single-page application entry point
    app/
      css/                       Application styles and Dark Ops theme
      js/                        Application modules
        geomap.js                Module loader
        geomap-main.js           Map controller (Leaflet)
        geomap-gps.js            GPS management
        geomap-markers.js        Marker rendering and updates
        geomap-user.js           User session and server sync
        geomap-storage.js        localStorage persistence
        geomap-bots.js           Bot / automation support
        geomap-globals.js        Global constants and timing knobs
      images/                    App icons
      pages/                     Framework7 page templates
    assets/sounds/               Notification sound files
    vendor/                      Vendored third-party libraries
      framework7/                Framework7 UI framework
      leaflet/                   Leaflet + extensions
      jquery/                    jQuery 1.9
      font-awesome/              Icon font
      soundmanager/              SoundManager2 audio engine
  server-sql/                    Back-end PHP + MySQL (original)
    geomap-server-config-sample.php   Database config template
    geomap-server-read.php            Read users and messages
    geomap-server-write.php           Write user position
    geomap-server-message-write.php   Post a message
    geomap-server-logout.php          Disconnect a user
    geomap-server-stats.php           Usage statistics
    geomap-server-maintenance.php     Cleanup inactive sessions
    geomap-server-info.php            Server diagnostics
    install.sql                       Database schema
    index.php                         Legacy admin panel
  server-php/                    Back-end PHP + JSON files (no database)
    geomap-server-config-sample.php   Data directory config
    geomap-json-storage.php           JSON file storage helpers
    geomap-server-read.php            Read users and messages
    geomap-server-write.php           Write user position
    geomap-server-message-write.php   Post a message
    geomap-server-logout.php          Disconnect a user
    geomap-server-stats.php           Usage statistics
    geomap-server-maintenance.php     Cleanup inactive sessions
    geomap-server-info.php            Server diagnostics
    data/                             Runtime JSON storage
  .github/workflows/pages.yml    GitHub Pages deployment workflow
```

## Two interchangeable back-ends

`server-php/` (JSON files) and `server-sql/` (MySQL) expose the same five HTTP endpoints, so the front-end is unaware which is in use:

| Endpoint                          | Purpose                                                  |
|-----------------------------------|----------------------------------------------------------|
| `geomap-server-write.php`         | Upsert the current user's position for a `mission`       |
| `geomap-server-read.php`          | Return all active users and their latest message         |
| `geomap-server-message-write.php` | Post a short text message                                |
| `geomap-server-logout.php`        | Mark a user inactive                                     |
| `geomap-server-maintenance.php`   | Cron: prune users and messages older than one hour       |

All endpoints set `Access-Control-Allow-Origin: *` so the front-end on GitHub Pages can call a back-end on a different origin. The `mission` parameter is the channel code; it is the only isolation between user groups, there is no authentication.

In `server-php/`, data is stored as `data/users_<mission>.json` and `data/messages_<mission>.json`. `geomap-json-storage.php` provides atomic writes (write-temp + rename, with `LOCK_EX`).

## Front-end module loading

`www/app/js/geomap.js` is a module loader written with `document.write`. It injects script tags for every other JS module in load order. Adding a new JS module means appending a `document.write(...)` line there. The script tags at the bottom of `www/index.html` ensure jQuery, Leaflet, SoundManager, and Framework7 are present before `geomap.js` runs.

## Class hierarchy

`Class_GeoMap` (in `geomap-main.js`) is the orchestrator. Its `start(mission, userid, username)` method instantiates and starts three workers:

- `Class_GPS` (`geomap-gps.js`) owns `navigator.geolocation` (`getCurrentPosition` and `watchPosition`). It writes to module-level globals (`gps_lastposition_latitude`, `gps_lastposition_status`, etc.) declared at the top of `geomap-gps.js`. These globals are read directly by `Class_AirUser`, there is no event bus.
- `Class_AirUser` (`geomap-user.js`) periodically POSTs the current GPS globals to `geomap-server-write.php`.
- `Class_AirMarkers` (`geomap-markers.js`) periodically GETs `geomap-server-read.php`, then renders or updates Leaflet markers and message bubbles. It also drives the network status icon.

`Class_GeoMap` runs a separate timer (`GLOBAL_REFRESH_INFO_SCREEN`, 2 s) that calls `markers.update()` and `gps.update()` for HUD animation, and falls back to a local-only marker (green) if the server has not responded yet.

## Tunable globals (`geomap-globals.js`)

These constants control timing and are also adjusted at runtime via `Class_GeoMap.SetNetworkDelay()` (driven by the user-facing slider) and `SetSoundsOffOn()`:

| Global                             | Default | Role                                                     |
|------------------------------------|---------|----------------------------------------------------------|
| `GLOBAL_NETWORK_GETDATA`           | 15 s    | Read poll interval                                       |
| `GLOBAL_NETWORK_SENDATA_MAXITIME`  | 30 s    | Write interval (max)                                     |
| `GLOBAL_SERVER_PING`               | 15 s    | GPS re-fetch cadence                                     |
| `GLOBAL_LIMIT_TTL`                 | 90 s    | Beyond this, a marker turns ghost (gray)                 |
| `GLOBAL_MAXI_TTL`                  | 8 h     | Maximum time a marker stays on the map                   |
| `GLOBAL_MINIMUM_ACCURAY`           | 10000 m | GPS fixes worse than this are not rendered               |
| `GLOBAL_PLAY_SOUNDS`               | `'on'`  | Sound master switch                                      |

`SetNetworkDelay(d)` clamps `d` to at least 15 s and rewrites `GLOBAL_NETWORK_GETDATA`, `GLOBAL_NETWORK_SENDATA_MAXITIME`, and `GLOBAL_LIMIT_TTL = (d + 30) * 2` together. They must be changed as a group, not individually.

## Routing and state (Framework7)

`www/index.html` contains the SPA shell, all inline routes, and Framework7 init. Routes:

- `/` (inline `home` page) - callsign / channel / server form
- `/map/` (inline `map` page, `keepAlive: true`) - the Leaflet view, preserved across navigations
- `/about/`, `/menu/`, `/options/`, `/messages/`, `/connected/`, `/share/` - loaded from `www/app/pages/mobile-*.html`

Because `/map/` uses `keepAlive`, the `Class_GeoMap` instance is created once per session in `pageAfterIn` and re-used. Subsequent visits only call `map.invalidateSize()`. `Class_GeoMap` exposes `SaveState()` and `RestoreState()` (center, zoom, active base and overlay layers) used to preserve the map view across navigations. `Class_GeoMap.skipLocate` is a static flag that suppresses the auto-locate when restoring a saved view.

User identity, channel, server URL, network delay, and sound preference live in `localStorage` via `geomap-storage.js`. The user identifier is generated once per browser and is never sent to the server as authentication; collisions are unlikely but not prevented.

URL parameters `?server=<url>&channel=<code>` are read on init and override the saved values, which is useful for QR-code or share links generated from `/share/`.

## Tile providers

Six base layers are available in `Class_GeoMap`: OpenStreetMap, OpenTopoMap, Esri World Imagery, CartoDB Dark Matter, CartoDB Positron, and Stadia Maps (Stamen Watercolor). Most are public tile servers that do not require API keys; Stadia may require attribution or a key for production.
