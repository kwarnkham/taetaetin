
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index',
      },
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
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
        path: 'product/:product',
        component: () => import('pages/ProductDetails.vue'),
        name: 'product-details',
      },
      {
        path: 'financial-records',
        component: () => import('src/pages/FinancialRecords.vue'),
        name: 'financial-records',
        meta: {
          requireAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'set-up',
        component: () => import('src/pages/SetUp.vue'),
        name: 'set-up',
        meta: {
          requireAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'manage-cart',
        component: () => import('src/pages/ManageCart.vue'),
        name: 'manage-cart',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'checkout-cart',
        component: () => import('src/pages/CheckoutCart.vue'),
        name: 'checkout-cart',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'sale',
        component: () => import('src/pages/SalePage.vue'),
        name: 'sale',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'order-menu',
        component: () => import('src/pages/OrderMenu.vue'),
        name: 'order-menu',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'order/:order',
        component: () => import('src/pages/OrderDetails.vue'),
        name: 'order-details',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'users',
        component: () => import('src/pages/UserMenu.vue'),
        name: 'users',
        meta: {
          requireAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'item/:item',
        component: () => import('src/pages/ItemDetails.vue'),
        name: 'item-details',
      },
      {
        path: 'change-password',
        component: () => import('src/pages/ChangePassword.vue'),
        name: 'change-password',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'printer-setting',
        component: () => import('src/pages/PrinterSetting.vue'),
        name: 'printer-setting',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
      {
        path: 'payments',
        component: () => import('src/pages/PaymentsPage.vue'),
        name: 'payments',
        meta: {
          requireAuth: true,
          role: 'sale'
        }
      },
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
