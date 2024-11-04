import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Destinations from '../views/DestinationsView.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/destinations', component: Destinations },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
