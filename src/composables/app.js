import { useQuasar } from "quasar"
import { api as axios } from "boot/axios";

export default function useApp () {
  const { loading, localStorage } = useQuasar()
  return {
    sumArray (array, key) {
      return array.reduce((carry, el) => el[key] + carry, 0)
    },
    getTotalAmount (array, price, quantity) {
      return array.reduce((carry, el) => (el[price] - (el.discount ?? 0)) * el[quantity] + carry, 0)
    },
    async init () {
      loading.show()
      try {
        const values = await Promise.all([
          axios({
            method: "GET",
            url: "payment-types",
          }),
          axios({
            method: "GET",
            url: "orders/status",
          }),
          axios({
            method: "GET",
            url: "payments",
          }),
          axios({
            method: "GET",
            url: "settings",
          })
        ]);
        localStorage.set("paymentTypes", values[0].data.payment_types);
        localStorage.set("orderStatus", values[1].data.status);
        localStorage.set("payments", values[2].data.data.data);
        localStorage.set("settings", values[3].data);
        loading.hide()
        return true;
      } catch (error) {
        console.error(error)
        loading.hide()
        return false;
      }
    }
  }
}
