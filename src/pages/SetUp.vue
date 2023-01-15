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
      <q-tab name="expense" label="Expense" no-caps />
      <q-tab name="payment" label="Payment" no-caps />
      <q-tab name="service" label="Service" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="expense" id="expense" class="column no-wrap">
        <ExpenseForm />
        <ExpenseList class="col q-mt-sm" />
      </q-tab-panel>
      <q-tab-panel name="payment" id="payment" class="column no-wrap">
        <PaymentForm />
        <PaymentList />
      </q-tab-panel>
      <q-tab-panel name="service" id="service" class="column no-wrap">
        <ServiceForm />
        <ServiceList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ExpenseForm from "src/components/ExpenseForm.vue";
import ExpenseList from "src/components/ExpenseList.vue";
import PaymentForm from "src/components/PaymentForm.vue";
import PaymentList from "src/components/PaymentList.vue";
import ServiceForm from "src/components/ServiceForm.vue";
import ServiceList from "src/components/ServiceList.vue";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "expense");
const router = useRouter();

watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      tab: tab.value,
    },
  });
});
const updateTabPanelHeight = () => {
  document.getElementById(tab.value).style.height =
    document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updateTabPanelHeight);
onMounted(updateTabPanelHeight);
</script>
