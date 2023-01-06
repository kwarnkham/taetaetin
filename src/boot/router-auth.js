import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(({ router, store }) => {
  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('token')
    if (to.meta.requireAuth && !token) next({ name: 'index' })
    else next()
  })
})
