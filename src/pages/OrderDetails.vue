<template>
  <q-page padding v-if="order">
    <div class="text-h6 text-center">#{{ order.id }}</div>
    <div class="row wrap" v-if="order.customer">
      <div class="col-6 text-left">
        <q-icon name="person" class="q-mr-sm" size="sm" />{{ order.customer }}
      </div>
      <div class="col-6 text-right">
        <q-icon name="phone" class="q-mr-sm" size="sm" />{{ order.phone }}
      </div>
    </div>
    <div v-if="order.address">Address:{{ order.address }}</div>
    <div v-if="order.note">Note:{{ order.note }}</div>
    <div class="row justify-between">
      <div class="row items-center">
        <q-icon name="calendar_month" size="sm" class="q-mr-sm" />
        <div>
          {{ formatDate(order.updated_at, "hh:mm:ss A DD/MM/YYYY") }}
        </div>
      </div>
      <div class="text-weight-bold">
        Status : {{ orderStatus[order.status] }}
      </div>
    </div>
    <div class="text-center">
      <q-btn
        label="Update customer info"
        no-caps
        flat
        icon="edit"
        @click="showEditCustomerDialog"
      />
    </div>
    <q-separator spaced />
    <div v-if="order.payments.length">
      <div class="text-center text-subtitle1 text-weight-bold">
        Payment Information
      </div>
      <div v-for="payment in order.payments" :key="payment.pivot.id">
        <div v-if="payment.payment_type_id == 1">
          {{ payment.pivot.amount.toLocaleString() }} is paid by cash on
          {{ formatDate(payment.pivot.created_at, "hh:mm:ss A DD/MM/YYYY") }}
        </div>
        <div v-else>
          {{ payment.pivot.amount }} is paid to {{ payment.pivot.number }},
          {{ payment.pivot.account_name }} on
          {{ formatDate(payment.pivot.created_at, "hh:mm:ss A DD/MM/YYYY") }}
          <q-btn
            icon="screenshot"
            rounded
            flat
            @click="showScreenshot(payment)"
            v-if="payment.pivot.picture"
          />
        </div>
        <q-separator spaced />
      </div>
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
          <td class="text-right">
            {{
              (
                product.pivot.price - (product.pivot.discount ?? 0) || "FOC"
              ).toLocaleString()
            }}
          </td>
          <td class="text-right">{{ product.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (
                (product.pivot.price - (product.pivot.discount ?? 0)) *
                  product.pivot.quantity || "FOC"
              ).toLocaleString()
            }}
          </td>
        </tr>
        <tr v-for="(product, key) in order.items" :key="product.id">
          <td class="text-left">{{ key + 1 }}</td>
          <td class="text-left">{{ product.name }}</td>
          <td class="text-right">
            {{
              (
                product.pivot.price - (product.pivot.discount ?? 0) || "FOC"
              ).toLocaleString()
            }}
          </td>
          <td class="text-right">{{ product.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (
                (product.pivot.price - (product.pivot.discount ?? 0)) *
                  product.pivot.quantity || "FOC"
              ).toLocaleString()
            }}
          </td>
        </tr>
        <tr v-for="(service, key) in order.services" :key="service.id">
          <td class="text-left">
            {{ key + 1 + order.features.length + order.items.length }}
          </td>
          <td class="text-left">{{ service.name }}</td>
          <td class="text-right">
            {{
              (
                service.pivot.price - (service.pivot.discount ?? 0)
              ).toLocaleString()
            }}
          </td>
          <td class="text-right">{{ service.pivot.quantity }}</td>
          <td class="text-right">
            {{
              (
                (service.pivot.price - (service.pivot.discount ?? 0)) *
                service.pivot.quantity
              ).toLocaleString()
            }}
          </td>
        </tr>
        <tr>
          <td colspan="3" class="text-right">Total</td>
          <td class="text-right">
            {{
              order.features.reduce((carry, e) => carry + e.pivot.quantity, 0) +
              order.services.reduce((carry, e) => carry + e.pivot.quantity, 0) +
              order.items.reduce((carry, e) => carry + e.pivot.quantity, 0)
            }}
          </td>
          <td class="text-right">
            {{
              (
                order.features.reduce(
                  (carry, e) =>
                    carry +
                    (e.pivot.price - e.pivot.discount) * e.pivot.quantity,
                  0
                ) +
                  order.services.reduce(
                    (carry, e) =>
                      carry +
                      (e.pivot.price - e.pivot.discount) * e.pivot.quantity,
                    0
                  ) +
                  order.items.reduce(
                    (carry, e) => carry + e.pivot.price * e.pivot.quantity,
                    0
                  ) || "FOC"
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
            {{ (order.amount - order.discount || "FOC").toLocaleString() }}
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
    <div class="q-mt-sm row justify-around">
      <q-btn
        label="Pay"
        no-caps
        color="primary"
        @click="makePayment"
        :disabled="[3, 4, 5].includes(order.status)"
      />
      <q-btn
        label="Complete"
        no-caps
        color="positive"
        @click="completeOrder"
        :disabled="order.status != 3"
      />
      <q-btn
        label="Cancel"
        no-caps
        color="warning"
        @click="cancelOrder"
        :disabled="[4, 5].includes(order.status)"
      />
      <q-btn
        label="Print"
        no-caps
        color="primary"
        @click="showPrintOrderDialog"
      />
    </div>
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { date, useQuasar } from "quasar";
import OrderPaymentDialog from "src/components/OrderPaymentDialog.vue";
import EditCustomerDialog from "src/components/dialogs/EditCustomerDialog.vue";
import PrintOrderDialog from "src/components/dialogs/PrintOrderDialog.vue";

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

const showEditCustomerDialog = () => {
  dialog({
    component: EditCustomerDialog,
    componentProps: {
      order: order.value,
    },
  }).onOk((updatedOrder) => {
    order.value.customer = updatedOrder.customer;
    order.value.phone = updatedOrder.phone;
    order.value.address = updatedOrder.address;
    order.value.note = updatedOrder.note;
  });
};

const showScreenshot = (payment) => {
  dialog({
    title: "Payment screenshot",
    html: true,
    message: `<img src='${payment.pivot.picture}' style='width:100%'>`,
  });
};

const showPrintOrderDialog = () => {
  dialog({
    component: PrintOrderDialog,
    componentProps: {
      order: order.value,
    },
  });
};

const cancelOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to cancel the order?",
    persistent: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `orders/${order.value.id}/cancel`,
    }).then((response) => {
      order.value = response.data.order;
      notify({
        message: "Order is canceled",
        type: "positive",
      });
    });
  });
};

const completeOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to complete the order?",
    persistent: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `orders/${order.value.id}/complete`,
    }).then((response) => {
      order.value = response.data.order;
      notify({
        message: "Order is completed",
        type: "positive",
      });
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
