<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    position="top"
    no-backdrop-dismiss
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <ExpenseForm
        :expense="expense"
        update
        @expense-submitted="onDialogOK"
        @closed="onDialogCancel"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ExpenseForm from "../ExpenseForm.vue";

const props = defineProps({
  expense: {
    type: Object,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
