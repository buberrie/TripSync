<script setup>
import { onMounted, ref, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

// Define your API key and create a single loader instance
const apiKey = "AIzaSyB2fNUhOzh1pU4S05bQAZLXn7BX9ZumsGc";
const loader = new Loader({
  apiKey: apiKey,
  version: "weekly",
  libraries: ["places"],
});

const emit = defineEmits(["updateDestination", "addDestination"]);
const map = ref(null);
const mapContainer = ref(null);
const userLat = ref(0);
const userLng = ref(0);
const userAddress = ref("");
const markersMap = ref(new Map()); // Map to store markers by destination index

let directionsService;
let directionsRenderer;

// destination to be marked on the map
const props = defineProps({
  destinations: Array,
});

// Get the user's location and reverse-geocode it to an address
const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLat.value = position.coords.latitude;
      userLng.value = position.coords.longitude;
      initMap(); // Initialize map at user's location

      // Reverse geocode to get the address and update userAddress
      reverseGeocode(userLat.value, userLng.value, (address) => {
        userAddress.value = address;

        // send user addres to parent
        emit('sendUserAddress', {
          name: address,
          lat: userLat.value,
          lng: userLng.value,
        }); // Emit event with the value

      });

    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

// Initialize the map with user's location
const initMap = () => {
  loader
    .load()
    .then((google) => {
      // Initialize the map
      map.value = new google.maps.Map(mapContainer.value, {
        center: { lat: userLat.value, lng: userLng.value },
        zoom: 15,
      });

      // Initialize the marker at user's location
      let userAddressMarker = new google.maps.Marker({
        position: { lat: userLat.value, lng: userLng.value },
        map: map.value,
        draggable: true,
        title: "Your location",
      });

      // Add dragend event listener to user marker
      userAddressMarker.addListener("dragend", (event) => {
        const newUserLat = event.latLng.lat();
        const newUserLng = event.latLng.lng();

        reverseGeocode(newUserLat, newUserLng, (newAddress) => {
          userAddress.value = newAddress;

          userAddressMarker.setPosition({ lat: newUserLat, lng: newUserLng });
          userAddressMarker.setTitle("Your location");

          // send user addres to parent
          emit('sendUserAddress', {
            name: newAddress,
            lat: userLat.value,
            lng: userLng.value,
          });
        });
      });

      // Map click event to add new destination
      map.value.addListener("click", (event) => {
        const clickedLat = event.latLng.lat();
        const clickedLng = event.latLng.lng();

        reverseGeocode(clickedLat, clickedLng, (address) => {
          // Emit event to add new destination
          emit("addDestination", {
            name: address,
            lat: clickedLat,
            lng: clickedLng,
          });
        });

        updateMarkers();
      });

      // Watch for changes in destinations to update markers
      updateMarkers();
      
      // Initialize DirectionsService and DirectionsRenderer
      directionsService = new google.maps.DirectionsService();
      directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

      // // Display route if there are existing destinations
      // if (props.destinations.length > 1) {
      //   calculateAndDisplayRoute(props.destinations);
      // }
    })
    .catch((error) => {
      console.error("Error loading Google Maps:", error);
    });
};

// Reverse geocode latitude and longitude to an address
const reverseGeocode = (latitude, longitude, callback) => {
  loader
    .load()
    .then((google) => {
      const geocoder = new google.maps.Geocoder();
      const location = { lat: latitude, lng: longitude };

      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          callback(address); // Use callback to send address back
        } else {
          console.error("Geocode failed: " + status);
        }
      });
    })
    .catch((error) => {
      console.error("Error loading Geocoder:", error);
    });
};

// Update markers based on destinations prop
const updateMarkers = () => {
  watch(() =>
    props.destinations,
    (newDestinations) => {
      // console.log('New destinations received in MapView:', newDestinations);
      // console.log('Marker received in MapView:', markersMap);
      newDestinations.forEach((destination, index) => {
        // Check if the marker already exists
        if (markersMap.value.has(index)) {
          const marker = markersMap.value.get(index);
          marker.setPosition({ lat: destination.lat, lng: destination.lng });
          marker.setTitle(destination.name);
        } else {
          // Create a new marker if it doesn't exist
          const marker = new google.maps.Marker({
            position: { lat: destination.lat, lng: destination.lng },
            map: map.value,
            draggable: true,
            title: destination.name,
          });

          // Add dragend event listener to update position
          marker.addListener("dragend", (event) => {
            const newLat = event.latLng.lat();
            const newLng = event.latLng.lng();

            reverseGeocode(newLat, newLng, (newAddress) => {
              emit("updateDestination", {
                index,
                name: newAddress,
                lat: newLat,
                lng: newLng,
              });
            });
          });

          // Store marker in the markersMap
          markersMap.value.set(index, marker);
        }
      });
    },
    { deep: true }
  );
};

// function calculateAndDisplayRoute(destinations) {
//   // Define the start (user address) and the end (last destination)
//   const start = { lat: userAddress.value.lat, lng: userAddress.value.lng };
//   const end = {
//     lat: destinations[destinations.length - 1].lat,
//     lng: destinations[destinations.length - 1].lng,
//   };

//   // Define waypoints (all destinations except start and end)
//   const waypoints = destinations.slice(1, -1).map((dest) => ({
//     location: { lat: dest.lat, lng: dest.lng },
//     stopover: true,
//   }));

//   // Request route from DirectionsService
//   directionsService.route(
//     {
//       origin: start,
//       destination: end,
//       waypoints: waypoints,
//       travelMode: google.maps.TravelMode.DRIVING,
//     },
//     (result, status) => {
//       if (status === "OK") {
//         directionsRenderer.setDirections(result); // Display route on map
//       } else {
//         console.error("Directions request failed due to " + status);
//       }
//     })
// }

// watch and tarck for changes then show routes on the map
// watch(
//   () => props.destinations,
//   (newDestinations) => {
//     if (newDestinations.length > 1) {
//       calculateAndDisplayRoute(newDestinations);
//     }
//   },
//   { deep: true, immediate: true }
// );

onMounted(() => {
  getUserLocation();
});
</script>

<template>
  <div class="my-10 md:p-4 p-2 bg-gray-50 rounded-lg shadow-md w-full">
    <div ref="mapContainer" class="md:h-[30rem] h-[20rem] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm"></div>
    <h2 class="mt-6 text-lg font-semibold text-gray-700">
      <span class="text-gray-500">Your Location:</span> {{ userAddress }}
    </h2>
  </div>
</template>
