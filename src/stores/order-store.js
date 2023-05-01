import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order-store', {
  state: () => ({
    existedItems: [],
    existedOrder: null
  }),
  getters: {
    getExistedItems: (state) => state.existedItems,
    getExistedOrder: (state) => state.existedOrder,
  },
  actions: {
    setExistedItems (payload) {
      this.existedItems = payload;
    },
    setExistedOrder (payload) {
      this.existedOrder = payload;
    },
  },
});
