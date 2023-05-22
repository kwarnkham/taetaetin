<template>
  <q-page padding>
    <div class="full-width q-px-lg">
      <div class="text-center text-subtitle1">
        This is size setting. Change this to adjust with the paper size
      </div>
      <q-badge color="primary"> Size: {{ printSize }} (1 to 10) </q-badge>
      <q-slider v-model="printSize" markers :min="1" :max="10" />
    </div>
    <q-separator spaced />
    <div class="full-width q-px-lg">
      <div class="text-center text-subtitle1">
        This is bit setting. Change this if the printer does not print or has
        error.
      </div>
      <q-badge color="accent"> Format: {{ printBit }} </q-badge>
      <q-slider v-model="printBit" markers :min="1" :max="5" color="accent" />
    </div>
    <q-separator spaced />
    <div class="text-center">
      <q-btn label="Test Print" no-caps @click="print" :disabled="printing" />
    </div>
    <div class="row justify-center full-width">
      <div class="text-grey-10" id="print-target" style="width: 360px">
        <q-icon name="print" size="10em" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePrinter from "src/composables/printer";
import { ref, watch } from "vue";

const { localStorage, notify } = useQuasar();
const { printBit, printSize, sendPrinterData } = usePrinter();

const printing = ref(false);

watch(printSize, () => {
  localStorage.set("printSize", printSize.value);
});
watch(printBit, () => {
  localStorage.set("printBit", printBit.value);
});
const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"))
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
    });
};
</script>
