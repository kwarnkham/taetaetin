import { useQuasar } from "quasar"
import { api as axios } from "boot/axios";

export default function useApp () {
  const { loading, localStorage } = useQuasar()
  return {
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
            url: "settings/1",
          }),
          axios({
            method: "GET",
            url: "roles",
          })
        ]);
        localStorage.set("paymentTypes", values[0].data.payment_types);
        localStorage.set("orderStatuses", values[1].data.statuses);
        localStorage.set("payments", values[2].data.data.data);
        localStorage.set("setting", values[3].data.setting);
        localStorage.set("roles", values[4].data.roles);
        loading.hide()
        return true;
      } catch (error) {
        console.error(error)
        alert(error.response.data.message)
        loading.hide()
        return false;
      }
    }
  }
}
