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
			back: 'Back',
			dismiss: 'Close',
			map: 'Map',
			close: 'Close'
		},
		home: {
			title_sub: 'Real-time location sharing',
			intel_link: 'About',
			callsign_label: 'Username',
			callsign_placeholder: 'Pick a name',
			channel_label: 'Channel',
			channel_placeholder: '1111 - 99999',
			server_label: 'Server',
			engage_button: 'Connect',
			footer: 'No account. No tracking. No logs.'
		},
		map: {
			title: 'Map',
			btn_users_title: 'Show all users',
			btn_gps_title: 'Center on me',
			btn_network_title: 'Clear messages',
			help_title: 'Help',
			help_aria: 'Open help'
		},
		layers: {
			normal: 'Standard',
			hybrid: 'Satellite',
			terrain: 'Terrain',
			tactical: 'Light',
			night: 'Dark',
			markers: 'Users',
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
			toast_denied: 'Location permission denied. Enable Location Services for this site in your browser or system settings.',
			toast_unavail: 'Location unavailable. No signal.',
			toast_timeout: 'Location request timed out. Try moving to an area with a clear sky view.',
			toast_error: 'Location error: ',
			toast_watch_error: 'Location tracking error: ',
			toast_unknown: 'unknown'
		},
		about: {
			title: 'About',
			briefing_label: 'About this app',
			paragraph_1: 'GeoMap is an anonymous location-sharing service. Your position is shared in real time with other users on the same channel. No data is stored on the server.',
			paragraph_2: 'No tracking. No persistent records. No accounts. GeoMap is open source under the GNU GPL v3.'
		},
		menu: {
			title: 'Menu',
			select_label: 'Choose an action',
			btn_options: 'Settings',
			btn_messages: 'Send message',
			btn_agents: 'Connected users',
			btn_share: 'Share',
			btn_abort: 'Disconnect'
		},
		messages: {
			title: 'Send message',
			compose_label: 'New message',
			input_placeholder: 'Type a short message',
			transmit: 'Send',
			cleared_toast: 'MESSAGES CLEARED',
			quick_codes_label: 'Quick replies',
			quick_hello: 'Hi',
			quick_busy: 'Busy',
			quick_later: 'Be right back',
			quick_bye: 'Bye',
			quick_hello_msg: 'Hello everyone.',
			quick_busy_msg: 'I am busy.',
			quick_later_msg: 'Be right back.',
			quick_bye_msg: 'Bye.'
		},
		options: {
			title: 'Settings',
			params_label: 'Preferences',
			net_delay: 'Network interval',
			audio: 'Sound',
			silent: 'Off',
			active: 'On',
			language: 'Language',
			lang_auto: 'Auto',
			lang_en: 'English',
			lang_fr: 'Francais'
		},
		share: {
			title: 'Share',
			label: 'Invite others to this channel'
		},
		connected: {
			title: 'Connected users',
			label: 'Active right now',
			col_user: 'USER',
			col_distance: 'DISTANCE',
			col_acc: 'ACC.',
			col_speed: 'SPEED',
			col_time: 'TIME'
		},
		help: {
			title: 'GeoMap help',
			sections: [
				{h: 'What is this', p: 'GeoMap shares your location in real time with the other users on the same channel. No account is required and nothing is kept after you stop using the app.'},
				{h: 'Getting started', p: 'On the home page, type a username and a channel code, then tap Connect. Anyone using the same channel code will see you on the map.'},
				{h: 'Map header', p: 'Top left shows the channel and your username. Center shows the GPS state and signal quality. Top right shows the number of connected users, the centering buttons, and the message clear button.'},
				{h: 'Markers', p: 'Each marker is another user on your channel. Tap a marker to see the username, distance, accuracy, and the latest message they sent.'},
				{h: 'Privacy', p: 'No account is created. Records are removed within one hour after you stop sending updates. The channel code is the only group identifier; pick one that is hard to guess if you want a private group.'},
				{h: 'License', p: 'Open source under the GNU GPL v3. Source code on the project repository.'}
			]
		}
	},
	fr: {
		common: {
			back: 'Retour',
			dismiss: 'Fermer',
			map: 'Carte',
			close: 'Fermer'
		},
		home: {
			title_sub: 'Partage de position en temps réel',
			intel_link: 'À propos',
			callsign_label: 'Nom d\'utilisateur',
			callsign_placeholder: 'Choisir un nom',
			channel_label: 'Canal',
			channel_placeholder: '1111 - 99999',
			server_label: 'Serveur',
			engage_button: 'Se connecter',
			footer: 'Sans compte. Sans suivi. Sans journal.'
		},
		map: {
			title: 'Carte',
			btn_users_title: 'Voir tous les utilisateurs',
			btn_gps_title: 'Me centrer',
			btn_network_title: 'Effacer les messages',
			help_title: 'Aide',
			help_aria: 'Ouvrir l\'aide'
		},
		layers: {
			/* Layer switcher names stay in English regardless of language:
			 * map style and overlay labels are recognised by their English
			 * spelling across communities. */
			normal: 'Standard',
			hybrid: 'Satellite',
			terrain: 'Terrain',
			tactical: 'Light',
			night: 'Dark',
			markers: 'Users',
			accuracy: 'Accuracy',
			tools: 'Tools'
		},
		gps: {
			wait: 'GPS ATTENTE',
			lock: 'GPS LOCK',
			ok: 'GPS OK',
			weak: 'GPS FAIBLE',
			denied: 'GPS REFUSÉ',
			unavail: 'GPS INDISPO',
			timeout: 'GPS TIMEOUT',
			error: 'GPS ERREUR',
			toast_denied: 'Autorisation de localisation refusée. Activez les services de localisation pour ce site dans votre navigateur ou les réglages du système.',
			toast_unavail: 'Localisation indisponible. Aucun signal.',
			toast_timeout: 'Délai de localisation dépassé. Essayez de vous placer à ciel ouvert.',
			toast_error: 'Erreur de localisation : ',
			toast_watch_error: 'Erreur de suivi : ',
			toast_unknown: 'inconnue'
		},
		about: {
			title: 'À propos',
			briefing_label: 'À propos de l\'application',
			paragraph_1: 'GeoMap est un service de partage de position anonyme. Votre position est partagée en temps réel avec les autres utilisateurs du même canal. Aucune donnée n\'est conservée côté serveur.',
			paragraph_2: 'Pas de suivi. Pas d\'enregistrement. Pas de compte. GeoMap est un logiciel libre sous licence GNU GPL v3.'
		},
		menu: {
			title: 'Menu',
			select_label: 'Choisir une action',
			btn_options: 'Réglages',
			btn_messages: 'Envoyer un message',
			btn_agents: 'Utilisateurs connectés',
			btn_share: 'Partager',
			btn_abort: 'Se déconnecter'
		},
		messages: {
			title: 'Envoyer un message',
			compose_label: 'Nouveau message',
			input_placeholder: 'Saisir un message court',
			transmit: 'Envoyer',
			cleared_toast: 'MESSAGES EFFACÉS',
			quick_codes_label: 'Réponses rapides',
			quick_hello: 'Salut',
			quick_busy: 'Occupé',
			quick_later: 'Je reviens',
			quick_bye: 'Au revoir',
			quick_hello_msg: 'Bonjour à tous.',
			quick_busy_msg: 'Je suis occupé.',
			quick_later_msg: 'Je reviens plus tard.',
			quick_bye_msg: 'Au revoir.'
		},
		options: {
			title: 'Réglages',
			params_label: 'Préférences',
			net_delay: 'Intervalle réseau',
			audio: 'Son',
			silent: 'Coupé',
			active: 'Actif',
			language: 'Langue',
			lang_auto: 'Auto',
			lang_en: 'English',
			lang_fr: 'Français'
		},
		share: {
			title: 'Partager',
			label: 'Inviter d\'autres personnes sur ce canal'
		},
		connected: {
			title: 'Utilisateurs connectés',
			label: 'Actifs en ce moment',
			col_user: 'NOM',
			col_distance: 'DISTANCE',
			col_acc: 'PRÉC.',
			col_speed: 'VITESSE',
			col_time: 'DEPUIS'
		},
		help: {
			title: 'Aide GeoMap',
			sections: [
				{h: 'À quoi ça sert', p: 'GeoMap partage votre position en temps réel avec les autres utilisateurs du même canal. Aucun compte requis et rien n\'est conservé après l\'arrêt de l\'application.'},
				{h: 'Pour commencer', p: 'Sur la page d\'accueil, saisissez un nom et un code de canal, puis touchez Se connecter. Toute personne utilisant le même code voit votre position sur la carte.'},
				{h: 'En-tête de carte', p: 'En haut à gauche : le canal et votre nom. Au centre : état GPS et qualité du signal. En haut à droite : nombre d\'utilisateurs connectés, boutons de centrage, et bouton d\'effacement des messages.'},
				{h: 'Marqueurs', p: 'Chaque marqueur représente un autre utilisateur du canal. Touchez un marqueur pour voir le nom, la distance, la précision, et le dernier message envoyé.'},
				{h: 'Confidentialité', p: 'Aucun compte n\'est créé. Les enregistrements sont supprimés une heure après l\'arrêt. Le code de canal est le seul identifiant de groupe ; choisissez-en un difficile à deviner pour un groupe privé.'},
				{h: 'Licence', p: 'Logiciel libre sous licence GNU GPL v3. Code source sur le dépôt du projet.'}
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
