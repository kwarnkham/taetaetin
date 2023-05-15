<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="column no-wrap items-center">
      <div
        class="receipt text-grey-10 column justify-start text-h4"
        id="print-target"
      >
        <div class="text-right">
          <img :src="setting.delivery_logo" alt="print_logo" width="300" />
        </div>
        <div class="row items-center">
          {{ order.customer }}
        </div>
        <div class="row items-center">
          {{ order.phone }}
        </div>
        <div class="row items-center">
          {{ order.address }}
        </div>
        <div class="row items-center">
          {{ order.note }}
        </div>
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
  order: {
    type: Object,
    required: true,
  },
});
const { notify, platform, localStorage } = useQuasar();
const setting = localStorage.getItem("setting");

const { sendPrinterData, printing, sendTextData } = usePrinter();
const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"))
    .then(() => {
      sendTextData("");
    })
    .catch((error) => {
      console.warn(error);
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
    });

  // sendPrinterData(document.getElementById("foo"));
};

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>

<style lang="scss" scoped>
.receipt {
  width: 360px;
}
#print-target {
  div {
    border-bottom: 1px dashed $grey-10;
  }
}
</style>
