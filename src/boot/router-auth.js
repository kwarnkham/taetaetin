import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import { useUserStore } from 'src/stores/user-store'

export default boot(({ router, store }) => {
  router.beforeEach((to, from, next) => {
    const token = LocalStorage.getItem('token')
    const userStore = useUserStore(store)
    const index = userStore.getUser?.roles?.findIndex(role => role.name == to.meta.role);
    if (to.meta.requiresAuth && !token) next({ name: 'index' })
    else if (to.meta.role && index <= -1) next({ name: 'index' })
    else next()
  })
})
