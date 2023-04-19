import { useQuasar } from "quasar";
import { useCartStore } from "src/stores/cart-store";

export default function useCart () {
  const { dialog, notify } = useQuasar()
  const cartStore = useCartStore()
  const showAddProductToCart = (product) => {
    dialog({
      title: "Quantity",
      prompt: {
        model: "1",
        type: "number",
        mode: "numeric",
        pattern: "[0-9]*"
      },
      cancel: true,
      noBackdropDismiss: true,
      position: "top",
    }).onOk((quantity) => {
      quantity = Number(quantity);
      if (
        (cartStore.getCart.products.find((e) => e.id == product.id)?.quantity ??
          0) +
        quantity >
        product.stock
      ) {
        notify({
          message: "No enough stock",
          type: "warning",
        });
        return;
      }

      cartStore.addProduct({ product, quantity });
      notify({
        message: "Added to cart",
        type: "positive",
      });
    });
  };

  return {
    showAddProductToCart
  }
}
