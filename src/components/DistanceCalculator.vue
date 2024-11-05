<script setup>
import { ref, watch } from "vue";

// Track the selected travel mode
const selectedTravelMode = ref('DRIVING'); // Default to the first option

// Function to fetch distance and time between two locations
const fetchDistanceAndTime = async (origin, destination) => {
    const service = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: selectedTravelMode.value,
            },
            (response, status) => {
                // console.log("Status:", status); // Log the status
                if (status === "OK") {
                    const result = response.rows[0].elements[0];
                    if (result.status === "OK") {
                        resolve({
                            distance: result.distance.text,
                            duration: result.duration.text,
                            distanceValue: result.distance.value,
                            durationValue: result.duration.value,
                        });
                    } else {
                        reject(new Error(`Error in distance result: ${result.status}`));
                    }
                } else {
                    reject(new Error(`Error fetching distance matrix: ${status}`));
                }
            }
        );
    });
};

// Reactive object to hold journey data
const journeyData = ref({
    segments: [],
    totalDistance: 0,
    totalTime: 0,
    fuelNeeded: 0,
});

// Define props
const props = defineProps(['receivedUserAddress', 'destinations']);

// Emits to communicate with the parent component
const emit = defineEmits(["updateJourneyData"]);

// Function to calculate journey data
const calculateJourneyData = async () => {
    const segments = [];
    let totalDistance = 0;
    let totalTime = 0;

    // Ensure we start with the user address followed by destinations
    const allDestinations = [props.receivedUserAddress, ...props.destinations];

    // Loop through each segment from the user address to the first destination
    for (let i = 0; i < allDestinations.length - 1; i++) {
        const origin = allDestinations[i];
        const destination = allDestinations[i + 1];
        // console.log("Destination:", destination); // Log destination
        try {
            const { distance, duration, distanceValue, durationValue } = await fetchDistanceAndTime(origin, destination);
            segments.push({ origin, destination, distance, duration, distanceValue, durationValue });
            totalDistance += distanceValue; // Accumulate total distance in meters
            totalTime += durationValue; // Accumulate total time in seconds
        } catch (error) {
            console.error("Failed to fetch distance:", error);
        }
    }

    // Update the journey data
    journeyData.value.segments = segments;
    journeyData.value.totalDistance = totalDistance; // Store total distance
    journeyData.value.totalTime = totalTime; // Store total time
    journeyData.value.fuelNeeded = calculateFuelNeeded(totalDistance); // Optional fuel calculation

    // Emit updated journey data to parent
    emit("updateJourneyData", journeyData.value);
};

// Optional fuel calculation function
const calculateFuelNeeded = (distance) => {
    const averageFuelConsumption = 8; // Example: 8 liters per 100 km
    return ((distance / 1000) * averageFuelConsumption) / 100; // Fuel needed in liters
};

// Watch for changes in the destinations array or props.receivedUserAddress
watch(
    () => [props.destinations, props.receivedUserAddress],
    async ([newDestinations, newUserAddress]) => {
        if (newUserAddress && newDestinations.length > 0) {
            await calculateJourneyData();
        }
    },
    { deep: true, immediate: true }
);
</script>

<template>
  <div class="mt-10 mb-2 w-full">
    <label class=" text-gray-700 font-semibold mb-2 mr-4">Travel Mode:</label>
    <span class="text-gray-700 font-medium">DRIVING</span>
  </div>
</template>
  
