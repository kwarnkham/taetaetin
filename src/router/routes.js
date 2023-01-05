
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
        path: 'item',
        component: () => import('pages/ItemMenu.vue'),
        name: 'item'
      },
      {
        path: 'item/create',
        component: () => import('pages/CreateItem.vue'),
        name: 'item.create'
      },
      {
        path: 'item/index',
        component: () => import('pages/ItemList.vue'),
        name: 'item.index'
      },
      {
        path: 'product',
        component: () => import('pages/ProductMenu.vue'),
        name: 'product'
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
