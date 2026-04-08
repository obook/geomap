<?php

/*
 * Project : GeoMap
 * Maintenance cron for GeoMap server
 * Copyright (c) Olivier Booklage
 * Dual licensed under the MIT and GPL licenses.
 *
 * Last commit by $Author: obooklage $
 * Date - $Date: 2011-12-22 23:57:32 +0100 (jeu. 22 déc. 2011) $
 * Revision - $Rev: 154 $
 * Id : $Id: geomap-server-maintenance-multidomains.php 154 2011-12-22 22:57:32Z obooklage $
 *
 *
 * */

header("Content-Type: text/plain");

	$html=file("http://www.geo.wf/server/geomap-server-maintenance.php");

	if( $html != false)
	{
		echo "ok on geo.wf";
	}
	else
	{
		echo "error on geo.wf";
	}

exit;
?>
