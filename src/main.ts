import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import TheMainView from '@/components/TheMainView.vue';
import TheTester from '@/components/TheTester.vue';
import * as VueRouter from 'vue-router';

const routes = [
  { path: '/', component: TheMainView },
  { path: '/test', component: TheTester },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

createApp(App).use(store).use(router).use(VueToast).mount('#app');
