/*
 * Project: GeoMap
 * File: dict-en.js
 * Description: English dictionary for the i18n module
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
	}
};
