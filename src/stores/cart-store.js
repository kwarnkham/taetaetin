import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';



export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      products: LocalStorage.getItem('products') ?? [],
      discount: 0,
      services: LocalStorage.getItem('services') ?? [],
    }
  }),
  getters: {
    getCart: (state) => state.cart,
  },
  actions: {
    addProduct (payload) {
      const product = JSON.parse(JSON.stringify(payload.product))
      product.quantity = Number(payload.quantity);
      const existed = this.cart.products.findIndex(e => e.id == product.id);
      if (existed == -1) this.cart.products.push(product)
      else this.cart.products[existed].quantity += product.quantity
      LocalStorage.set('products', this.cart.products)
    },
    reduceProduct (payload) {
      const quantity = Number(payload.quantity)
      const product = JSON.parse(JSON.stringify(payload.product))
      const existed = this.cart.products.findIndex(e => e.id == product.id);
      if (existed == -1) return
      else {
        if (this.cart.products[existed].quantity > quantity) this.cart.products[existed].quantity -= quantity
        else this.cart.products.splice(existed, 1)
      }
      LocalStorage.set('products', this.cart.products)
    },
    applyDiscount (value) {
      this.cart.discount = Number(value)
    },
    addService (payload) {
      const service = JSON.parse(JSON.stringify(payload.service))
      service.quantity = Number(payload.quantity);
      const existed = this.cart.services.findIndex(e => e.id == service.id);
      if (existed == -1) this.cart.services.push(service)
      else this.cart.services[existed].quantity += service.quantity
      LocalStorage.set('services', this.cart.services)
    },
    reduceService (payload) {
      const quantity = Number(payload.quantity)
      const service = JSON.parse(JSON.stringify(payload.service))
      const existed = this.cart.services.findIndex(e => e.id == service.id);
      if (existed == -1) return
      else {
        if (this.cart.services[existed].quantity > quantity) this.cart.services[existed].quantity -= quantity
        else this.cart.services.splice(existed, 1)
      }
      LocalStorage.set('services', this.cart.services)
    },
  },
});
