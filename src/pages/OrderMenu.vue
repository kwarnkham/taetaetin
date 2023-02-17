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
        <OrderList
          :status="status[0]"
          has-search
          @vnode-mounted="updateItemListHeight"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import OrderList from "src/components/OrderList.vue";
import useTabPanels from "src/composables/tabPanels";

const { localStorage } = useQuasar();
const orderStatus = Object.entries(localStorage.getItem("orderStatus"));
const { tab, updateItemListHeight } = useTabPanels("pending");
</script>
