<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 700px; max-width: 100vw"
    >
      <ProductForm :item_id="item.id" @feature-updated="onDialogOK" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ProductForm from "../ProductForm.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
