<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="column no-wrap items-center">
      <div
        class="text-grey-10 column justify-start text-h4"
        id="print-target"
        :style="{ width: printing ? getPrintWidth() + 'px' : '360px' }"
      >
        <div class="text-right">
          <img
            :src="setting.delivery_logo"
            alt="print_logo"
            width="300"
            v-if="setting.delivery_logo"
          />
          <div class="full-width text-center text-h6 bottom-dashed" v-else>
            Address and note
          </div>
        </div>
        <div class="row items-center">
          {{ order.customer }}
        </div>
        <div class="row items-center">
          {{ order.phone }}
        </div>
        <div class="row items-center bottom-dashed">
          {{ order.address }}
        </div>
        <div class="row items-center bottom-dashed" v-if="order.note">
          {{ order.note }}
        </div>
      </div>

      <div class="row justify-around q-mt-sm" style="width: 360px">
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

const { sendPrinterData, printing, sendTextData, getPrintWidth } = usePrinter();
const print = () => {
  printing.value = true;
  sendPrinterData({ node: document.getElementById("print-target") })
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
.bottom-dashed {
  border-bottom: 2px dashed $grey-10;
}
</style>
