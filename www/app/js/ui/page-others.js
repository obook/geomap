/*
 * Project: GeoMap
 * File: page-others.js
 * Description: Handlers for the messages, connected, options, share, and disconnect pages
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Messages page */
jQuery(document).on('click', '#submit_message-id', function () {
	var message = jQuery('#text-id').val();
	if (message != '') {
		SendMessage(message);
		jQuery('#text-id').val('');
	}
	app.views.main.router.back('/map/', { force: true });
});
jQuery(document).on('click', '#button-hello-id', function () { SendMessage(t('messages.quick_hello_msg')); });
jQuery(document).on('click', '#button-busy-id',  function () { SendMessage(t('messages.quick_busy_msg')); });
jQuery(document).on('click', '#button-later-id', function () { SendMessage(t('messages.quick_later_msg')); });
jQuery(document).on('click', '#button-bye-id',   function () { SendMessage(t('messages.quick_bye_msg')); });

/* Connected users (field agents) */
app.on('pageAfterIn', function (page) {
	if (page.name !== 'connected') return;
	jQuery('#userlist-listview-id').html('');
	if (geomap != null) geomap.PrintUserlist('#userlist-listview-id');
});

/* Settings page */
app.on('pageAfterIn', function (page) {
	if (page.name !== 'options') return;
	jQuery('#slider-network-id').val(get_netdelay());
	jQuery('#slider-network-value').text(get_netdelay() + 's');
	jQuery('#flipsound-id').val(get_sound());
	jQuery('#lang-select-id').val(I18n.getStored());
});

jQuery(document).on('input', '#slider-network-id', function () {
	jQuery('#slider-network-value').text(jQuery(this).val() + 's');
});

jQuery(document).on('change', '#lang-select-id', function () {
	I18n.setLang(jQuery(this).val());
});

app.on('pageBeforeOut', function (page) {
	if (page.name !== 'options') return;
	var netdelay = jQuery('#slider-network-id').val();
	var sound = jQuery('#flipsound-id').val();
	if (netdelay < 15) netdelay = 15;
	set_netdelay(netdelay);
	if (geomap != null) geomap.SetNetworkDelay(netdelay);
	set_sound(sound);
	GLOBAL_PLAY_SOUNDS = sound;
	if (geomap != null) geomap.SetSoundsOffOn(sound);
	if (GLOBAL_PLAY_SOUNDS == 'on') soundManager.play('player_dong_id');
});

/* Share page - generates a QR code and a deep-link URL for the current
 * channel and server. */
app.on('pageAfterIn', function (page) {
	if (page.name !== 'share') return;
	var sv = get_server();
	var ch = get_channel();
	var url = window.location.origin + window.location.pathname;
	var sep = '?';
	if (sv && sv !== '.') {
		url += sep + 'server=' + encodeURIComponent(sv);
		sep = '&';
	}
	if (ch) {
		url += sep + 'channel=' + encodeURIComponent(ch);
	}
	jQuery('#share-url-link').attr('href', url).text(decodeURIComponent(url));
	jQuery('#share-qrcode').empty();
	new QRCode(document.getElementById('share-qrcode'), {
		text: url,
		width: 200,
		height: 200,
		colorDark: '#000000',
		colorLight: '#ffffff',
		correctLevel: QRCode.CorrectLevel.M
	});
});

/* Disconnect - stop the map session and return to home */
jQuery(document).on('click', '#quit_map-id', function (e) {
	e.preventDefault();
	if (geomap != null) {
		geomap.logout();
		geomap.destroy();
	}
	geomap = null;
	window.location.hash = '';
	window.location.reload();
});
