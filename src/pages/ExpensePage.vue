<template>
  <q-page padding :style-fn="vhPage" class="column">
    <ExpenseForm />
    <q-separator spaced />
    <ExpenseList class="col" />
  </q-page>
</template>

<script setup>
import ExpenseForm from "src/components/ExpenseForm.vue";
import ExpenseList from "src/components/ExpenseList.vue";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();
</script>
