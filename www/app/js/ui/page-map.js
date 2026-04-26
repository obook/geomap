/*
 * Project: GeoMap
 * File: page-map.js
 * Description: Map page template, geometry helper, toolbar button bindings, and the help popup builder
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* Map page template (injected dynamically into Framework7's route). */
var mapPageTemplate = '\
<div class="page" data-name="map">\
	<div class="navbar navbar-geomap">\
		<div class="navbar-bg"></div>\
		<div class="navbar-inner">\
			<div class="left"><a href="/menu/" class="link"><span class="status-dot active"></span><span id="map_title_id"></span></a></div>\
			<div class="title"><span id="gps_state_label" data-i18n="gps.wait">GPS WAIT</span></div>\
			<div class="right">\
				<a href="#" class="link" id="btn-users" data-i18n="[title]map.btn_users_title" title="Zoom on all users">\
					<span id="usersnumbers">---</span>\
				</a>\
				<a href="#" class="link" id="button_GPS" data-i18n="[title]map.btn_gps_title" title="Zoom on me">\
					<i class="toolbar-icon icon-gps-error"></i>\
				</a>\
				<a href="#" class="link" id="button_network" data-i18n="[title]map.btn_network_title" title="Clear messages">\
					<i class="toolbar-icon icon-data-error"></i>\
				</a>\
			</div>\
		</div>\
	</div>\
	<div class="page-content" style="padding:0; overflow:visible !important; position:relative;">\
		<div id="messages_toolbar"><span id="messages_id"></span></div>\
		<div id="map_canvas"></div>\
	</div>\
	<div class="toolbar toolbar-bottom">\
		<div class="toolbar-inner">\
			<span id="map_speed_id" role="button" tabindex="0" data-i18n="[aria-label]map.help_aria; [title]map.help_title" aria-label="Open help" title="Help">GeoMap</span>\
		</div>\
	</div>\
</div>';

/* Register the map page template on the matching route. */
app.routes[1].content = mapPageTemplate;

/* Geometry helper - keep #map_canvas filling .page-content in spite of
 * Framework7's variable navbar/toolbar heights. */
function geometrychanged()
{
	var mapCanvas = document.getElementById('map_canvas');
	if (!mapCanvas) return;

	var pageContent = mapCanvas.parentElement;
	if (!pageContent) return;

	/* Framework7 already sized .page-content (navbar + toolbar deducted). */
	var h = pageContent.clientHeight;
	mapCanvas.style.height = h + 'px';
	mapCanvas.style.width = '100%';

	/* Force Leaflet to recompute its size. */
	if (geomap != null) {
		var map = geomap.GetMap();
		if (map) map.invalidateSize();
	}

	console.log("geometrychanged: map_canvas=" + mapCanvas.style.width + " x " + h + "px");
}

window.addEventListener('resize', geometrychanged);
window.addEventListener('orientationchange', geometrychanged);

/* Toolbar button actions */
jQuery(document).on('click', '#btn-users',       function () { ZoomToFitAllMarkers(); });
jQuery(document).on('click', '#button_GPS',      function () { ZoomToUserMarker(); });
jQuery(document).on('click', '#button_network',  function () { CleanUpMessage(); });

/* Help popup. Title, close label, and section content come from the
 * shared I18n dictionary so a single source of truth covers EN and FR. */
function buildHelpPopupHtml()
{
	var sections = (GEOMAP_I18N[GEOMAP_LANG] && GEOMAP_I18N[GEOMAP_LANG].help && GEOMAP_I18N[GEOMAP_LANG].help.sections)
		|| GEOMAP_I18N.en.help.sections;
	var html = '<div class="popup" id="help-popup-inst">';
	html += '<div class="view">';
	html += '<div class="page">';
	html += '<div class="navbar"><div class="navbar-bg"></div><div class="navbar-inner">';
	html += '<div class="title">' + I18n.t('help.title') + '</div>';
	html += '<div class="right"><a href="#" class="link popup-close">' + I18n.t('common.close') + '</a></div>';
	html += '</div></div>';
	html += '<div class="page-content">';
	html += '<div class="block">';
	for (var i = 0; i < sections.length; i++) {
		html += '<h3>' + sections[i].h + '</h3>';
		html += '<p>' + sections[i].p + '</p>';
	}
	html += '</div></div></div></div></div>';
	return html;
}

jQuery(document).on('click', '#map_speed_id', function (e) {
	e.preventDefault();
	var popup = app.popup.create({
		content: buildHelpPopupHtml(),
		on: {
			closed: function (p) { p.destroy(); }
		}
	});
	popup.open();
});
