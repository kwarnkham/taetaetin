<template>
  <q-page padding class="column">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="create-product" label="Create Product" no-caps />
      <q-tab name="product-list" label="Product List" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="create-product"> </q-tab-panel>

      <q-tab-panel name="product-list" id="product-list">
        <ProductList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ProductList from "src/components/ProductList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "create-product");
const router = useRouter();

watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      tab: tab.value,
    },
  });
});
const updateItemListHeight = () => {
  if (tab.value == "product-list") {
    document.getElementById("product-list").style.height =
      document.querySelector(".q-tab-panels").clientHeight + "px";
  }
};
onUpdated(updateItemListHeight);
onMounted(updateItemListHeight);
</script>
