<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="bottom"
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <div class="text-right">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>
      <RestockForm :product="product" @restocked="onDialogOK" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import RestockForm from "../RestockForm.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
