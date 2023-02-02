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
      <q-tab name="product-list" label="Product List" no-caps />
      <q-tab
        name="stock-summery"
        label="Stock summery"
        no-caps
        v-if="
          userStore.getUser &&
          userStore.getUser.roles.map((e) => e.name).includes('admin')
        "
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="product-list" id="product-list">
        <ProductList />
      </q-tab-panel>
      <q-tab-panel name="stock-summery" id="stock-summery">
        <ProductStockSummery />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ProductList from "src/components/ProductList.vue";
import ProductStockSummery from "src/components/ProductStockSummery.vue";
import { useUserStore } from "src/stores/user-store";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "product-list");
const router = useRouter();
const userStore = useUserStore();

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
