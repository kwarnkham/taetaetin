import { defineStore } from 'pinia';

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenant: null
  }),

  getters: {
    getTenant (state) {
      return state.tenant
    }
  },

  actions: {
    setTenant (payload) {
      this.tenant = payload
    }
  }
})
