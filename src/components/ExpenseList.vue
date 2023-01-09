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

    <div class="row justify-center full-width">
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import RecordExpenseDialog from "./dialogs/RecordExpenseDialog.vue";
import EditExpenseDialog from "./dialogs/EditExpenseDialog.vue";

const { api } = useUtil();
const { dialog } = useQuasar();

const fetchExpenses = () => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "expenses",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, current } = usePagination(fetchExpenses);

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
