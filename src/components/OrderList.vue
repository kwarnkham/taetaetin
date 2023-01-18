<template>
  <div class="full-height column">
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="order in pagination?.data" :key="order.id">
        <q-item-section>
          <q-item-label>
            Amount:
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

const { formatDate } = date;
const { localStorage } = useQuasar();
const { api } = useUtil();
const orderStatus = localStorage.getItem("orderStatus");
const fetchOrders = (params) => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "orders",
      params: params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, search, current, onlyStocked } =
  usePagination(fetchOrders);
</script>
