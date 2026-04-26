/*
 * Project: GeoMap
 * File: geomap-soundplayer.js
 * Description: SoundManager2 playback wrapper
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function playaudio(src_id, src_url)
{
	console.log('[GeoMap] Play: ' + src_url);
	if(typeof(soundManager) != 'undefined')
	{
		soundManager.play(src_id);
	}
}

