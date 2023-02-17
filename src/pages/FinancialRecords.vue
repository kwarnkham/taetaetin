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
      <q-tab name="purchase" label="Purchase" no-caps />
      <q-tab name="order" label="Order" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="purchase" id="purchase">
        <PurchaseList has-date-filter @vnode-mounted="updateItemListHeight" />
      </q-tab-panel>
      <q-tab-panel name="order" id="order">
        <OrderList
          has-date-filter
          :status="5"
          @vnode-mounted="updateItemListHeight"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import OrderList from "src/components/OrderList.vue";
import PurchaseList from "src/components/PurchaseList.vue";
import useTabPanels from "src/composables/tabPanels";

const { tab, updateItemListHeight } = useTabPanels("purchase");
</script>
