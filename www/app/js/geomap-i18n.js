/*
 * Project: GeoMap
 * File: geomap-i18n.js
 * Description: Lightweight i18n module (FR / EN) with localStorage override and DOM attribute scanning
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

var GEOMAP_I18N = {
	en: {
		common: {
			back: 'BACK',
			dismiss: 'DISMISS',
			map: 'MAP',
			close: 'CLOSE'
		},
		home: {
			title_sub: 'SIGINT COMMAND TERMINAL v3.0',
			intel_link: 'INTEL',
			callsign_label: 'CALLSIGN',
			callsign_placeholder: 'Agent name',
			channel_label: 'CHANNEL',
			channel_placeholder: 'Secure freq',
			server_label: 'SERVER',
			engage_button: 'ENGAGE',
			footer: 'ENCRYPTED // ZERO FOOTPRINT // NO LOGS'
		},
		map: {
			title: 'TACTICAL',
			btn_users_title: 'Zoom on all users',
			btn_gps_title: 'Zoom on me',
			btn_network_title: 'Cleanup messages',
			help_title: 'Help',
			help_aria: 'Open help'
		},
		layers: {
			normal: 'Normal View',
			hybrid: 'Hybrid View',
			terrain: 'Terrain View',
			tactical: 'Tactical View',
			night: 'Night View',
			watercolor: 'Watercolor View',
			markers: 'Markers',
			accuracy: 'Accuracy',
			tools: 'Tools'
		},
		gps: {
			wait: 'GPS WAIT',
			lock: 'GPS LOCK',
			ok: 'GPS OK',
			weak: 'GPS WEAK',
			denied: 'GPS DENIED',
			unavail: 'GPS UNAVAIL',
			timeout: 'GPS TIMEOUT',
			error: 'GPS ERROR',
			toast_denied: 'GPS permission denied. Enable Location Services for Safari in iOS Settings.',
			toast_unavail: 'GPS position unavailable. No signal.',
			toast_timeout: 'GPS timeout. Move to open sky and retry.',
			toast_error: 'GPS error: ',
			toast_watch_error: 'GPS watch error: ',
			toast_unknown: 'unknown'
		},
		about: {
			title: 'CLASSIFIED',
			briefing_label: '// BRIEFING DOCUMENT',
			paragraph_1: 'GeoMap is an anonymous geolocation service. Your position is shared with other agents on the same channel. No data is stored on the server side.',
			paragraph_2: 'Zero tracking. Zero records. Zero footprint. GeoMap is an open-source project available under GNU GPL v3.'
		},
		menu: {
			title: 'OPERATIONS',
			select_label: 'SELECT OPERATION',
			btn_options: 'COMMS CONFIG',
			btn_messages: 'SEND INTEL',
			btn_agents: 'FIELD AGENTS',
			btn_share: 'SHARE APP',
			btn_abort: 'ABORT MISSION'
		},
		messages: {
			title: 'SEND INTEL',
			compose_label: '// COMPOSE TRANSMISSION',
			input_placeholder: 'Enter message...',
			transmit: 'TRANSMIT',
			quick_codes_label: '// QUICK CODES',
			quick_hello: 'HELLO',
			quick_busy: 'BUSY',
			quick_later: 'BRB',
			quick_bye: 'OUT',
			quick_hello_msg: 'Hello everyone.',
			quick_busy_msg: 'I am busy.',
			quick_later_msg: 'Be right back.',
			quick_bye_msg: 'Out.'
		},
		options: {
			title: 'COMMS CONFIG',
			params_label: '// SYSTEM PARAMETERS',
			net_delay: 'NET DELAY',
			audio: 'AUDIO',
			silent: 'SILENT',
			active: 'ACTIVE',
			language: 'LANGUAGE',
			lang_auto: 'Auto',
			lang_en: 'English',
			lang_fr: 'Francais'
		},
		share: {
			title: 'SHARE APP',
			label: '// EXFILTRATE POSITION'
		},
		connected: {
			title: 'FIELD AGENTS',
			label: '// ACTIVE OPERATIVES'
		},
		help: {
			title: 'GEOMAP HELP',
			sections: [
				{h: 'WHAT IS THIS', p: 'Anonymous real-time geolocation sharing. Your GPS position is broadcast to other users on the same channel. No account, no persistent logs.'},
				{h: 'GETTING STARTED', p: 'Enter a callsign and a channel code on the home page, then ENGAGE. Anyone using the same channel code can see you on the map.'},
				{h: 'MAP HEADER', p: 'Left: channel and your callsign. Center: GPS state and signal quality (GPS LOCK in green, GPS WEAK in amber, GPS DENIED or UNAVAIL in red). Right: total users on your channel, zoom on all, zoom on me, clear messages.'},
				{h: 'MARKERS', p: 'Each marker is another user on your channel. Tap a marker to see callsign, distance, accuracy, and the last message.'},
				{h: 'PRIVACY', p: 'No account is created. No data persists after you stop pinging (one hour grace period). The channel code is the only group identifier; pick a hard-to-guess code if you want a private group.'},
				{h: 'LICENSE', p: 'GPL v3. Source code on the project repository.'}
			]
		}
	},
	fr: {
		common: {
			back: 'RETOUR',
			dismiss: 'FERMER',
			map: 'CARTE',
			close: 'FERMER'
		},
		home: {
			title_sub: 'TERMINAL DE COMMANDEMENT SIGINT v3.0',
			intel_link: 'INFOS',
			callsign_label: 'INDICATIF',
			callsign_placeholder: 'Nom de code',
			channel_label: 'CANAL',
			channel_placeholder: 'Frequence',
			server_label: 'SERVEUR',
			engage_button: 'ENGAGER',
			footer: 'CHIFFRE // SANS TRACE // SANS JOURNAL'
		},
		map: {
			title: 'TACTIQUE',
			btn_users_title: 'Zoom sur tous les agents',
			btn_gps_title: 'Zoom sur moi',
			btn_network_title: 'Effacer les messages',
			help_title: 'Aide',
			help_aria: 'Ouvrir l\'aide'
		},
		layers: {
			normal: 'Vue normale',
			hybrid: 'Vue hybride',
			terrain: 'Vue terrain',
			tactical: 'Vue tactique',
			night: 'Vue nuit',
			watercolor: 'Vue aquarelle',
			markers: 'Marqueurs',
			accuracy: 'Precision',
			tools: 'Outils'
		},
		gps: {
			wait: 'GPS ATTENTE',
			lock: 'GPS LOCK',
			ok: 'GPS OK',
			weak: 'GPS FAIBLE',
			denied: 'GPS REFUSE',
			unavail: 'GPS INDISPO',
			timeout: 'GPS TIMEOUT',
			error: 'GPS ERREUR',
			toast_denied: 'Autorisation GPS refusee. Activez la geolocalisation pour Safari dans les Reglages iOS.',
			toast_unavail: 'Position GPS indisponible. Aucun signal.',
			toast_timeout: 'GPS timeout. Sortez a ciel ouvert et reessayez.',
			toast_error: 'Erreur GPS : ',
			toast_watch_error: 'Erreur de suivi GPS : ',
			toast_unknown: 'inconnue'
		},
		about: {
			title: 'CLASSIFIE',
			briefing_label: '// DOCUMENT DE BRIEFING',
			paragraph_1: 'GeoMap est un service de geolocalisation anonyme. Votre position est partagee avec les autres agents sur le meme canal. Aucune donnee n\'est conservee cote serveur.',
			paragraph_2: 'Zero suivi. Zero enregistrement. Zero empreinte. GeoMap est un projet open source disponible sous licence GNU GPL v3.'
		},
		menu: {
			title: 'OPERATIONS',
			select_label: 'SELECTIONNER OPERATION',
			btn_options: 'CONFIG COMMS',
			btn_messages: 'ENVOYER INFOS',
			btn_agents: 'AGENTS DE TERRAIN',
			btn_share: 'PARTAGER L\'APP',
			btn_abort: 'INTERROMPRE MISSION'
		},
		messages: {
			title: 'ENVOYER INFOS',
			compose_label: '// COMPOSER TRANSMISSION',
			input_placeholder: 'Entrez un message...',
			transmit: 'TRANSMETTRE',
			quick_codes_label: '// CODES RAPIDES',
			quick_hello: 'SALUT',
			quick_busy: 'OCCUPE',
			quick_later: 'REVIENS',
			quick_bye: 'TERMINE',
			quick_hello_msg: 'Bonjour a tous.',
			quick_busy_msg: 'Je suis occupe.',
			quick_later_msg: 'Je reviens plus tard.',
			quick_bye_msg: 'Au revoir.'
		},
		options: {
			title: 'CONFIG COMMS',
			params_label: '// PARAMETRES SYSTEME',
			net_delay: 'DELAI RESEAU',
			audio: 'AUDIO',
			silent: 'MUET',
			active: 'ACTIF',
			language: 'LANGUE',
			lang_auto: 'Auto',
			lang_en: 'English',
			lang_fr: 'Francais'
		},
		share: {
			title: 'PARTAGER L\'APP',
			label: '// EXFILTRER LA POSITION'
		},
		connected: {
			title: 'AGENTS DE TERRAIN',
			label: '// AGENTS ACTIFS'
		},
		help: {
			title: 'AIDE GEOMAP',
			sections: [
				{h: 'A QUOI CA SERT', p: 'Partage anonyme de geolocalisation en temps reel. Votre position GPS est diffusee aux autres utilisateurs du meme canal. Pas de compte, pas de journal persistant.'},
				{h: 'POUR COMMENCER', p: 'Entrez un indicatif et un code de canal sur la page d\'accueil, puis ENGAGER. Toute personne utilisant le meme code de canal vous voit sur la carte.'},
				{h: 'EN-TETE DE CARTE', p: 'A gauche : le canal et votre indicatif. Au centre : etat GPS et qualite du signal (GPS LOCK en vert, GPS FAIBLE en ambre, GPS REFUSE ou INDISPO en rouge). A droite : nombre total d\'agents sur votre canal, zoom sur tous, zoom sur moi, effacer les messages.'},
				{h: 'MARQUEURS', p: 'Chaque marqueur est un autre utilisateur sur votre canal. Touchez un marqueur pour voir l\'indicatif, la distance, la precision, et le dernier message.'},
				{h: 'CONFIDENTIALITE', p: 'Aucun compte n\'est cree. Aucune donnee ne persiste apres l\'arret du ping (une heure de delai). Le code de canal est le seul identifiant de groupe ; choisissez un code difficile a deviner pour un groupe prive.'},
				{h: 'LICENCE', p: 'GPL v3. Code source sur le depot du projet.'}
			]
		}
	}
};

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
