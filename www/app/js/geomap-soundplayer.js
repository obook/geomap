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
console.log('Loading geomap-soundplayer.');

var my_media = null;

function playaudio(src_id,src_url)
{
	console.log("playaudio "+src_url+' GLOBAL_USE_PHONEGAP_ADDON='+GLOBAL_USE_PHONEGAP_ADDON);
	
	if(typeof(soundManager)!='undefined')
	{
		soundManager.play(src_id);
	}
	else
	{
		my_media = new Media( "/android_asset/www/" + src_url, playaudio_Success, playaudio_Error);
		my_media.play();			
	}

}
 
function playaudio_Success() {
console.log('playaudio_Success');
	if( my_media != null )
	{
		my_media.release();
		my_media = null;
	}
}

function playaudio_Error() {
console.log('playaudio_Error');
	if( my_media != null )
	{
		my_media.release();
		my_media = null;
	}
}

