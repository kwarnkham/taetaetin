<template>
  <q-page padding>
    <div class="text-center text-h5">သေးသေးတင်မှ ကြိုဆိုပါတယ်</div>
    <div class="text-right">
      <div>Orders : {{ orders.toLocaleString() }}</div>
      <div>Purchases : {{ purchases.toLocaleString() }}</div>
      <div>Total : {{ (orders - purchases).toLocaleString() }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { date } from "quasar";
import usePagination from "src/composables/pagination";

const { formatDate } = date;

const from = formatDate(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  "YYYY-MM-DD"
);
const to = formatDate(
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  "YYYY-MM-DD"
);
const { total: orders } = usePagination("orders", {
  per_page: 1,
  status: 5,
  from,
  to,
});
const { total: purchases } = usePagination("purchases", {
  per_page: 1,
  status: 1,
  from,
  to,
});
</script>
