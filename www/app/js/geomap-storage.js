/*
 * Project: GeoMap-Air
 * File: geomap-storage.js
 * Description: localStorage persistence helpers (callsign, channel, server URL, user id, network delay, sound)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function get_server()
{
var server = localStorage.getItem('server');
	if(!server)
	{
		server='.';
		set_server(server);
	}
	console.log('[GeoMap] Server: ' + server);
return(server);
}

function set_server(username)
{
	localStorage.setItem('server', username);
}

function get_username()
{
var username = localStorage.getItem('username');
	if(!username)
	{
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		username = '';
		for(var i = 0; i < 4; i++) username += chars.charAt(Math.floor(Math.random() * chars.length));
		set_username(username);
	}
return(username);
}

function set_username(username)
{
	localStorage.setItem('username', username);
}

function get_userid()
{
var userid = localStorage.getItem('handle');
	if(!userid)
	{
		userid=GetRandomUserID();
		set_userid(userid);	
	}
return(userid);
}

function set_userid(userid)
{
	localStorage.setItem('handle', userid);	
}

function get_channel()
{
var channel = localStorage.getItem('channel');
	if(!channel)
		channel=1234;
return(channel);
}

function set_channel(channel)
{
	localStorage.setItem('channel', channel);	
}

function get_netdelay()
{
var netdelay = localStorage.getItem('netdelay');
	if(!netdelay)
		netdelay=30;
return(netdelay);
}

function set_netdelay(netdelay)
{
	if(!netdelay)
		netdelay=30;
	if(netdelay<15)
		netdelay=15;
		
	localStorage.setItem('netdelay', netdelay);
}

function get_sound()
{
var sound = localStorage.getItem('sound');
if(!sound)
	sound="on";
return(sound);
}

function set_sound(sound)
{
	if(!sound)
		sound="on";
	localStorage.setItem('sound', sound);
}

/* Only for phonegap : batterylevel */
function get_batterylevel()
{
var batterylevel = localStorage.getItem('batterylevel');
if(!batterylevel)
	batterylevel=-1;
return(batterylevel);
}

function set_batterylevel(batterylevel)
{
	if(!batterylevel)
		batterylevel=-1;
	localStorage.setItem('batterylevel', batterylevel);
}

