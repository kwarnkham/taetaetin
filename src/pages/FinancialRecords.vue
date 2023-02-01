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
        <PurchaseList has-date-filter />
      </q-tab-panel>
      <q-tab-panel name="order" id="order">
        <OrderList has-date-filter :status="5" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import OrderList from "src/components/OrderList.vue";
import PurchaseList from "src/components/PurchaseList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "purchase");
const router = useRouter();

watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      tab: tab.value,
    },
  });
});
const updatePurchaseListHeight = () => {
  document.getElementById(tab.value).style.height =
    document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updatePurchaseListHeight);
onMounted(updatePurchaseListHeight);
</script>
