/*
 *  geomap-storage
 * 
 * Last commit by $Author: obooklage $
 * Date - $Date: 2012-07-31 12:32:12 +0200 (mar. 31 juil. 2012) $
 * Revision - $Rev: 326 $
 * Id : $Id: geomap-markers.js 326 2012-07-31 10:32:12Z obooklage $ 
 * 
 * 
 * */ 

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
		username='NEWBIE';
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
	if(netdelay<10)
		netdelay=10;
		
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

