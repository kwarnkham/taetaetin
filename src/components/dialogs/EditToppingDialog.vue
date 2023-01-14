<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <ToppingForm :topping="topping" update @topping-submitted="onDialogOK" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ToppingForm from "../ToppingForm.vue";

const props = defineProps({
  topping: {
    type: Object,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
