<template>
  <q-page padding class="column">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey full-width"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      outside-arrows
      mobile-arrows
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
      <q-tab-panel
        :name="status[1].split(' ').join('-').toLowerCase()"
        :id="status[1].split(' ').join('-').toLowerCase()"
        v-for="status in orderStatus"
        :key="status[0]"
      >
        <OrderList :status="status[0]" has-search />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import OrderList from "src/components/OrderList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "pending");
const router = useRouter();
const { localStorage } = useQuasar();
const orderStatus = Object.entries(localStorage.getItem("orderStatus"));
watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      ...route.query,
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
