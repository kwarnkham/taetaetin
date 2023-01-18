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
      <q-tab name="order-list" label="Order List" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="order-list" id="order-list">
        <OrderList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import OrderList from "src/components/OrderList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "order-list");
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
  document.getElementById(tab.value).style.height =
    document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updateItemListHeight);
onMounted(updateItemListHeight);
</script>
