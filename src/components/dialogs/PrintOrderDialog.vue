<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="column items-center no-wrap">
      <div class="receipt text-grey-10 column justify-start" id="print-target">
        <img
          src="~assets/print-logo.png"
          alt="print_logo"
          width="360"
          v-if="isLocal || !settings"
        />
        <img
          :src="settings.assets.print_logo"
          alt="print_logo"
          width="360"
          v-else
        />

        <div class="row justify-between full-width no-wrap">
          <div class="col" v-if="order.customer">
            <q-icon name="person" class="q-mr-xs" />{{ order.customer }}
          </div>
          <div class="text-right" v-if="order.phone">
            <q-icon name="phone_iphone" class="q-mr-xs" />{{ order.phone }}
          </div>
        </div>
        <div class="row justify-between full-width no-wrap">
          <div class="col">
            <span class="text-xs">#{{ order.id }}</span>
          </div>
          <div class="text-right">
            <q-icon name="calendar_month" class="q-mr-xs" />{{
              formatDate(order.updated_at, "DD-MM-YYYY")
            }}
          </div>
        </div>
        <div v-if="order.address">
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
              <th class="text-left">Name</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in order.features" :key="product.id">
              <td class="text-left">
                {{ product.name }}
              </td>

              <td class="text-right">
                {{
                  (
                    product.pivot.price - product.pivot.discount
                  ).toLocaleString()
                }}
              </td>
              <td class="text-right">
                {{ product.pivot.quantity }}
              </td>
              <td class="text-right">
                {{
                  (
                    (product.pivot.price - product.pivot.discount) *
                    product.pivot.quantity
                  ).toLocaleString()
                }}
              </td>
            </tr>
            <tr v-for="product in order.items" :key="product.id">
              <td class="text-left">
                {{ product.name }}
              </td>
              <td class="text-right">
                {{ product.pivot.price.toLocaleString() }}
              </td>
              <td class="text-right">
                {{ product.pivot.quantity }}
              </td>
              <td class="text-right">
                {{
                  (
                    product.pivot.price * product.pivot.quantity
                  ).toLocaleString()
                }}
              </td>
            </tr>
            <tr v-for="service in order.services" :key="service.id">
              <td class="text-left">
                {{ service.name }}
              </td>
              <td class="text-right">
                {{ service.pivot.price.toLocaleString() }}
              </td>
              <td class="text-right">
                {{ service.pivot.quantity }}
              </td>
              <td class="text-right">
                {{
                  (
                    service.pivot.price * service.pivot.quantity
                  ).toLocaleString()
                }}
              </td>
            </tr>
            <tr class="summery">
              <td colspan="2" class="text-right">Total</td>
              <td class="text-right">
                {{ totalQty }}
              </td>
              <td class="text-right">
                {{ total.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">Paid</td>
              <td class="text-right">
                {{ paid.toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">Discount</td>
              <td class="text-right">
                {{ order.discount.toLocaleString() }}
              </td>
            </tr>
            <tr class="grand-total">
              <td colspan="3" class="text-right text-weight-bolder">
                Grand Total
              </td>
              <td class="text-right text-weight-bolder">
                {{ (order.amount - order.discount - paid).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <div v-if="order.note" class="text-h6">Note: {{ order.note }}</div>
        <div class="text-caption">{{ printTime }}</div>
        <div class="text-overline flex row line-text q-mt-sm">Thank you</div>
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
import { useDialogPluginComponent, date, useQuasar } from "quasar";
import { computed } from "vue";
import usePrinter from "src/composables/printer";

const { formatDate } = date;
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
const { notify, platform, localStorage } = useQuasar();
const settings = localStorage.getItem("settings");
const isLocal = process.env.DEV;
const totalQty = computed(
  () =>
    props.order.services.reduce(
      (carry, service) => carry + service.pivot.quantity,
      0
    ) +
    props.order.features.reduce(
      (carry, product) => carry + product.pivot.quantity,
      0
    ) +
    props.order.items.reduce(
      (carry, product) => carry + product.pivot.quantity,
      0
    )
);

const total = computed(
  () =>
    props.order.services.reduce(
      (carry, service) =>
        carry +
        (service.pivot.price - service.pivot.discount) * service.pivot.quantity,
      0
    ) +
    props.order.features.reduce(
      (carry, product) =>
        carry +
        (product.pivot.price - product.pivot.discount) * product.pivot.quantity,
      0
    ) +
    props.order.items.reduce(
      (carry, product) => carry + product.pivot.price * product.pivot.quantity,
      0
    )
);

const paid = computed(() =>
  props.order.payments.reduce(
    (carry, payment) => carry + payment.pivot.amount,
    0
  )
);

const { sendPrinterData, printTime, printing } = usePrinter();

const print = () => {
  printing.value = true;
  sendPrinterData(document.getElementById("print-target"))
    .then(() => {
      // sendTextData("\u000A\u000D");
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
.receipt {
  width: 360px;
}
.q-table tbody td,
th {
  font-size: 18px;
}

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
