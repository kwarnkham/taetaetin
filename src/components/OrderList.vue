<template>
  <q-list bordered separator class="overflow-auto">
    <q-item v-for="order in orders" :key="order.id">
      <q-item-section>
        <q-item-label class="items-center row" v-if="order.customer">
          <q-icon name="person" /> {{ order.customer }}
        </q-item-label>
        <q-item-label v-if="![3, 4, 5].includes(order.status)">
          Remaining:
          {{ (order.amount - order.discount - order.paid).toLocaleString() }}
          MMK
        </q-item-label>
        <q-item-label>
          Amount:
          {{ (order.amount - order.discount).toLocaleString() }}
          MMK
          <q-badge align="top">#{{ order.id }}</q-badge>
        </q-item-label>
        <q-item-label class="bg-grey-4 rounded-borders">
          Order is
          <span
            class="text-overline"
            :class="{
              'text-white': order.status == 1,
              'text-deep-orange': order.status == 2,
              'text-primary': order.status == 3,
              'text-negative': order.status == 4,
              'text-positive': order.status == 5,
              'text-accent': order.status == 6,
            }"
          >
            {{ orderStatuses.find((e) => e.id == order.status).label }}
          </span>
          at
          <span class="text-weight-bold">
            {{ formatDate(order.updated_at, "hh:mm:ss A DD/MM/YYYY") }}
          </span>
        </q-item-label>

        <div class="row justify-start q-gutter-x-sm q-mt-sm">
          <q-btn rounded no-caps label="See more" @click="showOrder(order)" />
          <q-btn
            v-if="order.customer"
            rounded
            no-caps
            icon="person"
            @click="showOrderCustomer(order)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useQuasar, date } from "quasar";
import useOrder from "src/composables/order";

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
});
const { showOrderDetails } = useOrder();
const showOrder = (order) => {
  showOrderDetails(order).then((order) => {
    emit("orderUpdated", order);
  });
};
const emit = defineEmits(["orderUpdated"]);
const { formatDate } = date;
const { localStorage, dialog } = useQuasar();
const orderStatuses = localStorage.getItem("orderStatuses");

const showOrderCustomer = (order) => {
  dialog({
    noBackdropDismiss: true,
    title: order.customer,
    message: `<div>Phone : ${order.phone ?? ""}. </div>
              <div>Address : ${order.address ?? ""}.</div>
              <div>Note :${order.note ?? ""}</div>`,
    html: true,
  });
};
</script>
