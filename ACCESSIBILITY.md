# Accessibility statement - GeoMap

**Last updated:** 2026-04-26

## Conformance status

GeoMap is in **partial conformance** with the RGAA 4.1 (Referentiel General d'Amelioration de l'Accessibilite, version 4.1), level AA. The application is a real-time tactical map intended for mobile use; some criteria are inherently constrained by the interactive map experience and are documented below as accepted gaps.

## Technologies in use

- HTML5, CSS3 (custom Dark Ops theme), JavaScript ES5
- Framework7 (mobile UI framework)
- Leaflet (interactive map) with the marker-cluster, awesome-markers, draw, label, and GPX plugins
- jQuery 1.9
- SoundManager2 (notification sounds)

All libraries are vendored under `www/vendor/`; no CDN is loaded at runtime.

## Test environments

| Browser | Version | Platform |
|---------|---------|----------|
| Chrome | 130+ | Linux, Android |
| Firefox | 130+ | Linux, Windows |
| Safari | 17+ | macOS, iOS 16+ |

## RGAA criteria reviewed

### Images (theme 1)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 1.1 Informative images have a text alternative | Conform | The `<img>` tags for the GPS HUD use `alt` describing the state; decorative SVG icons in the toolbar are flagged with `aria-hidden="true"` |
| 1.2 Decorative images have no text alternative | Conform | Background SVG icons in the navbar are decorative and marked `aria-hidden="true"` |

### Colors (theme 3)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 3.2 Text/background contrast >= 4.5:1 | Partial | The Dark Ops theme uses cyan (`#00f0ff`), green (`#00ff41`), amber (`#ff9500`), and red (`#ff0000`) on a near-black background. Contrast ratios meet AA for body text but the secondary `text-ghost` variant is intentionally low-contrast and may fall below AA in some HUD captions |
| 3.3 Information not conveyed by color alone | Conform | GPS state combines color, animated icon shape, and a textual label in the navbar (`GPS LOCK`, `GPS WEAK`, `GPS DENIED`, etc.). Network state combines color, icon shape, and connection direction (incoming / outgoing) |

### Multimedia (theme 4)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 4.x Audio cues have visual equivalents | Conform | Notification sounds (new user, new message) are accompanied by visible toast or marker updates; sound can be turned off in `/options/` |

### Tables (theme 5)

Not applicable. The application does not use data tables.

### Links (theme 6)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 6.1 Link purpose can be determined from the link text alone | Conform | Navbar links (`INTEL`, channel title, GPS state) carry semantic text; toolbar icon links (`#btn-users`, `#button_GPS`, `#button_network`) carry `title=` attributes that screen readers expose |
| 6.2 Each link has an accessible name | Conform | Every interactive `<a>` element has either textual content or a `title` attribute |

### Scripts (theme 7)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 7.1 Scripts are compatible with assistive technologies | Partial | Framework7 components expose the standard ARIA roles for navbars, pages, and toolbars. The Leaflet map exposes its standard keyboard handler but does not announce marker updates via `aria-live` |
| 7.3 Scripts are operable from the keyboard | Partial | Framework7 navigation, the home form, and toolbar buttons are keyboard-operable. The Leaflet map can be panned with arrow keys and zoomed with `+`/`-`, but interactive marker selection inside a cluster requires a pointer |

### Compulsory elements (theme 8)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 8.1 Each page has a `lang` attribute | Conform | `<html>` declares the language at the document root |
| 8.4 Language changes are signalled | Conform | All UI strings are in English; no inline language switching |

### Information structure (theme 9)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 9.1 Headings present and meaningful | Partial | The home and about pages use Framework7 page structure with semantic regions. The map page uses a navbar title rather than an `<h1>`; an offscreen heading should be added for screen readers |
| 9.3 Lists are marked up correctly | Conform | The user list is rendered as `<ul>` items inside Framework7 list components |

### Presentation of information (theme 10)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 10.7 Visible focus on interactive elements | Partial | Framework7's default focus ring is preserved on form inputs and buttons. The custom-styled ENGAGE button keeps a focus indicator; map controls inherit Leaflet's focus styles |
| 10.x Reduced-motion support | Not addressed | The GPS HUD uses several CSS animations (radar sweep, blink, pulse) that do not respect `prefers-reduced-motion`. Tracked as future work |

### Forms (theme 11)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 11.1 Form fields have a label | Conform | `CALLSIGN`, `CHANNEL`, and `SERVER` labels are wired to their input via the Framework7 list-item structure |
| 11.2 Labels are unambiguous | Conform | Labels match the data they request and are accompanied by a placeholder example |
| 11.10 Error identification | Partial | The ENGAGE button is disabled until all fields are filled, but no individual field-level error message is rendered |

### Navigation (theme 12)

| Criterion | Status | Detail |
|-----------|--------|--------|
| 12.7 Skip-link to main content | Not addressed | Single-page application without a top-level skip link; tracked as future work |
| 12.8 Tab order matches visual order | Conform | DOM order matches the visual layout in the home and map pages |

### Consultation (theme 13)

Not applicable. The application does not embed third-party documents.

## Accepted gaps

The following gaps are inherent to the product:

- **Map interaction with assistive technologies.** Leaflet maps are challenging for screen readers because positional information is graphical by nature. Marker text content (callsign, distance, accuracy) is exposed in popups, but spatial relationships are not announced. This is a limitation shared by all browser-based maps.
- **Real-time HUD animations.** The radar-sweep and pulse animations are central to the visual identity ("Dark Ops" theme). A future iteration will respect `prefers-reduced-motion` to disable them on request.
- **Toast deduplication.** GPS error toasts are deduplicated by message text to prevent spam, which means an unchanged error condition is announced only once per error transition. Screen-reader users who miss the first announcement must trigger a state change to hear it again.

## Improvement plan

- Audit contrast ratios of `--text-ghost` and HUD captions, raise them to AA where feasible
- Add an offscreen `<h1>` to the map page for screen-reader navigation
- Implement `prefers-reduced-motion` to disable HUD animations on request
- Add `aria-live="polite"` regions for new-user and new-message announcements
- Review the Leaflet keyboard navigation on the marker-cluster plugin and add a list-mode fallback for non-pointer users
- Add a top-level skip link from the navbar to the map area

## Contact

To report an accessibility issue, open an issue on the project's GitHub repository.

## References

- RGAA 4.1 - [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)
- WCAG 2.1 - [w3.org](https://www.w3.org/TR/WCAG21/)
- Leaflet accessibility documentation - [leafletjs.com](https://leafletjs.com/reference.html)
