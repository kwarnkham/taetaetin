<template>
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
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["submitted"]);
const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    required: false,
  },
});
const { localStorage, notify } = useQuasar();
const { api, pickBy } = useUtil();
const cartStore = useCartStore();
const router = useRouter();
const isPreorder = ref(localStorage.getItem("isPreorder") ?? false);
const formData = ref({
  customer: props.order?.customer ?? "",
  phone: props.order?.phone ?? "",
  address: props.order?.address ?? "",
  note: props.order?.note ?? "",
  features: localStorage.getItem("products") ?? [],
  discount: localStorage.getItem("discount") ?? "",
  services: localStorage.getItem("services") ?? [],
});
const submit = () => {
  if (
    formData.value.features.length <= 0 &&
    formData.value.services.length <= 0 &&
    !props.update
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
    formData.value.items = formData.value.features.map((product) => ({
      id: product.id,
      price: product.price,
      quantity: product.quantity,
    }));
  } else {
    url = "orders";
  }
  let options = {
    method: "POST",
    url,
    data: pickBy(formData.value),
  };
  if (props.update && props.order) {
    options.method = "PUT";
    options.url = `orders/${props.order.id}/customer`;
  }

  api(options).then((response) => {
    emit("submitted", response.data.order);
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
