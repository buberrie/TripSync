<script setup>
import { ref, onMounted } from "vue";
import DestinationForm from "@/components/DestinationForm.vue";
import MapView from "@/components/MapView.vue";
import DestinationList from "@/components/DestinationList.vue";
import TripDetails from "@/components/TripDetails.vue";
import DistanceCalculator from "@/components/DistanceCalculator.vue";

// State for destinations and journey summary data
const destinations = ref([]);
const journeyData = ref({
  totalDistance: 0,
  totalTime: 0,
  fuelNeeded: 0,
});

const userAddressFromMapView = ref({});

// Load destinations from local storage when component is mounted
onMounted(() => {
  const storedDestinations = JSON.parse(localStorage.getItem('destinations'));
  if (storedDestinations) {
    destinations.value = storedDestinations;
  }
});

const receiveUserAddress = (value) => {
  userAddressFromMapView.value = value; 
};

// Handler for adding a new destination from MapView
const handleAddDestination = (newDestination) => {
  // Check if the destination already exists
  const exists = destinations.value.some(
    (destination) => destination.name === newDestination.name &&
                     destination.lat === newDestination.lat &&
                     destination.lng === newDestination.lng
  );

  if (exists) {
    alert('This destination has been added already.');
  } else {
    destinations.value.push(newDestination);
    // Store updated destinations in local storage
    localStorage.setItem('destinations', JSON.stringify(destinations.value));
  }
};

// Handler for updating an existing destination (e.g., when marker is dragged)
const handleUpdateDestination = (destination) => {
  destinations.value[destination.index] = {
    name: destination.name,
    lat: destination.lat,
    lng: destination.lng,
  };
  // Store updated destinations in local storage
  localStorage.setItem('destinations', JSON.stringify(destinations.value));
};

// Handler to receive updated journey data (distances, times) from DistanceCalculator
const handleUpdateJourneyData = (updatedJourneyData) => {
  journeyData.value = updatedJourneyData;
};
</script>

<template>
  <div class="flex flex-col justify-center items-center md:p-10 p-4 md:w-[90%] w-full max-w-[1440px] mx-auto">
    <!-- Destination Form where users can enter destination address -->
    <DestinationForm
      :destinations="destinations"
      @addDestination="handleAddDestination"
      @updateDestination="handleUpdateDestination"
    />

    <!-- Map component where users can add destinations -->
    <MapView
      :destinations="destinations"
      @sendUserAddress="receiveUserAddress"
      @addDestination="handleAddDestination"
      @updateDestination="handleUpdateDestination"
    />

    <!-- Destination list component for managing the order -->
    <DestinationList
      :destinations="destinations"
      @update:destinations="(newDestinations) => destinations = newDestinations"
    />

    <!-- Distance calculation component (headless) -->
    <DistanceCalculator
      :destinations="destinations"
      :receivedUserAddress="userAddressFromMapView"
      @updateJourneyData="handleUpdateJourneyData"
    />

    <!-- Journey details component to display summary data -->
    <TripDetails :journeyData="journeyData" />
  </div>
</template>

<style scoped>

</style>
