<template>
  <q-page padding class="bg-white">
    <div class="row q-my-xs q-gutter-x-xs">
      <q-btn icon="save" @click="submit()" outline />
      <q-btn icon="cleaning_services" @click="clearData()" outline />
    </div>
    <q-separator spaced />
    <div>
      <CustomerInfo v-bind="order" @dataUpdated="syncOrder" />
      <OrderSaleItems class="q-mt-xs" v-bind="order" @dataUpdated="syncOrder" />
    </div>
  </q-page>
</template>

<script setup>
import CustomerInfo from "src/components/CustomerInfo.vue";
import OrderSaleItems from "src/components/OrderSaleItems.vue";
import useOrder from "src/composables/order";
import { ref } from "vue";

const order = ref({
  phone: "",
  created_at: new Date().toJSON().slice(0, 10),
  customer: "",
  address: "",
  note: "",
  paid: 0,
  discount: 0,
  a_items: new Array(10),
});

const { saveOrder, clearData, syncOrder, resetData, showOrderDetails } =
  useOrder(order);

const submit = () => {
  saveOrder().then((response) => {
    resetData();
    showOrderDetails(response.data.order);
  });
};
</script>
