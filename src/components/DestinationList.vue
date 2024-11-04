<script setup>
import { ref, watch } from "vue";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import debounce from "lodash/debounce";

// Define props and emit
const props = defineProps({
  destinations: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["update:destinations"]);

// Local copy of destinations to track reordering
const localDestinations = ref([...props.destinations]);

// Watch `props.destinations` for changes and synchronize `localDestinations` only if the list changes
watch(
  () => props.destinations,
  (newDestinations) => {
    // Synchronize `localDestinations` only if there is an actual change in content
    if (JSON.stringify(newDestinations) !== JSON.stringify(localDestinations.value)) {
      localDestinations.value = newDestinations.map((dest) => ({ ...dest }));
    }
  },
  { deep: true, immediate: true }
);

// Initialize drag-and-drop on `localDestinations`
const [parent, locations] = useDragAndDrop(localDestinations);

// Debounce the onReorder function to prevent rapid recursive updates
const onReorder = debounce(() => {
  const reorderedList = locations.value.map((location) => ({ ...location }));
  emit("update:destinations", reorderedList);
}, 300); // Wait 300ms before emitting, adjust as needed

const deleteDestination = (index) => {
  localDestinations.value.splice(index, 1); // Remove the destination
  localStorage.setItem('destinations', JSON.stringify(localDestinations.value)); // Update local storage
  emit("update:destinations", localDestinations.value); // Emit the updated list
};

// Watch `localDestinations` for changes to update local storage
watch(
  localDestinations,
  (newDestinations) => {
    localStorage.setItem('destinations', JSON.stringify(newDestinations)); // Sync to local storage
    emit("update:destinations", newDestinations); // Emit the updated list
  },
  { deep: true }
);

// Watch `locations` for changes and call `onReorder` after drag-and-drop completes
watch(locations, onReorder, { deep: true });
</script>

<template>
  <ul ref="parent" class="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-lg mx-auto max-w-full sm:max-w-md lg:max-w-lg">
    <li
      v-for="(location, index) in locations"
      :key="location.name"
      class="cursor-pointer bg-white border border-gray-200 my-2 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-10 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <span class="text-gray-700 font-medium">{{ location.name }}</span>
      <button
        @click="deleteDestination(index)"
        class="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 focus:outline-none transition-colors duration-150"
      >
        Remove
      </button>
    </li>
  </ul>
</template>

