// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the tile layer that will be the background of our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the tile layer that will be the background of our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets,
	"Dark": dark 
  };

// Create the earthquake & tectonic layer for our map.
let earthquakes = new L.LayerGroup();
let tectonic = new L.LayerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
	Earthquakes: earthquakes,
	"Tectonic Plates": tectonic
};

// Create the map object with a center (Middle of US) and zoom level (0-18).
let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
});

// Then we add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Create a legend control object.
let legend = L.control({
	position: "bottomright"
});

// Add all details for legend
legend.onAdd = function () {
	let div = L.DomUtil.create("div", "info legend");
	const magnitudes = [0, 1, 2, 3, 4, 5];
	const colors = [
		"#98ee00",
		"#d4ee00",
		"#eecc00",
		"#ee9c00",
		"#ea822c",
		"#ea2c2c"
	];
	// Looping through our intervals to generate a label with a colored square for each interval.
	for (var i = 0; i < magnitudes.length; i++) {
		console.log(colors[i]);
		div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
			magnitudes[i] + (magnitudes[i + 1] ? "–" + magnitudes[i + 1] + "<br>" : "+");
	}
	return div;
};

legend.addTo(map);

// GeoJSON Data
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// This function returns the style data for each of the earthquakes we plot on the map.
// We pass the magnitude of the earthquake into two separate functions to calculate the color and radius.
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 1,
	  fillColor: getColor(feature.properties.mag),
	  color: "#000000",
	  radius: getRadius(feature.properties.mag),
	  stroke: true,
	  weight: 0.5
	};
}

// Tectonic Fault Style
function faultStyle(feature) {
	return {
		color: "dodgerblue",
		weight: 1.5
	};
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
	return magnitude * 4;
  }

// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
	if (magnitude > 5) {
	  return "#ea2c2c";
	}
	if (magnitude > 4) {
	  return "#ea822c";
	}
	if (magnitude > 3) {
	  return "#ee9c00";
	}
	if (magnitude > 2) {
	  return "#eecc00";
	}
	if (magnitude > 1) {
	  return "#d4ee00";
	}
	return "#98ee00";
}

// Retrieve the earthquake GeoJSON data.
d3.json(earthquakeData).then(function(data) {
	// Creating a GeoJSON layer with the retrieved data.
	console.log("PROCESSING Earthquake Data");
	L.geoJson(data, {
		//Each Feature (item in array into circle Marker on map)
		pointToLayer: function(feature, latlng) {
			//console.log(data);
			return L.circleMarker(latlng);
		},
		style: styleInfo,	// Set style for each marker
		// Create a popup for each marker to display magnitude & location (after creation/style)
		onEachFeature: function(feature, layer) {
			layer.bindPopup("Magnitude: " + feature.properties.mag + 
				"<br>Location: " + feature.properties.place);
		}
	}).addTo(earthquakes);
	earthquakes.addTo(map);
});

// Retrieve the tectonic fault lines GeoJSON data.
d3.json(tectonicData).then(function(data) {
	// Creating a GeoJSON layer with the retrieved data.
	console.log("PROCESSING Tectonic Fault Lines");
	console.log(data);
	L.geoJson(data, {
		// Set style for each marker
		style: faultStyle,	
	}).addTo(tectonic);
	tectonic.addTo(map);
});