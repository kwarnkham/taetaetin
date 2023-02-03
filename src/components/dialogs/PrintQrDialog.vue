<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent maximized>
    <q-card class="column items-center no-wrap">
      <div class="receipt text-grey-10 column justify-start" id="print-target">
        <div class="text-center text-h5 q-mb-sm">{{ item.name }}</div>
        <div v-html="item.qr"></div>
      </div>

      <div class="row justify-around receipt">
        <div class="col-12" v-if="!platform.is.iphone && !platform.is.ipad">
          <div class="full-width q-px-lg">
            <q-badge color="primary"> Size: {{ printSize }} (1 to 10) </q-badge>
            <q-slider v-model="printSize" markers :min="1" :max="10" />
          </div>
          <div class="full-width q-px-lg">
            <q-badge color="primary"> Format: {{ printBit }} </q-badge>
            <q-slider v-model="printBit" markers :min="1" :max="5" />
          </div>
        </div>
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
const { loading, notify, platform, localStorage } = useQuasar();

const { sendPrinterData, printBit, printSize, printing } = usePrinter();

const print = () => {
  printing.value = true;
  sendPrinterData(
    document.getElementById("print-target"),
    printSize.value,
    printBit.value
  )
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
      localStorage.set("printSize", printSize.value);
      localStorage.set("printBit", printBit.value);
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
