<template>
  <div class="fit column">
    <q-form
      @submit.prevent="fetchSummery"
      class="row items-center justify-end q-mb-xs q-gutter-x-xs"
    >
      <q-input outlined dense v-model="maxStock" />
      <q-btn icon="search" type="submit" />
    </q-form>
    <q-markup-table
      separator="cell"
      flat
      bordered
      wrap-cells
      class="col overflow-auto"
    >
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Product</th>
          <th class="text-left">Item</th>
          <th class="text-left">Stock</th>
          <th class="text-left">Sale</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, key) in summery" :key="row.feature_id">
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ row.product }}</td>
          <td class="text-left">{{ row.item }}</td>
          <td class="text-left">{{ row.stock }}</td>
          <td class="text-left">{{ row.sales }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";

const maxStock = ref(0);
const summery = ref([]);
const { api } = useUtil();
const fetchSummery = () => {
  api({
    method: "GET",
    url: "products/stock",
    params: {
      max_stock: maxStock.value,
    },
  }).then((response) => {
    summery.value = response.data.data.filter((e) => e.product != "unknown");
  });
};
onMounted(() => {
  fetchSummery();
});
</script>
