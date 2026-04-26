/*
 * Project: GeoMap
 * File: helpers.js
 * Description: Small UI helpers used across page handlers - toast wrapper and zoom shortcuts
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function ZoomToFitAllMarkers()
{
	if (geomap != null) geomap.ZoomToFitAllMarkers();
}

function ZoomToUserMarker()
{
	if (geomap != null) geomap.ZoomToUserMarker();
}

function CleanUpMessage()
{
	if (geomap != null) geomap.CleanUpMessage();
	if (typeof app !== 'undefined') {
		app.toast.create({ text: t('messages.cleared_toast'), closeTimeout: 2000 }).open();
	}
}

function toast(message)
{
	if (typeof app !== 'undefined') {
		app.toast.create({ text: message, closeTimeout: 2000 }).open();
	}
}
