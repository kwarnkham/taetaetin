<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    position="bottom"
    no-backdrop-dismiss
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <RecordExpenseForm
        :expense="expense"
        @expense-recorded="onDialogOK"
        @closed="onDialogCancel"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import RecordExpenseForm from "src/components/RecordExpenseForm.vue";

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
