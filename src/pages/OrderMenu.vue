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
      <q-tab name="pending" icon="timer" no-caps />
      <q-tab name="partially-paid" icon="attach_money" no-caps />
      <q-tab name="paid" icon="paid" no-caps />
      <q-tab name="packed" icon="local_shipping" no-caps />
      <q-tab name="completed" icon="done" no-caps />
      <q-tab name="canceled" icon="cancel" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="pending" id="pending">
        <OrderList status="1" />
      </q-tab-panel>
      <q-tab-panel name="partially-paid" id="partially-paid">
        <OrderList status="2" />
      </q-tab-panel>
      <q-tab-panel name="paid" id="paid">
        <OrderList status="3" />
      </q-tab-panel>
      <q-tab-panel name="packed" id="packed">
        <OrderList status="6" />
      </q-tab-panel>
      <q-tab-panel name="completed" id="completed">
        <OrderList status="5" />
      </q-tab-panel>
      <q-tab-panel name="canceled" id="canceled">
        <OrderList status="4" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import OrderList from "src/components/OrderList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "pending");
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
