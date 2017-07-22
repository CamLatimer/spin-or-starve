// goal:
// grab data from api, show the user a single random result for their area,
// allow the user to see another result if they want
import { spaRouter } from '../routes/spaRouter';
const spin = require('../views/spin.html');
import { wheelSpin, resultToggle } from '../DOM/dom';

const places = (function(){

  let googleMap;
  let placesService;
  let userLocation;
  let mapContainer;
  let mapArea;
  let placesArr = [];
  let userPlaces = [];
  let userViewData;

  // set up a promise constructor to resolve slow browser geolocation
   function promiseInput(resolve, reject){
    navigator.geolocation.getCurrentPosition(function(position){
          resolve(position);
     }, function(error){
       // use this to get the city from the user if they don't allow the browser to get their location
       let userInput = prompt('where are you?');
       let request = {
         address: userInput,
       }
       let geocoder = new google.maps.Geocoder();
       function handleGeoCode(result, status){
        //  console.log(result[0].geometry.bounds.getCenter());
        // to do: get bounds object from the response and use it for places search, use .getCenter() to get lat/lng functions then set a new object with lat and lng props
         let googleLat = parseFloat(result[0].geometry.location.lat());
         let googleLng = parseFloat(result[0].geometry.location.lng());
         userLocation = {
           lat: googleLat,
           lng: googleLng
         }
         reject(userLocation);
         return userLocation;
       }
       geocoder.geocode(request, handleGeoCode);
     });
   }

  // get coordinates from browser's geolocation api
   function browserLocate(position){
     let userCoords = {
       lat: parseFloat(position.coords.latitude),
       lng: parseFloat(position.coords.longitude)
     };
     userLocation = userCoords;
     return userLocation;
    }

    // make the map with google's api and pass on the location thru then()
   function makeMap(location){
     mapArea = document.createElement('div');
     mapArea.setAttribute('style', 'width: 100%; height:100%;')
      googleMap = new google.maps.Map(mapArea, {
          center: {lat: location.lat, lng: location.lng},
          zoom: 10
        });
      return location;
   }

   // show the google map to the user
   function addMapToPage(){
      mapContainer = document.getElementById('map_container');
      mapContainer.setAttribute('style', 'width: 150px; height:150px; border: 1px solid black;');
      mapContainer.appendChild(mapArea);
   }

   // add an event listener to spin button for making the call to Places
   function addApiTrigger(location){
     let apiTrigger = document.querySelector('.apiTrigger');
     if(apiTrigger){
       apiTrigger.addEventListener('click', function(){
        //  placesSearch(location);
        processPlaces();
       })
     }
   }

   // make the request for places
   function placesSearch(location){
    //  let searchLocation = location;
     let request = {
       location: location,
       radius: 20000,
       query: 'restaurant'
     }
     if(placesArr.length === 0){
       placesService = new google.maps.places.PlacesService(googleMap);
       placesService.textSearch(request, handlePlacesService);
     }
   }

   // callback to handle response from places API
   function handlePlacesService(response, status, pagination){
       placesArr = placesArr.concat(response);
       if(pagination.hasNextPage){
         setTimeout(function(){
           pagination.nextPage();
         }, 2100)
       }
   }

   // get the info we want from places API response
   function processPlaces(){
     console.log(placesArr);
     // pick a place from beginning of the placesArr
     let place = placesArr.splice(0,1)[0];
     let searchResult;
      // check to see if the place is in the userPlaceSearches array,
     if (userPlaces.length){
       let isMatch = userPlaces.indexOf(place)
       if(isMatch.length > -1){
         processPlaces();
       } else{
         userPlaces.push(place);
         searchResult = place;
       }
     } else {
       userPlaces.push(place);
       searchResult = userPlaces[0];
       // show the user the result...
     }
     placesService.getDetails({placeId: searchResult.place_id}, handleDetails)

   }

   function handleDetails(response, status){
     let img = response.photos[0].getUrl({'maxWidth': 120, 'maxHeight': 120});
     userViewData = {
       name: response.name,
       address: response.formatted_address,
       website: response.website,
       phone: response.formatted_phone_number,
       photoUrl: img,
       types: response.types,
     }
    //  change the view
     routeToResult();
   }

   // route user to page showing result
   function routeToResult(){
     wheelSpin();
     setTimeout(function(){
       spaRouter.swapContent(spin, userViewData)
        addApiTrigger();
        document.querySelector('.spin__wheelHolder').style.opacity = 0;
        let result = document.querySelector('.spin__result');
        result.classList.remove('resultHide');
        result.classList.add('resultShow');
     }, 4000)

   }
   // return the place data to be put in the DOM -- use in spaRouter.js
   function showUserSearchResult(){
     return userViewData;
   }

  // kick things off by getting the user's location and adding event listener to spin button
  function init(){
    // if user location is already in place, run google maps code,
    if(userLocation){
      console.log(userLocation);
      makeMap(userLocation);
      placesSearch(userLocation);
      addApiTrigger(userLocation);
    } else {
      // grab user's location via browser or user input + google maps
      // (still pending a run through w/o geolocation api)
      // if ("geolocation" in navigator) {
        let locationPromise = new Promise(promiseInput);
        locationPromise
        .then(browserLocate)
        .catch(location => location)
        .then(makeMap)
        .then(placesSearch)
        .then(addApiTrigger);
      // } else {
        // for now, only make available if
      // console.log('hey turn your GPS location feature on');
      // }
    }
  }

  return {
    init: init,
    showUserSearchResult: showUserSearchResult,
  }
})();

export { places };
