/*
 * Project: GeoMap
 * File: dict-fr.js
 * Description: French dictionary for the i18n module (loaded after dict-en, augments GEOMAP_I18N)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

GEOMAP_I18N.fr = {
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
};
