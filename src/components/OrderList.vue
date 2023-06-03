<template>
  <q-list bordered separator class="overflow-auto">
    <q-item v-for="order in orders" :key="order.id">
      <q-item-section>
        <q-item-label class="items-center row" v-if="order.customer">
          <q-icon name="person" /> {{ order.customer }}
        </q-item-label>
        <q-item-label v-if="![3, 4, 5].includes(order.status)">
          {{ $t("remaining") }}:
          {{ (order.amount - order.discount - order.paid).toLocaleString() }}
          {{ $t("mmk") }}
        </q-item-label>
        <q-item-label>
          {{ $t("amount") }}:
          {{ (order.amount - order.discount).toLocaleString() }}
          {{ $t("mmk") }}
          <q-badge align="top">#{{ order.id }}</q-badge>
        </q-item-label>
        <q-item-label class="bg-grey-4 rounded-borders row justify-between">
          <span
            class="text-overline"
            :class="{
              'text-brown': order.status == 1,
              'text-indigo': order.status == 2,
              'text-primary': order.status == 3,
              'text-negative': order.status == 4,
              'text-positive': order.status == 5,
              'text-amber-10': order.status == 6,
              'text-green-10': order.status == 7,
            }"
          >
            {{
              $t(
                orderStatuses
                  .find((e) => e.id == order.status)
                  .label.split(" ")
                  .map((e, index) =>
                    index == 0
                      ? e.toLowerCase()
                      : e.toLowerCase().charAt(0).toUpperCase() + e.slice(1)
                  )
                  .join("")
              )
            }}
          </span>

          <span class="text-weight-bold">
            <q-icon name="access_time_filled" />
            {{ formatDate(order.updated_at, "DD/MM/YYYY hh:mm:ss A") }}
          </span>
        </q-item-label>

        <div class="row justify-start q-gutter-x-sm q-mt-sm">
          <q-btn
            outline
            color="primary"
            no-caps
            :label="$t('details')"
            @click="showOrder(order)"
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
const { localStorage } = useQuasar();
const orderStatuses = localStorage.getItem("orderStatuses");
</script>
