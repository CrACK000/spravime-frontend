import { createRouter, createWebHistory } from 'vue-router'
import { logout } from "@/plugins/logout"
import {inject, onBeforeMount} from "vue";

let isAuthChecked = false;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Home.vue'),
      meta: { transition: 'fade' },
    },
    {
      path: '/search',
      name: 'workers',
      component: () => import('@/views/AllWorkers.vue'),
      meta: { transition: 'fade' },
    },
    {
      path: '/offers',
      name: 'offers',
      component: () => import('@/views/AllOffers.vue'),
      meta: { transition: 'fade' },
    },
    {
      path: '/offers/:id',
      name: 'offerDetail',
      component: () => import('@/views/OfferDetails.vue'),
      meta: { transition: 'fade' },
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('@/views/UserProfile.vue'),
      meta: { transition: 'fade' },
    },
    {
      path: '/account',
      component: () => import('@/views/auth/Account.vue'),
      meta: { transition: 'fade', requiresAuth: true },
      children: [
        { path: '', redirect: '/account/dashboard', meta: { transition: 'slide-top' } },
        { path: 'create-offer', name: 'offerAdd', component: () => import('@/views/auth/CreateOfferPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'dashboard', name: 'dashboard', component: () => import('@/views/auth/DashboardPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'messages', name: 'messages', component: () => import('@/views/auth/MessagesPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'offers', name: 'my-offers', component: () => import('@/views/auth/OffersPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'offers/all', name: 'offers-all', component: () => import('@/views/auth/OffersPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'offers/waiting', name: 'offers-waiting', component: () => import('@/views/auth/OffersPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'profile', name: 'my-account', component: () => import('@/views/auth/ProfilePanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'design', name: 'edit-design', component: () => import('@/views/auth/DesignPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'gallery', name: 'user-gallery', component: () => import('@/views/auth/GalleryPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'security', name: 'user-security', component: () => import('@/views/auth/SecurityPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'stats', name: 'user-stats', component: () => import('@/views/auth/StatsPanel.vue'), meta: { transition: 'slide-top' } },
        { path: 'plus', name: 'user-plus', component: () => import('@/views/auth/PlusPanel.vue'), meta: { transition: 'slide-top' } },
        {
          path: 'logout',
          name: 'logout',
          component: { template: '' },
          beforeEnter(to, from, next) {
            logout()
            next({ name: 'home' })
          } },
      ]
    },
    {
      path: '/account/create',
      name: 'register',
      meta: { transition: 'fade', requiresAuth: false },
      component: () => import('@/views/auth/Register.vue')
    },
    {
      path: '/account/login',
      name: 'login',
      meta: { transition: 'fade', requiresAuth: false },
      component: () => import('@/views/auth/Login.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
})

router.beforeEach(async (to, from, next) => {

  const auth = inject<Auth>('auth')

  await auth?.checkAuth()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresUnAuth = to.matched.some(record => record.meta.requiresAuth === false);

  if (requiresAuth && !auth?.loggedIn.value) {
    next({ name: 'login' });
  } else if (requiresUnAuth && auth?.loggedIn.value) {
    next({ name: 'index' });
  } else {
    next();
  }
})

export default router