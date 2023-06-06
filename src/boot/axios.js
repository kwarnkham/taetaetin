import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { useTenantStore } from 'src/stores/tenant-store'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.API_URL })


export default boot(async ({ app, store }) => {
  const userStore = useUserStore(store)
  const tenantStore = useTenantStore(store)
  const token = LocalStorage.getItem("token");
  const tenantSpace = LocalStorage.getItem("tenantSpace");
  if (token) {
    api.defaults.headers.common['Authorization'] = "Bearer " + token;
    api.defaults.headers.common['Tenant'] = tenantSpace;
    try {
      const response = await api({
        method: "GET",
        url: "users/user",
      })
      userStore.setUser(response.data.user)
      tenantStore.setTenant(response.data.tenant)
    } catch (error) {
      LocalStorage.remove('token')
      api.defaults.headers.common['Authorization'] = undefined;
    }
  }

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
