import { useQuasar } from "quasar";
import useUtil from "./util";

export default function useItem () {
  const { api } = useUtil()
  const { dialog } = useQuasar()
  const reStock = (a_item) => {
    return new Promise((resolve, reject) => {
      dialog({
        title: `Purchase price for ${a_item.name}`,
        position: "top",
        cancel: true,
        noBackdropDismiss: true,
        prompt: {
          model: a_item?.latest_purchase?.price || '',
          type: "number",
          inputmode: "numeric",
          pattern: "[0-9]*",
          isValid: (val) => val != '' && val >= 0
        },
      }).onOk((purchasePrice) => {
        dialog({
          title: `Restock quantity for ${a_item.name}`,
          position: "top",
          cancel: true,
          noBackdropDismiss: true,
          prompt: {
            model: "",
            type: "number",
            inputmode: "numeric",
            pattern: "[0-9]*",
            isValid: (val) => val != '' && val > 0
          },
        }).onOk((quantity) => {
          api({
            method: "POST",
            url: `a-items/${a_item.id}/restock`,
            data: {
              quantity,
              price: purchasePrice,
            },
          }).then((response) => {
            resolve(response)
          }).catch(e => {
            reject(e)
          });
        });
      });
    })
  };

  return {
    reStock
  }
}
