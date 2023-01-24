<template>
  <q-page padding>
    <q-form @submit.prevent="submit">
      <q-input
        v-model="formData.customer"
        label="Customer"
        :required="isPreorder"
      />
      <q-input
        v-model="formData.phone"
        label="Phone"
        type="tel"
        :required="isPreorder"
      />
      <q-input
        v-model="formData.address"
        label="Address"
        :required="isPreorder"
      />
      <q-input v-model="formData.note" label="Note" />
      <div class="text-right">
        <q-btn label="Make order" no-caps type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const { localStorage, notify } = useQuasar();
const { api, pickBy } = useUtil();
const cartStore = useCartStore();
const router = useRouter();
const isPreorder = ref(localStorage.getItem("isPreorder") ?? false);
const formData = ref({
  customer: "",
  phone: "",
  address: "",
  note: "",
  products: localStorage.getItem("products") ?? [],
  discount: localStorage.getItem("discount") ?? "",
  services: localStorage.getItem("services") ?? [],
});
const submit = () => {
  if (
    formData.value.products.length <= 0 &&
    formData.value.services.length <= 0
  ) {
    notify({
      message: "No services or products in the cart",
      type: "warning",
    });
    return;
  }
  let url;
  if (isPreorder.value) {
    url = "orders/pre-order";
    formData.value.items = formData.value.products.map((product) => ({
      id: product.id,
      price: product.price,
      quantity: product.quantity,
    }));
  } else {
    url = "orders";
  }

  api({
    method: "POST",
    url,
    data: pickBy(formData.value),
  }).then((response) => {
    cartStore.clear();
    router.replace({
      name: "order-details",
      params: {
        order: response.data.order.id,
      },
    });
  });
};
</script>
