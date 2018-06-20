// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -33.8688, lng: 151.2195},
  zoom: 13,
  mapTypeId: 'roadmap'
});

// Create the search box and link it to the UI element.
var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function() {
  searchBox.setBounds(map.getBounds());
});

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
  var places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  // Clear out the old markers.
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    markers.push(new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    }));

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
});
}



function getAPIdata() {

var url = "http://api.openweathermap.org/data/2.5/weather";
var apiKey ="cb0c741b8289fadab023979b7d8b2048";
var city = document.getElementById("pac-input").value;

// construct request
var request = url + "?" + "appid=" + apiKey + "&" + "q=" + city;

// get current weather
fetch(request)

// parse to JSON format
.then(function(response) {
  return response.json();
})

// render weather per day
.then(function(response) {
  // render weatherCondition
  onAPISucces(response); 
})

// catch error
.catch(function (error) {
  onAPIError(error);
});
}


function onAPISucces(response) {
var city = document.getElementById("pac-input").value;
// get type of weather in string format
var type = response.weather[0].description;

// get temperature in Celcius
var degC = Math.floor(response.main.temp - 273.15);

// render weather in DOM
var weatherBox = document.getElementById('weather');
weatherBox.innerHTML = degC + "&#176;C <br>" + type;



}


function onAPIError(error) {
var city = document.getElementById("pac-input").value;
console.error('Fetch request failed', error);
var weatherBox = document.getElementById('weather');
weatherBox.innerHTML = 'No weather data available <br /> Did you enter a valid city?'; 
}

document.getElementById("getWeather").onclick = function () {
  getAPIdata(city);
};