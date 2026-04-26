# Security sheet - GeoMap

**Last updated:** 2026-04-26
**Reference framework:** ANSSI-PA-073 (Secure development, 24/03/2022), OWASP Top 10 (2021)

## Attack surface

### Front-end (deployed to GitHub Pages)

| Component | Justification |
|-----------|---------------|
| HTML5 Geolocation API | Required to obtain the user's GPS position; permission is requested explicitly via the browser prompt |
| `localStorage` | Stores callsign, channel, server URL, network delay, and sound preference per origin |
| Network access | XHR/fetch calls to a single user-configured back-end PHP server, plus map tile servers |

### Back-end (PHP)

Two interchangeable implementations exposing the same five endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `geomap-server-write.php` | POST | Upsert the current user's position |
| `geomap-server-read.php` | POST | Return active users and messages for a channel |
| `geomap-server-message-write.php` | POST | Post a short text message |
| `geomap-server-logout.php` | POST | Mark a user inactive |
| `geomap-server-maintenance.php` | GET (cron) | Prune users and messages older than one hour |

### Network

- **Front-end origin:** `https://obook.github.io/geomap/` (HTTPS enforced by GitHub Pages)
- **Back-end origin:** user-configured at runtime (in-app `SERVER` field, `?server=` URL parameter, or `localStorage`); not hardcoded in the repository
- **CORS:** all PHP endpoints set `Access-Control-Allow-Origin: *` to allow the GitHub Pages front-end to reach a back-end on a different origin
- **Tile providers:** OpenStreetMap, OpenTopoMap, Esri World Imagery, CartoDB. Each tile fetch leaks the user's IP to the provider; this is inherent to web map rendering and is documented in the user-facing UI (layer attribution)
- **No third-party telemetry, no analytics, no CDN library load**

### Storage

#### Front-end

- **Engine:** browser `localStorage`, scoped to the origin
- **Data stored:** callsign, channel code, server URL, randomly generated user identifier, network delay, sound preference
- **No data is synchronised** to external services from the front-end

#### Back-end (PHP + JSON files, `server-php/`)

- **Engine:** flat JSON files under `data/`, one per channel for users and one per channel for messages
- **Atomic writes:** `file_put_contents` with `LOCK_EX` to a temporary file followed by `rename` to prevent partial reads under concurrent access
- **Filename sanitisation:** the channel identifier is filtered to `[a-zA-Z0-9]` before being used as a filename, blocking path traversal
- **Direct HTTP access blocked:** `data/.htaccess` denies access to the JSON files; an equivalent rule must be configured for Nginx deployments

#### Back-end (PHP + MySQL, `server-sql/`)

- **Engine:** MySQL 5.x or compatible (MariaDB)
- **Tables:** `geomap_users` and `geomap_messages`
- **Configuration:** credentials stored in `geomap-server-config.php`, which is gitignored; only `geomap-server-config-sample.php` is committed

## Threat model

| Threat | Mitigation | Status |
|--------|------------|--------|
| Cross-site scripting (XSS) in messages and callsigns | `htmlentities($value, ENT_QUOTES, 'UTF-8')` applied via `sanitize()` in `server-php/geomap-json-storage.php` and equivalent escaping in `server-sql/`. Front-end displays usernames inside Leaflet markers and popups, which are escaped by Leaflet by default | OK |
| Path traversal via channel identifier | `preg_replace('/[^a-zA-Z0-9]/', '', $mission)` applied before any filename construction | OK |
| Direct HTTP read of JSON storage | `data/.htaccess` denies all requests for Apache; documented for operators on Nginx | OK |
| SQL injection (server-sql) | Legacy back-end, predates the JSON variant. Inputs are escaped with `htmlentities` before use in queries; prepared statements should be preferred and is tracked as future work | Partial |
| Credential leak via configuration file | `geomap-server-config.php` gitignored; only the sample is committed | OK |
| CSRF / unauthorised position write | By design, channels are open: anyone who knows the channel code can write under any callsign. This is the privacy model (no accounts, no authentication) and is documented as a feature, not a bug | Accepted |
| User identifier reuse / collision | `userid` is generated client-side and sent as a plain field; collisions are theoretically possible but not exploited. The server treats `userid` as an opaque key, not as authentication | Accepted |
| Network interception (MITM) on front-end | HTTPS enforced by GitHub Pages | OK |
| Network interception (MITM) on back-end | Operator responsibility; recommended to deploy behind HTTPS (TLS) | Operator-dependent |
| Stale or ghost users on the map | Maintenance script prunes users with no ping for one hour. Read endpoint also filters stale users in real time | OK |
| Denial of service via flood writes | No rate limiting at the application layer; operator is expected to provide one (web server, reverse proxy, fail2ban). Frequency is clamped client-side to >= 15 s per write | Partial |
| Sensitive data exposure via map tile providers | User's IP is sent to the selected tile provider. Documented through the layer attribution; users can switch providers from the layer control | Accepted |
| Information leakage via `User-Agent` and IP logging | The PHP back-ends log `REMOTE_ADDR`, `HTTP_X_FORWARDED_FOR`, and `HTTP_USER_AGENT` per record. These fields are kept in storage for the lifetime of the user record (max one hour after last ping) and are not exposed to other users | Documented |
| Cross-channel data leakage | Reads are filtered by channel; channel separator is enforced at the storage layer (per-channel file or per-channel SQL filter) | OK |
| Library supply-chain attack | All third-party libraries are vendored under `www/vendor/` and committed to the repository; no CDN load at runtime | OK |

## Content Security Policy

The front-end is served as static HTML from GitHub Pages, which does not impose a strict CSP by default. The application:

- Does not load any JavaScript, CSS, or font from a CDN at runtime; all libraries are vendored under `www/vendor/`
- Does not use `eval`, `Function()`, or `setTimeout(string)` with dynamic strings
- Does not embed third-party trackers, analytics, or social-media widgets

Operators self-hosting the front-end are encouraged to add a `Content-Security-Policy` header restricting `script-src` to `'self'`, `connect-src` to `'self'` plus the configured PHP back-end and tile providers, and `img-src` to the same plus `data:`.

## Development practices

- **Vendored dependencies:** jQuery 1.9, Leaflet (and plugins), Framework7, SoundManager2, Font Awesome are all stored under `www/vendor/`. No `npm install` step at deployment time
- **No automatic AI-generated code execution:** the project does not embed any AI runtime or auto-evaluation pipeline
- **Input sanitisation at every PHP entry point:** all `$_REQUEST` reads pass through `sanitize()` before use
- **Atomic writes in JSON back-end:** prevents partial reads during concurrent updates
- **Configuration files excluded from git:** `geomap-server-config.php` is gitignored; only the sample is committed
- **Static deployment:** the front-end is published by GitHub Actions from the `www/` directory only; no build step, no install scripts

## ANSSI-PA-073 compliance (secure development)

| Theme | Status |
|-------|--------|
| Input validation at every entry point | OK - `sanitize()` applied via `htmlentities` on all `$_REQUEST` fields |
| Output encoding | OK - HTML entities, JSON encoding for read endpoints |
| Path traversal prevention | OK - filenames built from regex-filtered channel identifiers |
| Authentication and session management | Not applicable - the privacy model intentionally avoids accounts |
| Error handling | OK - PHP endpoints return plain-text or JSON error strings without leaking stack traces |
| Logging | Partial - PHP back-end records IP, hostname, and User-Agent per user record but no structured audit log |
| Configuration management | OK - secrets are isolated in a gitignored config file |
| Cryptography | Not applicable - no client secrets, no symmetric or asymmetric crypto on the application layer (TLS handled by the front-end host and the back-end host) |
| Memory and resource management | OK - PHP runtime; JSON writes are bounded by per-channel file size, which is itself bounded by the one-hour user TTL |
| Dependency management | OK - all front-end libraries are vendored; PHP runtime is the only external dependency |

## OWASP Top 10 (2021) coverage

| Risk | Status |
|------|--------|
| A01 Broken access control | Accepted by design - the application is intentionally permissionless inside a channel |
| A02 Cryptographic failures | Operator-dependent for back-end TLS; front-end TLS provided by GitHub Pages |
| A03 Injection | OK - HTML entity encoding on all inputs; JSON storage avoids SQL exposure entirely. Prepared statements tracked as improvement for `server-sql/` |
| A04 Insecure design | Documented - the privacy model is intentional (no accounts) |
| A05 Security misconfiguration | Operator-dependent - the project ships sample configuration files only |
| A06 Vulnerable and outdated components | Partial - vendored libraries (jQuery 1.9, Leaflet 1.x) are dated; tracked as a refresh task |
| A07 Identification and authentication failures | Not applicable by design |
| A08 Software and data integrity failures | OK - vendored libraries; no auto-update mechanism |
| A09 Security logging and monitoring failures | Partial - basic IP/UA logs, no structured audit |
| A10 Server-side request forgery | OK - the back-end does not perform outbound HTTP requests on behalf of users |

## References

- ANSSI-PA-073 (24/03/2022) - *Recommandations relatives au developpement de logiciels en langage C* - [cyber.gouv.fr](https://cyber.gouv.fr)
- OWASP Top 10 (2021) - [owasp.org](https://owasp.org/www-project-top-ten/)
- GitHub Pages security model - [docs.github.com](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
