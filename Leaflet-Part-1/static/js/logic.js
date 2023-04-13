//GET API

var
   url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// GET request
d3.json(url).then(function (data) {
    createFeatures(data.features);
});    

function createFeatures(earthquakeData) {

    var grade = [160, 110, 80, 40, 15];
    var colors = ["#dd0000","#ff2525","#ff6334","#ff9734","#ecdb34","#6bdb2d"]

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude:${feature.properties.mag}</p></h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // markerColor
    function markerColor(depth) {
        for(let i = 0; i < 5; i++) {
            if (depth > grade[i]) return  colors[i];
        }
        return colors[6];
    }

    // markers
    function pointToLayer(feature, loc) {
        var marker = {
            radius: feature.properties.mag ** 2 / 4,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        };
        return L.circleMarker(loc, marker);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
  
    createMap(earthquakes);

}

// createMap
function createMap(earthquakes) {

    // Tile layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Map object
    L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [street, earthquakes]
    });

}