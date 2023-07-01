import { useQuasar } from "quasar";
import useUtil from "./util";
import { useI18n } from "vue-i18n";

export default function useItem () {
  const { api } = useUtil()
  const { dialog } = useQuasar()
  const { t } = useI18n()
  const reStock = (a_item) => {
    return new Promise((resolve, reject) => {
      dialog({
        title: `${t('purchasePrice')} (${a_item.name})`,
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
          title: `${t('restockQuantity')}  (${a_item.name})`,
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

  const showCreateAItem = (name, type = '1') => {
    return new Promise((resolve) => {
      dialog({
        title: `${t('salePrice')} (${name})`,
        position: 'top',
        noBackdropDismiss: true,
        cancel: true,
        prompt: {
          model: "",
          placeholder: t('salePrice'),
          type: "number",
          inputmode: "numeric",
          pattern: "[0-9]*",
          isValid: (val) => val != "" && val >= 0,
        },
      }).onOk((salePrice) => {
        if (type == "1")
          dialog({
            title: `${t('purchasePrice')} (${name})`,
            position: "top",
            noBackdropDismiss: true,
            cancel: true,
            prompt: {
              model: "",
              placeholder: t('purchasePrice'),
              type: "number",
              inputmode: "numeric",
              pattern: "[0-9]*",
              isValid: (val) => val != "" && val >= 0,
            },
          }).onOk((purchasePrice) => {
            dialog({
              title: `${t('restockQuantity')} (${name})`,
              position: "top",
              noBackdropDismiss: true,
              cancel: true,
              prompt: {
                model: "",
                placeholder: t('quantity'),
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
