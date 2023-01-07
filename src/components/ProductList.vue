<template>
  <div class="full-height column">
    <div class="row justify-between">
      <q-input v-model="search" label="Search" class="col" />
      <q-checkbox left-label v-model="onlyStocked" label="Only stocked" />
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="product in pagination?.data" :key="product.id">
        <q-item-section>
          <q-item-label>
            {{ product.name }}
            <q-badge align="top">{{ product.stock }}</q-badge>
          </q-item-label>
          <q-item-label caption>{{ product.item.name }}</q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="add" dense @click="showRestockDialog(product)" />
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
import RestockDialog from "src/components/dialogs/RestockDialog.vue";
import usePagination from "src/composables/pagination";

const { api } = useUtil();
const { dialog } = useQuasar();

const fetchProducts = (params) => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "features",
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

const { pagination, max, search, current, onlyStocked } =
  usePagination(fetchProducts);

const showRestockDialog = (product) => {
  dialog({
    component: RestockDialog,
    componentProps: {
      product,
    },
  }).onOk((feature) => {
    const index = pagination.value.data.findIndex((e) => e.id == feature.id);
    if (index >= 0) pagination.value.data.splice(index, 1, feature);
  });
};
</script>
