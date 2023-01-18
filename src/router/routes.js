
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
      },
      {
        path: 'products',
        component: () => import('pages/ProductMenu.vue'),
        name: 'products',
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
      },
      {
        path: 'manage-cart',
        component: () => import('src/pages/ManageCart.vue'),
        name: 'manage-cart',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'checkout-cart',
        component: () => import('src/pages/CheckoutCart.vue'),
        name: 'checkout-cart',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'order-menu',
        component: () => import('src/pages/OrderMenu.vue'),
        name: 'order-menu',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'order/:order',
        component: () => import('src/pages/OrderDetails.vue'),
        name: 'order-details',
        meta: {
          requireAuth: true
        }
      },
      {
        path: 'item/:item',
        component: () => import('src/pages/ItemDetails.vue'),
        name: 'item-details',
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
