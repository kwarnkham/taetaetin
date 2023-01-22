<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <div class="text-right">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>

      <ProductForm
        v-if="update"
        :product="product"
        :update="update"
        :item_id="item_id"
        @product-submitted="onDialogOK"
      />
      <ProductForm v-else :item_id="item_id" @product-submitted="onDialogOK" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ProductForm from "../ProductForm.vue";

const props = defineProps({
  product: {
    type: Object,
  },
  item_id: {
    type: Number,
    required: true,
  },
  update: {
    type: Boolean,
    default: false,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
