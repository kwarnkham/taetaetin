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
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="expense" id="expense" class="column">
        <ExpenseForm />
        <ExpenseList class="col q-mt-sm" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import ExpenseForm from "src/components/ExpenseForm.vue";
import ExpenseList from "src/components/ExpenseList.vue";
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
const updateExpenseHeight = () => {
  if (tab.value == "expense")
    document.getElementById("expense").style.height =
      document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updateExpenseHeight);
onMounted(updateExpenseHeight);
</script>
