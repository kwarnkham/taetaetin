<template>
  <q-page padding>
    <q-markup-table separator="cell" flat bordered wrap-cells>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Item</th>
          <th class="text-right">Price</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Amount</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(product, key) in cartStore.getCart.products"
          :key="product.id"
        >
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">{{ product.price.toLocaleString() }}</td>
          <td class="text-right">{{ product.quantity }}</td>
          <td class="text-right">
            {{ (product.price * product.quantity).toLocaleString() }}
          </td>
          <td class="text-center q-gutter-x-sm">
            <q-btn round icon="add" @click="increaseCartQuantity(product)" />
            <q-btn round icon="remove" @click="decreaseCartQuantity(product)" />
            <q-btn
              round
              icon="delete_forever"
              @click="removeFromCart(product)"
            />
          </td>
        </tr>
        <tr
          v-for="(service, key) in cartStore.getCart.services"
          :key="service.id"
        >
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ service.name }}</td>
          <td class="text-right">{{ service.price.toLocaleString() }}</td>
          <td class="text-right">{{ service.quantity }}</td>
          <td class="text-right">
            {{ (service.price * service.quantity).toLocaleString() }}
          </td>
          <td class="text-center q-gutter-x-sm">
            <q-btn
              round
              icon="add"
              @click="cartStore.addService({ service, quantity: 1 })"
            />
            <q-btn
              round
              icon="remove"
              @click="cartStore.reduceService({ service, quantity: 1 })"
            />
            <q-btn
              round
              icon="delete_forever"
              @click="
                cartStore.reduceService({ service, quantity: service.quantity })
              "
            />
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Total</td>
          <td class="text-right">
            {{
              getTotal(cartStore.getCart.products, "quantity") +
              getTotal(cartStore.getCart.services, "quantity")
            }}
          </td>

          <td class="text-right">
            {{
              (
                getTotalAmount(
                  cartStore.getCart.products,
                  "price",
                  "quantity"
                ) +
                getTotalAmount(cartStore.getCart.services, "price", "quantity")
              ).toLocaleString()
            }}
          </td>
          <td class="text-center">Action</td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Discount</td>
          <td class="text-right">
            {{ cartStore.getCart.discount.toLocaleString() }}
          </td>
          <td class="text-center">
            <q-btn
              label="Add Discount"
              dense
              no-caps
              flat
              @click="addDiscount"
              color="info"
            />
          </td>
        </tr>
        <tr
          :class="{
            'text-negative':
              getTotalAmount(cartStore.getCart.products, 'quantity', 'price') +
                getTotalAmount(
                  cartStore.getCart.services,
                  'quantity',
                  'price'
                ) -
                cartStore.getCart.discount <
              0,
          }"
        >
          <td colspan="3"></td>
          <td class="text-right">Amount</td>

          <td class="text-right">
            {{
              (
                getTotalAmount(
                  cartStore.getCart.products,
                  "quantity",
                  "price"
                ) +
                getTotalAmount(
                  cartStore.getCart.services,
                  "quantity",
                  "price"
                ) -
                cartStore.getCart.discount
              ).toLocaleString()
            }}
          </td>
          <td class="text-center">
            <q-btn
              label="Clear"
              flat
              no-caps
              color="accent"
              @click="clearCart"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-separator spaced />
    <q-toggle v-model="serviceShowed" label="Service" />
    <ManageServiceForCart
      v-if="serviceShowed"
      @service-added="addServiceToCart"
    />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useCartStore } from "src/stores/cart-store";
import useUtil from "src/composables/util";
import ManageServiceForCart from "components/ManageServiceForCart.vue";
import { ref } from "vue";

const cartStore = useCartStore();
const { notify, dialog } = useQuasar();
const { getTotalAmount, getTotal } = useUtil();
const serviceShowed = ref(false);

const increaseCartQuantity = (product) => {
  if (product.stock > product.quantity)
    cartStore.addProduct({ product, quantity: 1 });
  else
    notify({
      message: "No enough stock",
      type: "warning",
    });
};

const removeFromCart = (product) => {
  dialog({
    persistent: true,
    cancel: true,
    title: "Remove the product from cart?",
  }).onOk(() => {
    cartStore.reduceProduct({ product, quantity: product.quantity });
  });
};

const clearCart = () => {
  dialog({
    title: "Confirm",
    message: "Do you want to clear cart?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    cartStore.clear();
  });
};

const addDiscount = () => {
  dialog({
    title: "Add discount for this order",
    persistent: true,
    cancel: true,
    prompt: {
      model: cartStore.getCart.discount,
      type: "tel",
      isValid: (val) => val >= 0,
    },
  }).onOk((value) => {
    cartStore.applyDiscount(value);
  });
};

const decreaseCartQuantity = (product) => {
  if (product.quantity == 1)
    dialog({
      persistent: true,
      cancel: true,
      title: "Remove the product from cart?",
    }).onOk(() => {
      cartStore.reduceProduct({ product, quantity: 1 });
    });
  else cartStore.reduceProduct({ product, quantity: 1 });
};

const addServiceToCart = (payload) => {
  cartStore.addService(payload);
};
</script>

<style lang="scss" scoped>
tr:first-child {
  width: 2em;
}
</style>
