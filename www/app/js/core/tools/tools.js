/*
 * Project: GeoMap
 * File: tools.js
 * Description: Generic utility helpers (DOM creation, random IDs, geographic distance)
 * Author: Olivier Booklage
 * License: GPL v3
 * Date: April 2026
 */

/* DOM helper - create an element under an optional parent. */
function element_create(parent, tag, type)
{
	var elem = document.createElement(tag);

	if (type) {
		elem.setAttribute("type", type);
	}
	if (parent) {
		parent.appendChild(elem);
	}

	if (tag == "div") {
		elem.style.display = "block";
	} else {
		elem.style.visibility = "visible";
	}

	return elem;
}

/* Random identifier helpers. The returned strings are opaque cache
 * busters and pseudo-anonymous user keys; they are not cryptographic. */
function GetRandomID()
{
	return "clsid"
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17);
}

function GetRandomUserID()
{
	return "usr"
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17)
		+ Math.random() * Math.pow(10, 17);
}

/* Great-circle distance between two points expressed in decimal degrees,
 * using the Haversine formula. Returns kilometres or -1 when any input
 * is missing. */
function GetDistance(lat1, lon1, lat2, lon2)
{
	var R = 6371; /* Earth radius, km */

	if (!lat1 || !lon1 || !lat2 || !lon2) {
		console.error('[GeoMap] GetDistance: null coordinates');
		return -1;
	}

	if (typeof(Number.prototype.toRad) === "undefined") {
		Number.prototype.toRad = function () {
			return this * Math.PI / 180;
		};
	}

	var dLat = (lat2 - lat1).toRad();
	var dLon = (lon2 - lon1).toRad();
	lat1 = lat1.toRad();
	lat2 = lat2.toRad();

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
		+ Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}
