/*
 * Project: GeoMap
 * File: i18n.js
 * Description: Lightweight i18n module - language detection, localStorage override, DOM attribute scanning
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 *
 * Loads after dict-en.js (which declares GEOMAP_I18N) and dict-fr.js
 * (which adds GEOMAP_I18N.fr). New languages can be added by dropping a
 * dict-<lang>.js file with `GEOMAP_I18N.<lang> = {...}` and registering
 * it in loader.js before this file.
 */

/* Active language code, set by I18n.init(). */
var GEOMAP_LANG = 'en';

var I18n = (function () {
	function detectLang() {
		var override = null;
		try { override = localStorage.getItem('lang'); } catch (e) { /* localStorage may be unavailable */ }
		if (override === 'en' || override === 'fr') {
			return override;
		}
		var nav = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
		if (nav === 'fr') return 'fr';
		return 'en';
	}

	function lookup(lang, key) {
		var parts = key.split('.');
		var node = GEOMAP_I18N[lang];
		for (var i = 0; i < parts.length; i++) {
			if (node == null) return null;
			node = node[parts[i]];
		}
		return (typeof node === 'undefined') ? null : node;
	}

	/* Translate a dotted key (e.g. "home.engage_button"). Falls back to
	 * English when the active language has no entry, then to the key itself. */
	function t(key) {
		var v = lookup(GEOMAP_LANG, key);
		if (v == null) v = lookup('en', key);
		if (v == null) return key;
		return v;
	}

	/* Apply translations to every element with a data-i18n="key" attribute.
	 * The attribute value can be a single key, or an attribute-targeted form
	 * like "[placeholder]home.callsign_placeholder; [title]map.help_title".
	 * The default target is the element's text content. */
	function applyTo(root) {
		root = root || document;
		var nodes = root.querySelectorAll ? root.querySelectorAll('[data-i18n]') : [];
		for (var i = 0; i < nodes.length; i++) {
			var el = nodes[i];
			var spec = el.getAttribute('data-i18n');
			if (!spec) continue;
			var parts = spec.split(';');
			for (var j = 0; j < parts.length; j++) {
				var part = parts[j].trim();
				if (!part) continue;
				var attrMatch = part.match(/^\[([^\]]+)\]\s*(.+)$/);
				if (attrMatch) {
					el.setAttribute(attrMatch[1], t(attrMatch[2]));
				} else {
					el.textContent = t(part);
				}
			}
		}
	}

	function setLang(lang) {
		if (lang === 'auto') {
			try { localStorage.removeItem('lang'); } catch (e) { /* ignore */ }
			GEOMAP_LANG = detectLang();
		} else if (lang === 'en' || lang === 'fr') {
			try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
			GEOMAP_LANG = lang;
		}
		applyTo(document);
		return GEOMAP_LANG;
	}

	function getLang() {
		return GEOMAP_LANG;
	}

	function getStored() {
		try { return localStorage.getItem('lang') || 'auto'; } catch (e) { return 'auto'; }
	}

	function init() {
		GEOMAP_LANG = detectLang();
		applyTo(document);
		return GEOMAP_LANG;
	}

	return { init: init, t: t, applyTo: applyTo, setLang: setLang, getLang: getLang, getStored: getStored };
})();

/* Convenience global short alias. */
function t(key) { return I18n.t(key); }
