<template>
  <q-page padding>
    <div>
      <q-btn
        label="Add Product"
        @click="showSelectProductDialog"
        no-caps
        class="full-width"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import SelectProductDialog from "src/components/dialogs/SelectProductDialog.vue";

const { dialog } = useQuasar();
const showSelectProductDialog = () => {
  dialog({
    component: SelectProductDialog,
  });
};
</script>
