/*
 * Project: GeoMap-Air
 * File: geomap-latlngctrl.js
 * Description: Latitude / longitude coordinate display control
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

function LatLngControl(map)
{
	this.ANCHOR_OFFSET_ = new google.maps.Point(8, 8);
	this.node_ = this.createHtmlNode_();
	map.controls[google.maps.ControlPosition.TOP].push(this.node_);
	this.setMap(map);
	// hide control until mouse is over map.
	this.set('visible', false);
}

if(typeof(google) != "undefined")
{ 
	// Extend OverlayView so we can access MapCanvasProjection (as 'setMap').
	LatLngControl.prototype = new google.maps.OverlayView();
	LatLngControl.prototype.draw = function() {};
}

LatLngControl.prototype.createHtmlNode_ = function()
{
var divNode = document.createElement('div');
	divNode.id = 'latlng-control';
	divNode.index = 100;
return divNode;
};

LatLngControl.prototype.visible_changed = function()
{
	this.node_.style.display = this.get('visible') ? '' : 'none';
};

// display the LatLng moveover
LatLngControl.prototype.updatePosition = function(latLng)
{
var projection = this.getProjection();
var point = projection.fromLatLngToContainerPixel(latLng);

	this.node_.style.left = point.x + this.ANCHOR_OFFSET_.x + 'px';
	this.node_.style.top = point.y + this.ANCHOR_OFFSET_.y + 'px';

	this.node_.innerHTML = [
	latLng.toUrlValue(4)
	].join('');
};

/* GMapLatLngControl 

function GMapLatLngControl() {
    GControl.apply(this, [ true, false ]);
}

GMapLatLngControl.prototype = new GControl();

GMapLatLngControl.prototype.initialize = function(gmap) {
    this.gmap = gmap;
    this.latlngcontrol = element_create(gmap.getContainer(), 'div');
    this.latlngcontrol.className = 'fgmap_latlng_control';
    element_opacity_set(this.latlngcontrol, 0.6);
    GEvent.addListener(gmap, "mousemove", this.gmap_mousemove_cb.bind_event(this));
    this.gmap_mousemove_cb(gmap.getCenter());
    return this.latlngcontrol;
};

GMapLatLngControl.prototype.getDefaultPosition = function() {
    return new GControlPosition(G_ANCHOR_TOP_RIGHT, new GSize(18, 32));
}

GMapLatLngControl.prototype.printable = function() {
    return true;
};

GMapLatLngControl.prototype.selectable = function() {
    return false;
};

GMapLatLngControl.prototype.gmap_mousemove_cb = function(latlng) {
    this.latlngcontrol.innerHTML =
        latlng.lat().toFixed(6) + " " + latlng.lng().toFixed(6);
};
*/
