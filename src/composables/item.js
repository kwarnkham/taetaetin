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

  const showCreateAItem = (name) => {
    return new Promise((resolve) => {
      dialog({
        title: "Choose item type",
        options: {
          type: "radio",
          model: "1",
          items: [
            { label: "Stocked", value: "1" },
            { label: "Non Stocked", value: "2" },
          ],
        },
      }).onOk((type) => {
        dialog({
          title: `What is the sale price for ${name}?`,
          message: "After this you'll be asked to fill stock quantity",
          position: "top",
          noBackdropDismiss: true,
          cancel: true,
          prompt: {
            model: "",
            placeholder: "Sale Price",
            type: "number",
            inputmode: "numeric",
            pattern: "[0-9]*",
            isValid: (val) => val != "" && val >= 0,
          },
        }).onOk((salePrice) => {
          if (type == "1")
            dialog({
              title: `What is the purchase price for ${name}?`,
              message: "After this you'll be asked to fill sale price",
              position: "top",
              noBackdropDismiss: true,
              cancel: true,
              prompt: {
                model: "",
                placeholder: "Purchase Price",
                type: "number",
                inputmode: "numeric",
                pattern: "[0-9]*",
                isValid: (val) => val != "" && val >= 0,
              },
            }).onOk((purchasePrice) => {
              dialog({
                title: `How many of ${name} is going to inventory?`,
                position: "top",
                noBackdropDismiss: true,
                cancel: true,
                prompt: {
                  model: "",
                  placeholder: "Quantity",
                  type: "number",
                  inputmode: "numeric",
                  pattern: "[0-9]*",
                  isValid: (val) => val != "" && val > 0,
                },
              }).onOk((quantity) => {
                const data = {
                  name,
                  purchase_price: purchasePrice,
                  price: salePrice,
                  stock: quantity,
                  type,
                };
                resolve(data)
              });
            });
          else
            resolve({
              name,
              purchase_price: 0,
              price: salePrice,
              stock: 0,
              type,
            })
        });
      });
    })

  };

  const submitItem = (data) => {
    return new Promise((resolve, reject) => {
      api(
        {
          method: "POST",
          url: "a-items",
          data,
        },
        true
      ).then((response) => {
        resolve(response.data.a_item)
      }).catch((e) => {
        reject(e)
      });
    })

  };

  return {
    reStock,
    showCreateAItem,
    submitItem
  }
}
