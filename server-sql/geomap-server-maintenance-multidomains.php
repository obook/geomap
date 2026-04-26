<?php

/*
 * Project: GeoMap
 * File: geomap-server-maintenance-multidomains.php
 * Description: Multi-domain maintenance variant
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

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
