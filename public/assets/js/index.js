let pos = {
  lat:40.14237372290742,
  lng: -82.9794526403665,
};
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let infopane;


// Initialize map and locate restaurant based on query
function initMap() {
 
  bounds = new google.maps.LatLngBounds();
  infowindow = new google.maps.InfoWindow();
  currentInfoWindow = infoWindow;
  infoPane = document.getElementById('panel');

  map = new google.maps.Map(
      document.getElementById('map'), {center: pos, zoom: 15});

  var request = {
    query: "BJ's Restaurant & Brewhouse",

    fields: ['name', 'geometry', "place_id"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
  
}

function createMarker(place) {
  service = new google.maps.places.PlacesService(map);

  let marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    title:place.name,
  });

  google.maps.event.addListener(marker, "click", () => {
         
      let request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'rating',
          'website', 'photos', ]
      }
      service.getDetails(request, (placeResult, status) => {
        showDetails(placeResult, marker, status)
      });
    });

   

  };




// Builds an InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    let rating = "None";
    if (placeResult.rating) rating = placeResult.rating;
    placeInfowindow.setContent('<div><strong>' + placeResult.name +
      '</strong><br>' + 'Rating: ' + rating + '</div>');
    placeInfowindow.open(marker.map, marker);
    currentInfoWindow = placeInfowindow;
    currentInfoWindow.close();
    showPanel(placeResult);
  } else {
    console.log('showDetails failed: ' + status);
  }
}


// Displays place details in a sidebar
function showPanel(placeResult) {
  // If infoPane is already open, close it
  if (infoPane.classList.contains("open")) {
    infoPane.classList.remove("open");
  }

  // Clear the previous details
  while (infoPane.lastChild) {
    infoPane.removeChild(infoPane.lastChild);
  }

 
  // Add the primary photo, if there is one
  if (placeResult.photos) {
    let firstPhoto = placeResult.photos[0];
    let photo = document.createElement('img');
    photo.classList.add('hero');
    photo.src = firstPhoto.getUrl();
    infoPane.appendChild(photo);
  }

  // Add place details with text formatting
  let name = document.createElement('h1');
  name.classList.add('place');
  name.textContent = placeResult.name;
  infoPane.appendChild(name);
  if (placeResult.rating) {
    let rating = document.createElement('p');
    rating.classList.add('details');
    rating.textContent = `Rating: ${placeResult.rating} \u272e`;
    infoPane.appendChild(rating);
  }
  let address = document.createElement('p');
  address.classList.add('details');
  address.textContent = placeResult.formatted_address;
  infoPane.appendChild(address);
  if (placeResult.website) {
    let websitePara = document.createElement('p');
    let websiteLink = document.createElement('a');
    let websiteUrl = document.createTextNode(placeResult.name + "'s Website");
    websiteLink.appendChild(websiteUrl);
    websiteLink.title = placeResult.website;
    websiteLink.href = placeResult.website;
    websitePara.appendChild(websiteLink);
    infoPane.appendChild(websitePara);
  }
 
  // Open the infoPane
  infoPane.classList.add("open");
}