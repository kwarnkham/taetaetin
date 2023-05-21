import { useQuasar } from "quasar";
import useUtil from "./util";

export default function usePurchase () {
  const { dialog } = useQuasar()
  const { api } = useUtil()
  const cancelPurchase = (purchase) => {
    return new Promise((resolve, reject) => {
      dialog({
        title: "Confirmation",
        message: "Do you want to cancel?",
        noBackdropDismiss: true,
        cancel: true,
      }).onOk(() => {
        api({
          method: "POST",
          url: `purchases/${purchase.id}/cancel`,
        }).then((response) => {
          resolve(response.data.purchase)
        }).catch(e => {
          reject(e)
        });
      });
    })

  };
  return {
    cancelPurchase
  }
}
