import { useQuasar } from "quasar";
import useUtil from "./util";

export default function useOrder (order) {
  const { api } = useUtil()
  const { dialog } = useQuasar()
  const saveOrder = async (update = false, status = undefined) => {
    return new Promise((resolve, reject) => {
      const url = update ? `orders/record/${order.value.id}` : "orders/record"
      api(
        {
          method: "POST",
          url,
          data: {
            customer: order.value.customer,
            phone: order.value.phone,
            address: order.value.address,
            note: order.value.note,
            created_at: order.value.created_at,
            discount: order.value.discount,
            paid: order.value.paid,
            a_items: order.value.a_items.filter((e) => !!e),
            status
          },
        },
        true
      ).then((response) => {
        resolve(response)
      }).catch(e => {
        reject(e)
      });
    })

  };
  const syncOrder = (key, value) => {
    order.value[key] = value;
    if (key == 'a_items' && order.value.a_items.filter(e => !e).length == 0) {
      order.value.a_items.push(null)
    }
  };

  const clearData = (value = null) => {
    dialog({
      title: "Confirm",
      message: "Reset all order data",
      cancel: true,
      noBackdropDismiss: true,
    }).onOk(() => {
      resetData(value)
    });
  };

  const resetData = (value = null) => {
    if (value) {
      order.value = value;
      order.value.created_at = new Date(value.created_at).toJSON().slice(0, 10);
      order.value.a_items = value.a_items.map((a_item) => ({
        ...a_item,
        quantity: a_item.pivot.quantity,
        price: a_item.pivot.price,
        name: a_item.pivot.name,
        discount: a_item.pivot.discount,
      }));
      order.value.a_items.push(null);
    }
    else
      Object.keys(order.value).forEach((key) => {
        if (key == "created_at")
          order.value[key] = new Date().toJSON().slice(0, 10);
        else if (key == "a_items") order.value[key] = new Array(10);
        else if (["discount", "paid"].includes(key)) order.value[key] = 0;
        else order.value[key] = "";
      });
  }


  return {
    saveOrder,
    clearData,
    syncOrder,
    resetData
  }
}