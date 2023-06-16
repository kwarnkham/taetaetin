<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="column items-center no-wrap">
      <div
        class="text-grey-10 column justify-start"
        id="print-target"
        :style="{ width: printing ? getPrintWidth() + 'px' : '360px' }"
      >
        <div
          class="text-center row justify-center full-width"
          v-if="setting.print_logo"
        >
          <img :src="setting.print_logo" alt="print_logo" width="360" />
        </div>

        <div
          class="row line-text q-mt-sm text-weight-bold"
          :style="{
            fontSize: (printing ? getPrintWidth() * 0.08 : '20') + 'px',
          }"
          v-else
        >
          Receipt
        </div>

        <div
          class="row justify-between full-width no-wrap"
          :style="{
            fontSize: (printing ? getPrintWidth() * 0.05 : '16') + 'px',
          }"
        >
          <div class="col-6" v-if="order.customer">
            <q-icon name="person" class="q-mr-xs" />{{ order.customer }}
          </div>
          <div class="text-right col-6" v-if="order.phone">
            <q-icon name="phone_iphone" class="q-mr-xs" />{{ order.phone }}
          </div>
        </div>
        <div
          class="row justify-between full-width no-wrap"
          :style="{
            fontSize: (printing ? getPrintWidth() * 0.05 : '16') + 'px',
          }"
        >
          <div class="col-6">
            <span>#{{ order.id }}</span>
          </div>
          <div class="text-right col-6">
            <q-icon name="calendar_month" class="q-mr-xs" />{{
              formatDate(order.updated_at, "DD-MM-YYYY")
            }}
          </div>
        </div>
        <div
          v-if="order.address"
          :style="{
            fontSize: (printing ? getPrintWidth() * 0.05 : '16') + 'px',
          }"
        >
          <q-icon name="location_on" class="q-mr-xs" />
          {{ order.address }}
        </div>

        <q-markup-table
          wrap-cells
          flat
          dense
          separator="none"
          class="bg-transparent text-grey-10 full-width"
        >
          <thead>
            <tr>
              <th
                class="text-left"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Name
              </th>
              <th
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Price<span v-if="showDiscount">(Dis)</span>
              </th>
              <th
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Qty
              </th>
              <th
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Amt
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in order.a_items">
              <tr v-if="item" :key="item.id">
                <td
                  class="text-left"
                  :style="{
                    fontSize:
                      (printing ? getPrintWidth() * 0.04 : '15') +
                      'px !important',
                  }"
                >
                  {{ item.name }}
                </td>

                <td
                  class="text-right"
                  :style="{
                    fontSize:
                      (printing ? getPrintWidth() * 0.04 : '15') +
                      'px !important',
                  }"
                >
                  {{
                    (item.pivot.price - item.pivot.discount).toLocaleString()
                  }}
                  <span v-if="item.pivot.discount">
                    <span v-if="showDiscount">
                      (-{{ item.pivot.discount }})
                    </span>
                  </span>
                </td>
                <td
                  class="text-right"
                  :style="{
                    fontSize:
                      (printing ? getPrintWidth() * 0.04 : '15') +
                      'px !important',
                  }"
                >
                  {{ item.pivot.quantity }}
                </td>
                <td
                  class="text-right"
                  :style="{
                    fontSize:
                      (printing ? getPrintWidth() * 0.04 : '15') +
                      'px !important',
                  }"
                >
                  {{
                    (
                      (item.pivot.price - item.pivot.discount) *
                      item.pivot.quantity
                    ).toLocaleString()
                  }}
                </td>
              </tr>
            </template>

            <tr class="summery">
              <td
                colspan="2"
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Total
              </td>
              <td
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                {{
                  order.a_items
                    .filter((e) => !!e)
                    .reduce((carry, e) => carry + e.pivot.quantity, 0)
                }}
              </td>
              <td
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                {{
                  order.a_items
                    .filter((e) => !!e)
                    .reduce(
                      (carry, e) =>
                        carry +
                        (e.pivot.price - e.pivot.discount) * e.pivot.quantity,
                      0
                    )
                    .toLocaleString()
                }}
              </td>
            </tr>
            <tr>
              <td
                colspan="3"
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Paid
              </td>
              <td
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                {{ order.paid.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td
                colspan="3"
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Discount
              </td>
              <td
                class="text-right"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                {{ order.discount.toLocaleString() }}
              </td>
            </tr>
            <tr class="grand-total">
              <td
                colspan="3"
                class="text-right text-weight-bolder"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                Grand Total
              </td>
              <td
                class="text-right text-weight-bold"
                :style="{
                  fontSize:
                    (printing ? getPrintWidth() * 0.04 : '15') +
                    'px !important',
                }"
              >
                {{
                  (order.amount - order.discount - order.paid).toLocaleString()
                }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <div
          v-if="order.note"
          :style="{
            fontSize:
              (printing ? getPrintWidth() * 0.045 : '16') + 'px !important',
          }"
        >
          Note: {{ order.note }}
        </div>
        <div
          class="text-caption"
          :style="{
            fontSize:
              (printing ? getPrintWidth() * 0.04 : '15') + 'px !important',
          }"
        >
          {{ printTime }}
        </div>
        <div
          class="text-overline flex row line-text q-mt-sm"
          :style="{
            fontSize:
              (printing ? getPrintWidth() * 0.05 : '15') + 'px !important',
          }"
        >
          Thank you
        </div>
      </div>

      <div class="row justify-around" style="width: 360px">
        <q-btn icon="close" @click="onDialogHide" />
        <q-btn label="Discount" no-caps @click="showDiscount = !showDiscount" />
        <q-btn
          v-if="!platform.is.iphone && !platform.is.ipad"
          :icon="'print'"
          @click="print"
          :disabled="printing"
          color="primary"
        />
      </div>

      <div class="col"></div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, date, useQuasar } from "quasar";
import usePrinter from "src/composables/printer";
import { ref } from "vue";

const { formatDate } = date;
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const { notify, platform, localStorage } = useQuasar();
const setting = localStorage.getItem("setting");
const showDiscount = ref(true);

const { sendPrinterData, printTime, printing, sendTextData, getPrintWidth } =
  usePrinter();

// printing.value = true;

const print = () => {
  printing.value = true;
  sendPrinterData({ node: document.getElementById("print-target") })
    .then(() => {
      sendTextData("\u000A\u000D");
    })
    .catch((error) => {
      if (error) notify(error);
      else notify("Printer has disconnected");
    })
    .finally(() => {
      printing.value = false;
    });
};

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>

<style lang="scss" scoped>
.line-text:before,
.line-text:after {
  content: "";
  flex: 1 1;
  border-bottom: 1px dashed;
  margin: auto;
}
.line-text:before {
  margin-right: 1em;
}
.line-text:after {
  margin-left: 1em;
}

// .q-table tbody td,
// th {
//   font-size: 18px;
// }

th,
.summery > td {
  border-top: 1px dashed $grey-10;
  border-bottom: 1px dashed $grey-10;
  font-weight: normal;
}

th {
  border-bottom: 1px dashed $grey-10;
}

.grand-total > td {
  border-top: 1px dashed $grey-10;
}

.border-top {
  border-top: 1px dashed $grey-10;
}
</style>
