// Composables
import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Data from '@/store/modules/data'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '/',
        name: 'pages.home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/inbounds',
        name: 'pages.inbounds',
        component: () => import('@/views/Inbounds.vue'),
      },
      {
        path: '/clients',
        name: 'pages.clients',
        component: () => import('@/views/Clients.vue'),
      },  
      {
        path: '/outbounds',
        name: 'pages.outbounds',
        component: () => import('@/views/Outbounds.vue'),
      },
      {
        path: '/endpoints',
        name: 'pages.endpoints',
        component: () => import('@/views/Endpoints.vue'),
      },
      {
        path: '/rules',
        name: 'pages.rules',
        component: () => import('@/views/Rules.vue'),
      },
      {
        path: '/tls',
        name: 'pages.tls',
        component: () => import('@/views/Tls.vue'),
      },
      {
        path: '/basics',
        name: 'pages.basics',
        component: () => import('@/views/Basics.vue'),
      },
      {
        path: '/settings',
        name: 'pages.settings',
        component: () => import('@/views/Settings.vue'),
      },
      {
        path: '/exportconfig',
        name: 'pages.exportconfig',
        component: () => import('@/views/ExportConfig.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory((window as any).BASE_URL),
  routes,
})

const DEFAULT_TITLE = 'Sing-Box Config UI'

// Load data initially
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Load default data on navigation
  const store = Data()
  store.loadData()
  
  // Ensure config is fully synced after a short delay (to allow loadData to complete)
  setTimeout(() => {
    store.syncFullConfig()
  }, 100)
  
  next()
})

export default router
