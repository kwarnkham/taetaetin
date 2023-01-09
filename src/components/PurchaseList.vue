<template>
  <div class="full-height column">
    <div>
      <q-input v-model="search" label="Search" />
    </div>
    <div class="row justify-between items-center">
      <q-input v-model="from" type="date">
        <template v-slot:prepend>
          <span>From</span>
        </template>
      </q-input>
      <q-input v-model="to" type="date">
        <template v-slot:prepend>
          <span>To</span>
        </template>
      </q-input>
      <div>
        <q-btn icon="search" @click="findByDates" />
      </div>
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="purchase in pagination?.data" :key="purchase.id">
        <q-item-section>
          <q-item-label>
            {{ purchase.name || purchase.purchasable.name }}
          </q-item-label>
          <q-item-label caption v-if="purchase.purchasable.item">
            {{ purchase.purchasable.item?.name }}
          </q-item-label>
          <q-item-label>Price: {{ purchase.price }}</q-item-label>
          <q-item-label>Quantity: {{ purchase.quantity }}</q-item-label>
          <q-item-label>
            Type: {{ purchaseType[purchase.purchasable_type] }}
          </q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn
              round
              icon="cancel"
              dense
              @click="cancelPurchase(purchase)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="row justify-center full-width">
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";

const { api } = useUtil();
const { dialog, notify } = useQuasar();
const purchaseType = {
  "App\\Models\\Feature": "Product",
  "App\\Models\\Expense": "Expense",
};
const fetchPurchases = (params = {}) => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "purchases",
      params: params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, search, current, findByDates, from, to } =
  usePagination(fetchPurchases, true);

const cancelPurchase = (purchase) => {
  dialog({
    title: "Confirmation",
    message: "Do you want to cancel?",
    persistent: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `purchases/${purchase.id}/cancel`,
    }).then((response) => {
      const index = pagination.value.data.findIndex((e) => e.id == purchase.id);
      if (index >= 0) pagination.value.data.splice(index, 1);
      notify({
        message: response.data.message,
        type: "positive",
      });
    });
  });
};
</script>
