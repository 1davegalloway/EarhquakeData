/*Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

   * Your data markers should reflect the magnitude of the earthquake in their size and color. 
     Earthquakes with higher magnitudes should appear larger and darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for your map data.

   * Your visualization should look something like the map above.


   * to run this application run python -m http.server 
        -> make sure you open the terminal at the location the index.html file is located
   
   */

// We need to create the map object and tell it what level to zoom for the default view 



var map = L.map("map", {
    center: [ 40.7, -94.5],
    zoom: 4
  });
  

// Then send the api request 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
}).addTo(map);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {

        //console.log(data);
        plotData(data);

        createFeatures(data.features)
        
});

//  We can start by putting data on the map 

//  Step 1: put the data on the map. 
 
        //  1.1 Since we are using geoJson data we need to use the L.geoJson function to plot the data on the map
        //  1.2 Resources -- https://leafletjs.com/reference-1.3.4.html#geojson

    // Step 2: We can use the options in the GeoJson file to color our map 
        //  2.1: We need to color the map based on the Earthquake Magnitude

//Create variable for tectonic plates.

var linkPlates = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json';
 
function color(data){
    return data < 2 ? "#f6eff7" :
    data < 3 ? "#253494" :
    data < 4 ? "#7fcdbb" :
    data < 5 ? "#1c9099" :
    data < 6 ? "#016c59" :
               "#fd8d3c";
}
x=null
function plotData(data){

  // step 1.1 + 1.2 goes here
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + feature.properties.felt + "</p>")
      
    }
 
  L.geoJSON(data, {
    pointToLayer: function (feature,latlng) {
      return L.circleMarker(latlng, { radius: feature.properties.mag*5 });
  },
  style: function (feature) {
      return {
          fillColor: color(feature.properties.mag),
          fillOpacity: .5,
          weight: 1,
          color: "#7fcdbb"
      }
  }, onEachFeature: onEachFeature}
)

.addTo(map);  
}


function createFeatures(link) {
  console.log(link);
//Step 2

//Add legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 1, 2, 3, 4, 5],
        labels = [];

    div.innerHTML += '<h4>Magnitude</h4><hr>'

    // loop through magnitude and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map)};