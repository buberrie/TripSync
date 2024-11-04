<script setup>
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const emit = defineEmits(["addDestination"]);
const newDestination = ref("");
const apiKey = "AIzaSyB2fNUhOzh1pU4S05bQAZLXn7BX9ZumsGc"; 
const autocomplete = ref(null);
const predictions = ref([]);
const googleMaps = ref(null); // Store Google Maps instance

// Initialize Google Maps API and Autocomplete
const initializeAutocomplete = () => {
  const loader = new Loader({ apiKey, version: "weekly", libraries: ["places"] });

  loader.load().then((google) => {
    googleMaps.value = google; // Store Google Maps instance
    autocomplete.value = new google.maps.places.AutocompleteService();
  }).catch(error => {
    console.error("Error loading Google Maps:", error);
  });
};

// Fetch suggestions based on user input
const fetchSuggestions = () => {
  if (!autocomplete.value || newDestination.value === "") {
    predictions.value = [];
    return;
  }

  autocomplete.value.getPlacePredictions(
    { input: newDestination.value },
    (suggestions, status) => {
      if (status === googleMaps.value.maps.places.PlacesServiceStatus.OK) {
        predictions.value = suggestions;
      } else {
        predictions.value = [];
        console.error("Autocomplete error:", status);
      }
    }
  );
};

// Handle user selection from suggestions
const selectSuggestion = (prediction) => {
  newDestination.value = prediction.description;
  predictions.value = []; // Clear predictions after selection

  const geocoder = new googleMaps.value.maps.Geocoder();
  geocoder.geocode({ address: prediction.description }, (results, status) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      emit("addDestination", {
        name: results[0].formatted_address,
        lat: location.lat(),
        lng: location.lng(),
      });
      
      newDestination.value = "";
    } else {
      console.error("Geocode error:", status);
    }
  });
};

// Initialize autocomplete on component mount
onMounted(() => {
  initializeAutocomplete();
});
</script>

<template>
  <div class="w-full">
    <label for="destination" class="block text-gray-700 font-semibold mb-2">Where is your next destination?</label>
    <input
      v-model="newDestination"
      @input="fetchSuggestions"
      id="destination"
      placeholder="Enter destination"
      class="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-200 transition"
    />
    <ul v-if="predictions.length" class="bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
      <li
        v-for="prediction in predictions"
        :key="prediction.place_id"
        @click="selectSuggestion(prediction)"
        class="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
      >
        {{ prediction.description }}
      </li>
    </ul>
  </div>
  
</template>

<style scoped>

</style>
