<template>
  <div class="full-height column">
    <template v-if="hasDateFilter">
      <div v-if="total">Total: {{ total.toLocaleString() }} MMK</div>
      <div class="row justify-between items-center">
        <q-input v-model="from" type="date" :class="{ 'col-6': screen.lt.sm }">
          <template v-slot:prepend>
            <span class="text-caption text-weight-bold">From</span>
          </template>
        </q-input>
        <q-separator vertical v-if="screen.lt.sm" />
        <q-input v-model="to" type="date" :class="{ 'col-5': screen.lt.sm }">
          <template v-slot:prepend>
            <span class="text-caption text-weight-bold">To</span>
          </template>
        </q-input>
        <div class="q-my-sm" :class="{ 'text-right col-12': screen.lt.sm }">
          <q-btn icon="search" @click="findByDates" />
        </div>
      </div>
    </template>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="order in pagination?.data" :key="order.id">
        <q-item-section>
          <q-item-label>
            Remaining:
            {{
              (
                order.amount -
                order.discount -
                order.payments.reduce((carry, e) => carry + e.pivot.amount, 0)
              ).toLocaleString()
            }}
            MMK
            <q-badge align="top">#{{ order.id }}</q-badge>
          </q-item-label>
          <q-item-label>
            Amount:
            {{ (order.amount - order.discount).toLocaleString() }}
            MMK
          </q-item-label>
          <q-item-label>
            Order is
            <span class="text-overline">{{ orderStatus[order.status] }}</span>
            at
            <span class="text-weight-bold">
              {{ formatDate(order.updated_at, "hh:mm:ss A DD/MM/YYYY") }}
            </span>
          </q-item-label>

          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn
              rounded
              no-caps
              label="See more"
              @click="
                $router.push({
                  name: 'order-details',
                  params: {
                    order: order.id,
                  },
                })
              "
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import usePagination from "src/composables/pagination";
import { useQuasar, date } from "quasar";

const props = defineProps({
  hasDateFilter: { type: Boolean, default: false },
  status: { required: false },
});
const { formatDate } = date;
const { localStorage, screen } = useQuasar();
const { api } = useUtil();
const orderStatus = localStorage.getItem("orderStatus");
const fetchOrders = (params) => {
  return new Promise((resolve, reject) => {
    api(
      {
        method: "GET",
        url: "orders",
        params: params,
      },
      false
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, current, total, from, to, findByDates } =
  usePagination(fetchOrders, {
    hasDateFilter: props.hasDateFilter,
    status: props.status,
  });
</script>
