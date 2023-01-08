
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index'
      },
      {
        path: 'items',
        component: () => import('pages/ItemMenu.vue'),
        name: 'items',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'products',
        component: () => import('pages/ProductMenu.vue'),
        name: 'products',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'financial-records',
        component: () => import('src/pages/FinancialRecords.vue'),
        name: 'financial-records',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'set-up',
        component: () => import('src/pages/SetUp.vue'),
        name: 'set-up',
        meta: {
          requireAuth: true
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
