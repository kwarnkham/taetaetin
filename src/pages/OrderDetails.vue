<template>
  <q-page padding v-if="order">
    <div class="text-h6 text-center">#{{ order.id }}</div>
    <div class="row justify-between">
      <div class="row items-center">
        <q-icon name="calendar_month" size="sm" />
        <div>
          {{ formatDate(order.updated_at, "hh:mm:ss A DD/MM/YYYY") }}
        </div>
      </div>
      <div class="text-weight-bold">Status:{{ orderStatus[order.status] }}</div>
    </div>
    <q-markup-table separator="cell" flat bordered wrap-cells>
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Item</th>
          <th class="text-right">Price</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, key) in order.features" :key="product.id">
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">{{ product.pivot.price.toLocaleString() }}</td>
          <td class="text-right">{{ product.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (product.pivot.price * product.pivot.quantity).toLocaleString()
            }}
          </td>
        </tr>
        <tr v-for="(service, key) in order.services" :key="service.id">
          <td class="text-left">{{ key + 1 + order.features.length }}</td>
          <td class="text-left">{{ service.name }}</td>
          <td class="text-right">
            {{ service.pivot.price.toLocaleString() }}
          </td>
          <td class="text-right">{{ service.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (service.pivot.price * service.pivot.quantity).toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Total</td>
          <td class="text-right">
            {{
              order.features.reduce((carry, e) => carry + e.pivot.quantity, 0) +
              order.services.reduce((carry, e) => carry + e.pivot.quantity, 0)
            }}
          </td>
          <td class="text-right">
            {{
              (
                order.features.reduce(
                  (carry, e) => carry + e.pivot.price * e.pivot.quantity,
                  0
                ) +
                order.services.reduce(
                  (carry, e) => carry + e.pivot.price * e.pivot.quantity,
                  0
                )
              ).toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Discount</td>
          <td class="text-right">
            {{ order.discount.toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Amount</td>
          <td class="text-right">
            {{ (order.amount - order.discount).toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Paid</td>
          <td class="text-right">
            {{
              order.payments
                .reduce((carry, e) => carry + e.pivot.amount, 0)
                .toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3"></td>
          <td class="text-right">Remaining</td>
          <td class="text-right">
            {{
              (
                order.amount -
                order.discount -
                order.payments.reduce((carry, e) => carry + e.pivot.amount, 0)
              ).toLocaleString()
            }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div class="q-mt-sm">
      <q-btn label="Pay" no-caps color="primary" @click="makePayment" />
    </div>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { date, useQuasar } from "quasar";
import OrderPaymentDialog from "src/components/OrderPaymentDialog.vue";

const { formatDate } = date;
const { localStorage, dialog, notify } = useQuasar();
const { api } = useUtil();
const order = ref(null);
const route = useRoute();
const orderStatus = localStorage.getItem("orderStatus");
const makePayment = () => {
  dialog({
    component: OrderPaymentDialog,
    persistent: true,
    cancel: true,
    componentProps: {
      order: order.value,
    },
  }).onOk((updatedOrder) => {
    order.value = updatedOrder;
    notify({
      message: "Success",
      type: "positive",
    });
  });
};
onMounted(() => {
  api({
    method: "GET",
    url: "orders/" + route.params.order,
  }).then((response) => {
    order.value = response.data.order;
  });
});
</script>
