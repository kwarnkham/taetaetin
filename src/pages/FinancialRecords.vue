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
      <q-tab name="purchase-list" label="Purchase List" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="purchase-list" id="purchase-list">
        <PurchaseList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import PurchaseList from "src/components/PurchaseList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "purchase-list");
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
  if (tab.value == "purchase-list")
    document.getElementById("purchase-list").style.height =
      document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updatePurchaseListHeight);
onMounted(updatePurchaseListHeight);
</script>
