/*
 * Project: GeoMap
 * File: marker-state.js
 * Description: Class_Marker - title/icon/cleanup helpers and chat-message rendering
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

Class_Marker.prototype.SetTitle = function (title)
{
	this._marker.options.title = '[' + this._myname + ']\n' + title;
};

Class_Marker.prototype.SetDefaultIcon = function ()
{
	this._marker.setIcon(L.AwesomeMarkers.icon({
		icon: 'icon-male',
		color: AwesomeColors[this._default_icon_color_index],
		spin: false
	}));
};

/* Override the marker icon for the local user (red eye) so they spot
 * themselves on the map. The accuracy circle is recoloured too. */
Class_Marker.prototype.SetGreenMarker = function ()
{
	this._default_icon_color_index = 0;
	this._marker.setIcon(L.AwesomeMarkers.icon({
		icon: 'icon-eye-open',
		color: AwesomeColors[this._default_icon_color_index],
		spin: false
	}));
	this._circle_accuracy.setStyle({
		color: HtmlColors[this._default_icon_color_index],
		fillColor: HtmlColors[this._default_icon_color_index]
	});
};

/* Detach the marker and accuracy circle from the map. Called when the
 * server marks the user inactive or when the marker has been stale
 * for more than an hour. */
Class_Marker.prototype.Remove = function ()
{
	if (this._circle_accuracy != null) {
		this._accuracy_layer.removeLayer(this._circle_accuracy);
		this._circle_accuracy = null;
	}
	if (this._marker != null) {
		this._markers_layer.removeLayer(this._marker);
		this._marker = null;
	}
};

/* Append a new chat message to the on-map overlay if it differs from
 * the previous one for this user. Plays the new-message sound. */
Class_Marker.prototype.PrintMessage = function (text, serverTime)
{
	var current_message = this._myname + ': ' + text;
	if (current_message == this._guser_lastmessage) return;

	if (GLOBAL_PLAY_SOUNDS == 'on') {
		playaudio('player_newmessage_id', 'assets/sounds/ccir_small.ogg');
	}

	console.log('[GeoMap] New message: ' + jQuery('<div/>').html(current_message).text());

	var d = serverTime ? new Date(serverTime * 1000) : new Date();
	var hh = ('0' + d.getHours()).slice(-2);
	var mm = ('0' + d.getMinutes()).slice(-2);
	var ss = ('0' + d.getSeconds()).slice(-2);

	jQuery('#messages_id').prepend(
		'<div style="margin-bottom:4px;">'
		+ '<span style="font-size:9px;opacity:0.5;">'
		+ hh + ':' + mm + ':' + ss + '</span> '
		+ current_message
		+ '</div>'
	);
	jQuery('#messages_toolbar').show(1000);

	this._guser_lastmessage = current_message;
};
