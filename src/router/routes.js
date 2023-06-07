const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        title: 'Home',
        icon: 'home',
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'index',
        meta: {
          navigation: true,
          translateKey: 'home'
        }
      },

      {
        title: 'Products',
        icon: 'inventory_2',
        path: 'products',
        component: () => import('pages/ItemMenu.vue'),
        name: 'products',
        meta: {
          navigation: true,
          translateKey: 'product'

        }
      },
      {
        title: 'Purchases',
        icon: "price_change",
        path: 'purchases',
        component: () => import('src/pages/PurchasePage.vue'),
        name: 'purchases',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: true,
          translateKey: 'purchase'
        }
      },
      {
        title: 'Absences',
        path: 'absences/:user',
        component: () => import('src/pages/AbsencesPage.vue'),
        name: 'absences',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: false,
        }
      },
      {
        title: 'Overtime',
        path: 'overtimes/:user',
        component: () => import('src/pages/OvertimesPage.vue'),
        name: 'overtimes',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: false
        }
      },
      {
        title: 'Task Details',
        icon: 'task',
        path: 'tasks/:task',
        component: () => import('src/pages/TaskDetails.vue'),
        name: 'task-details',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: false
        }
      },
      {
        title: 'Expenses',
        icon: "request_quote",
        path: 'expenses',
        component: () => import('src/pages/ExpensePage.vue'),
        name: 'expenses',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: true,
          translateKey: 'expense'
        }
      },
      {
        title: 'Sale',
        icon: 'point_of_sale',
        path: 'sale',
        component: () => import('src/pages/SalePage.vue'),
        name: 'sale',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: true,
          translateKey: 'sale'
        }
      },
      {
        title: 'Orders',
        icon: "shopping_basket",
        path: 'order-menu',
        component: () => import('src/pages/OrderMenu.vue'),
        name: 'order-menu',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: true,
          translateKey: 'order'

        }
      },
      {
        title: 'Order Setting',
        path: 'order-setting',
        component: () => import('src/pages/OrderSetting.vue'),
        name: 'order-setting',
        meta: {
          requiresAuth: true,
          role: 'admin',
        }
      },
      {
        title: 'Users',
        icon: 'group',
        path: 'users',
        component: () => import('src/pages/UserMenu.vue'),
        name: 'users',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: true,
          translateKey: 'user'
        }
      },
      {
        path: 'item/:item',
        component: () => import('src/pages/ItemDetails.vue'),
        name: 'item-details',
      },
      {
        title: 'Change Password',
        icon: "lock",
        path: 'change-password',
        component: () => import('src/pages/ChangePassword.vue'),
        name: 'change-password',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: false
        }
      },
      {
        title: 'Printer Setting',
        icon: 'print',
        path: 'printer-setting',
        component: () => import('src/pages/PrinterSetting.vue'),
        name: 'printer-setting',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: false
        }
      },
      {
        title: 'Payments',
        icon: 'attach_money',
        path: 'payments',
        component: () => import('src/pages/PaymentsPage.vue'),
        name: 'payments',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: true,
          translateKey: 'payment'
        }
      },
      {
        title: 'Tasks',
        icon: 'task',
        path: 'tasks',
        component: () => import('src/pages/TasksPage.vue'),
        name: 'tasks',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: true,
          translateKey: 'task'
        }
      },
      {
        title: 'Tenants',
        icon: 'manage_accounts',
        path: 'tenants',
        component: () => import('src/pages/TenantsPage.vue'),
        name: 'tenants',
        meta: {
          requiresAuth: true,
          role: 'admin',
          navigation: true,
          owner: true,
          translateKey: 'tenant'
        }
      },
      {
        title: 'Settings',
        icon: 'settings',
        path: 'settings',
        component: () => import('src/pages/SettingPage.vue'),
        name: 'settings',
        meta: {
          requiresAuth: true,
          role: 'sale',
          navigation: true,
          translateKey: 'setting'
        }
      },
      {
        title: 'Login',
        icon: 'login',
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
        meta: {
          navigation: true,
          translateKey: 'login'
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
