/*
 * Project: GeoMap
 * File: index.js
 * Description: Home page entry script (sound init, storage retrieval)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* HTML5 : storage : recall */

var geomap = null;
var username = null;
var team = null;
var handle = null;
var netdelay = null;
var sound = null;

/* Sound Manager */
 
soundManager.waitForWindowLoad = false; /* Essai */
soundManager.useFlashBlock = false;
soundManager.consoleOnly = true;
soundManager.debugMode = false;
soundManager.debugFlash = false;
soundManager.preferFlash = false;
soundManager.url = 'vendor/soundmanager/swf/';
soundManager.autoLoad = true; // IMPORTANT!

soundManager.onload = function()
{
	soundManager.createSound({autoLoad:true, id: 'player_digital_beep_id', url: 'assets/sounds/digital_beep.ogg'});
	soundManager.createSound({autoLoad:true, id: 'player_digital_beep_id_wav', url: 'assets/sounds/digital_beep.wav'});
	soundManager.createSound({autoLoad:true, id: 'player_digital_beep_id_mp3', url: 'assets/sounds/digital_beep.mp3'});

	soundManager.createSound({autoLoad:true, id: 'player_follow_on_id', url: 'assets/sounds/ding.ogg'});
	soundManager.createSound({autoLoad:true, id: 'player_follow_off_id', url: 'assets/sounds/ding-reverse.ogg'});		
	soundManager.createSound({autoLoad:true, id: 'player_news_user_id', url: 'assets/sounds/pop1.ogg'});
	soundManager.createSound({autoLoad:true, id: 'player_newmessage_id', url: 'assets/sounds/ccir_small.ogg'}); // sounds/ccir_small.wav is readed truncated, but mp3 is OK
	soundManager.createSound({autoLoad:true, id: 'player_dong_id', url: 'assets/sounds/dong.ogg'});
	
	/* trop tot pour Chrome soundManager.play('player_digital_beep_id'); */
}

function get_storage()
{
	/* HTML5 : storage : recall */
	username = get_username();
	team = get_channel();
	handle = get_userid();
	netdelay = get_netdelay();
	sound = get_sound();
	GLOBAL_SERVER = get_server();
}

function BodyOnLoad()
{
	get_storage();
}

/* Tools */

function SendMessage(message)
{
	if( geomap != null )
	{
		geomap.SendMessage(message);
	}	
}
