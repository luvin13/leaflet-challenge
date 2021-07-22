// Define Query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Create earthquake layerGroup
var earthquakes = L.layerGroup();

//Create tile later
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: "pk.eyJ1Ijoicm9zYXpodSIsImEiOiJja2ZvbTFvbzEyM2c1MnVwbTFjdmVycXk5In0.71jVP2vD8pBWO2bsKtI48Q"
});

//Create map and give it layers
var myMap = L.map("map", {
    center: [37.3382, 121.8863],
    zoom: 5,
    layers: [streetMap, earthquakes]
});

d3.json(queryUrl, function(earthquakeData) {
    function markerSize(magnitude) {
        return magnitude * 3;
    };
    function chooseColor(depth) {
        switch(true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "orangeyellow";
            case depth > 10:
                return "yellow";
            default:
                return "green";
        }
    }
L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,
            {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            stroke: true,
            weight: 0.5
            }
            );
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
        + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
}).addTo(earthquakes);
earthquakes.addTo(myMap);

//Add Legend
var legend = L.control({position: "bottomright"});
legend.onadd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
})
