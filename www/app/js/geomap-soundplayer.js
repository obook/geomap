/*
 * geomap.js
 * 
 * Last commit by $Author: obooklage $
 * Date - $Date: 2013-08-02 00:51:01 +0200 (ven., 02 août 2013) $
 * Revision - $Rev: 277 $
 * Id : $Id: geomap.js 277 2013-08-01 22:51:01Z obooklage $ 
 * 
 * 
 * */

function playaudio(src_id, src_url)
{
	console.log('[GeoMap] Play: ' + src_url);
	if(typeof(soundManager) != 'undefined')
	{
		soundManager.play(src_id);
	}
}

