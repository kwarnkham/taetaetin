<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="column items-center no-wrap">
      <div class="receipt text-grey-10 column justify-start" id="print-target">
        <div class="text-center text-h5 q-mb-sm">{{ item.name }}</div>
        <div v-html="item.qr"></div>
      </div>

      <div class="row justify-around receipt">
        <q-btn icon="close" @click="onDialogHide"></q-btn>
        <q-btn
          v-if="!platform.is.iphone && !platform.is.ipad"
          :icon="'print'"
          @click="print"
          :disabled="printing"
          color="primary"
        ></q-btn>
      </div>

      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import usePrinter from "src/composables/printer";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const { loading, notify, platform } = useQuasar();

const { sendPrinterData, printing } = usePrinter();

const print = () => {
  printing.value = true;
  sendPrinterData({ node: document.getElementById("print-target") })
    .then(() => {
      // sendTextData("\u000A\u000D");
    })
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
      loading.hide();
    });
};

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>

<style lang="scss" scoped>
.receipt {
  width: 360px;
}
</style>
