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
        <ProductList @vnode-mounted="updateItemListHeight" />
      </q-tab-panel>
      <q-tab-panel name="stock-summery" id="stock-summery">
        <ProductStockSummery @vnode-mounted="updateItemListHeight" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ProductList from "src/components/ProductList.vue";
import ProductStockSummery from "src/components/ProductStockSummery.vue";
import useTabPanels from "src/composables/tabPanels";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { tab, updateItemListHeight } = useTabPanels("product-list");
</script>
