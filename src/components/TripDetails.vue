<script setup>
const props = defineProps(["journeyData"]);

// Helper function to format duration from seconds to hh:mm:ss
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const formatted = `${hours}h ${minutes}m`;
    return formatted;
};
</script>

<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md w-full space-y-6 md:p-8 w-full mx-auto">
    <div>
      <h2 class="text-2xl font-bold text-gray-700 mb-4">Journey Summary</h2>
      <div v-for="(leg, index) in journeyData.segments" :key="index" class="journey-segment p-4 border-b border-gray-200">
        <div class="text-lg space-y-1">
          <p>
            <span class="font-semibold text-yellow-500">FROM</span> {{ leg.origin.name }}
          </p>
          <p>
            <span class="font-semibold text-green-500">TO</span> {{ leg.destination.name }}
          </p>
        </div>
        <p class="text-gray-600">Distance: <span class="font-medium">{{ leg.distance }}</span></p>
        <p class="text-gray-600">Duration: <span class="font-medium">{{ leg.duration }}</span></p>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-gray-700 mb-4">Total Journey Summary</h2>
      <p class="text-lg">Total Distance: <span class="font-semibold">{{ journeyData.totalDistance / 1000 }} km</span></p>
      <p class="text-lg">Total Duration: <span class="font-semibold">{{ formatDuration(journeyData.totalTime) }}</span></p>
      <p class="text-lg">Fuel Needed: <span class="font-semibold">{{ journeyData.fuelNeeded }} liters</span></p>
    </div>
  </div>
</template>

