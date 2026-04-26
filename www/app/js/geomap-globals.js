/*
 * Project: GeoMap-Air
 * File: geomap-globals.js
 * Description: Global constants and timing knobs
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

var GLOBAL_APPNAME	=	'GEOMAP';

var GLOBAL_SERVER 	= 	'.';

var STATE_POSITION_ERROR			=  -4 ; /* unkwnown error */
var STATE_POSITION_TIMEOUT			= -3 ; /* = le probleme quand ça se place en Afrique : je met l'icone sur la map alors qu'on est en -3 ! */
var STATE_POSITION_UNAVAILABLE		= -2 ;
var STATE_PERMISSION_DENIED			= -1 ;
var STATE_POSITION_UNKNOWN			=  0 ;
var STATE_POSITION_OK				=  1 ;

var LAST_TIME_READ					= new Date();
var LAST_TIME_WRITE					= new Date();

/* In seconds, get data from server */
var GLOBAL_NETWORK_GETDATA			= 15;

/* In seconds, send data to server */
var GLOBAL_NETWORK_SENDATA			= 15;

/* In seconds, send data to server (configured by slider) */
var GLOBAL_NETWORK_SENDATA_MAXITIME	= 30;

/* In seconds, send a ping alive to the server */
var GLOBAL_SERVER_PING				= 15;

/* In seconds, limit time before ghost on map (gray LED) */
var GLOBAL_LIMIT_TTL				= 90;

/* In hours, maxi time to live in map, good choice = 5 or 8 or 24 */
var GLOBAL_MAXI_TTL					= 8;

/* Accuracy minimum pour apparaitre sur la carte, good choice = 10000 */
var GLOBAL_MINIMUM_ACCURAY			= 10000; // !!!!!!! FLO donne en foret accuracy 1414 et ICI par ETH : 140000 FIREFOX/MAgeia =25000 !!

/* In seconds, update markers, markers'infos; user number in map, good choice = 3 */
var GLOBAL_ANIMATE_MARKERS			= 2;

/* In seconds, animate the GPS, NETWORK icons and number of users , good choice = 2 */
var GLOBAL_REFRESH_INFO_SCREEN			= 2;

/* MARKERS */

/* Offset vertical for marker's label, good choice = 60 depending theming */
var GLOBAL_MAKER_LABEL_VERTPOS			= 92;
/* Offset horizontal for marker's label, good choice = 0 (marker max right) depending theming */
var GLOBAL_MAKER_LABEL_HORPOS			= 22;

/* Play sound for each event, good choice = 'on' or 'off' */
var GLOBAL_PLAY_SOUNDS				= 'on';

var AwesomeColors = new Array ();
AwesomeColors[0] = 'red';
AwesomeColors[1] = 'darkred';
AwesomeColors[2] = 'orange';
AwesomeColors[3] = 'green';
AwesomeColors[4] = 'darkgreen';
AwesomeColors[5] = 'blue';
AwesomeColors[6] = 'darkblue';
AwesomeColors[7] = 'purple';
AwesomeColors[8] = 'darkpurple';
AwesomeColors[9] = 'cadetblue';	

var HtmlColors = new Array ();		
HtmlColors[0] = '#d23d29'
HtmlColors[1] = '#a13336'
HtmlColors[2] = '#f69730'
HtmlColors[3] = '#72b026'
HtmlColors[4] = '#728224'
HtmlColors[5] = '#38aadd'
HtmlColors[6] = '#0067a3'
HtmlColors[7] = '#5b396b' // Purple
HtmlColors[8] = '#5a386a'
HtmlColors[9] = '#436978'


