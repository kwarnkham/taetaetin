<template>
  <div class="column">
    <div class="text-subtitle1 text-weight-bold text-center">Expense List</div>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="expense in pagination?.data" :key="expense.id">
        <q-item-section>
          <q-item-label>
            {{ expense.name }}
          </q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="add" dense @click="showRecordExpense(expense)" />
            <q-btn round icon="edit" dense @click="showEditExpense(expense)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import RecordExpenseDialog from "./dialogs/RecordExpenseDialog.vue";
import EditExpenseDialog from "./dialogs/EditExpenseDialog.vue";
import { inject, onBeforeUnmount } from "vue";

const { dialog } = useQuasar();
const bus = inject("bus");
const updateExpenseList = (expense) => {
  pagination.value?.data.unshift(expense);
};
bus.on("expenseCreated", updateExpenseList);
onBeforeUnmount(() => {
  bus.off("expenseCreated", updateExpenseList);
});

const { pagination, max, current } = usePagination("expenses");

const showRecordExpense = (expense) => {
  dialog({
    component: RecordExpenseDialog,
    componentProps: {
      expense,
    },
  });
};

const showEditExpense = (expense) => {
  dialog({
    component: EditExpenseDialog,
    componentProps: {
      expense,
    },
  }).onOk((updatedExpense) => {
    const index = pagination.value.data.findIndex((e) => e.id == expense.id);
    if (index >= 0) pagination.value.data.splice(index, 1, updatedExpense);
  });
};
</script>
