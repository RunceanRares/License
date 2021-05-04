/************************************************************************************/
/* EXTRA FUNCTIONS 																	*/
/************************************************************************************/	



/////////////////////////////////////////////////////////////////////////////////
// Debounced resize event
/////////////////////////////////////////////////////////////////////////////////
(function($,sr){
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			};
			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);
	        timeout = setTimeout(delayed, threshold || 200);
		};
	}
	// smartscroll 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartresize');



/////////////////////////////////////////////////////////////////////////////////
// Debounced scroll event
/////////////////////////////////////////////////////////////////////////////////
(function($,sr){
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			};
			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);
	        timeout = setTimeout(delayed, threshold || 200);
		};
	}
	// smartscroll 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('scroll', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartscroll');



/////////////////////////////////////////////////////////////////////////////////
// Get scrollbar width
/////////////////////////////////////////////////////////////////////////////////
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; 
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
}



/////////////////////////////////////////////////////////////////////////////////
// Get vendor prefix
/////////////////////////////////////////////////////////////////////////////////
function getVendorCSSPrefix() {
	if ('result' in arguments.callee) return arguments.callee.result;
	var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
	var someScript = document.getElementsByTagName('script')[0];
	for (var prop in someScript.style) {
		if (regex.test(prop)) {
			// test is faster than match, so it's better to perform
			// that on the lot and match only when necessary
			return arguments.callee.result = "-" + prop.match(regex)[0] + "-";
		}
	}
	// Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
	// However (prop in style) returns the correct value, so we'll have to test for
	// the precence of a specific property
	if('WebkitOpacity' in someScript.style) return arguments.callee.result = '-Webkit-';
	if('KhtmlOpacity' in someScript.style) return arguments.callee.result = '-Khtml-';
	return arguments.callee.result = '';
}



/////////////////////////////////////////////////////////////////////////////////
// Initialize Google map
/////////////////////////////////////////////////////////////////////////////////
function initializeMap(mapElem, mapIniSettings) {

	// Prepare the mapSettings
	var mapSettings = {
		zoom				: mapIniSettings.zoom,
		mapTypeId			: google.maps.MapTypeId.ROADMAP,
		scrollwheel			: false,
		mapTypeControl		: false,
		panControl			: false,
		scaleControl		: false,
		streetViewControl	: true,
		zoomControl			: true,
		zoomControlOptions	: {
			style : google.maps.ZoomControlStyle.LARGE
		},
		styles				: [{ "featureType": "all", "elementType": "all", "stylers": [ {"saturation": "-100"}, { "lightness": "15" } ] } ]
	};

	// Prepare initial marker settings in case we have a custom pin icon
	var markerSettings = {
		animation	: google.maps.Animation.DROP,
		url			: mapIniSettings.url,
		title		: mapIniSettings.title,
		opacity		: mapIniSettings.show_callout ? 0 : 1
	}
	if ( typeof mapIniSettings.pinIcon !== 'undefined' && mapIniSettings.pinIcon.trim() != '' ) {
		var pinIconImage = {
			url		: mapIniSettings.pinIcon,
			origin	: new google.maps.Point(0, 0),
			anchor	: new google.maps.Point(mapIniSettings.xOffset, mapIniSettings.yOffset)
		};	
		markerSettings.icon = pinIconImage;
	}
	var marker;
	
	if ( typeof mapIniSettings.address !== 'undefined' && mapIniSettings.address.trim() != '' ) {
		// we have an address, let's use this
		var map = new google.maps.Map(mapElem, mapSettings);
		markerSettings.map = map;
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 
			'address'	: mapIniSettings.address 
		}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				markerSettings.position = results[0].geometry.location;
				marker = new google.maps.Marker(markerSettings);
				google.maps.event.addListener(marker, 'click', function () {
					window.open(marker.url);
				});
			} else {
			}
		});
	} else {
		// we should have lat and lng
		mapSettings.center = {
			lat : mapIniSettings.lat,
			lng : mapIniSettings.lng
		};
		var map = new google.maps.Map(mapElem, mapSettings);
		markerSettings.map = map;
		markerSettings.position = mapSettings.center;
		marker = new google.maps.Marker(markerSettings);
		google.maps.event.addListener(marker, 'click', function () {
			window.open(marker.url);
		});
	}
	
	
	if ( typeof mapIniSettings.show_callout !== "undefined" && mapIniSettings.show_callout ) {
		var $map_callout = $(mapElem).siblings('.map-callout'),
			dx = $map_callout.outerWidth() / 2,
			dy = $map_callout.outerHeight() + 31;
		function moveMapCallout() {
			var scale = Math.pow(2, map.getZoom());
			var nw = new google.maps.LatLng(
				map.getBounds().getNorthEast().lat(),
				map.getBounds().getSouthWest().lng()
			);
			var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
			var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
			var x = Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale) - dx,
				y = Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale) - dy;
			$map_callout.css({
				top: y,
				left: x
			});
			return true;
		}
		google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
			moveMapCallout();
			$map_callout.addClass('on');
		});
		google.maps.event.addListener(map, 'drag', moveMapCallout);
	}	
	
	
	
	
	
	

}



//////////////////////////////////////////////////////////////////////////////////
// Getting parameter from url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//////////////////////////////////////////////////////////////////////////////////

