<template>
  <div class="bg-light-blue-2 rounded-borders q-pa-xs">
    <div class="text-h5 text-center">Balance Report</div>
    <q-separator />
    <div class="row q-gutter-y-xs">
      <div class="col-6 q-pr-xs">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h6">Orders</div>
            <div class="text-overline">{{ orders.toLocaleString() }} MMK</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              @click="
                $router.push({
                  name: 'order-menu',
                })
              "
              no-caps
              flat
            >
              Details
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-6 q-pl-xs">
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">Purchases</div>
            <div class="text-overline">
              {{ purchases.toLocaleString() }} MMK
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              @click="
                $router.push({
                  name: 'purchases',
                })
              "
              no-caps
              flat
            >
              Details
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6 text-center">Summary</div>
          <div class="text-overline text-right">
            <div>Ordres: {{ orders.toLocaleString() }} MMK</div>
            <div>Purchases: {{ purchases.toLocaleString() }} MMK</div>
            <div>Balance: {{ (orders - purchases).toLocaleString() }} MMK</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import usePagination from "src/composables/pagination";
import { date } from "quasar";

const { formatDate } = date;
const from = formatDate(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  "YYYY-MM-DD"
);
const to = formatDate(
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  "YYYY-MM-DD"
);
const { total: orders } = usePagination("orders", {
  per_page: 1,
  status: 5,
  from,
  to,
});
const { total: purchases } = usePagination("purchases", {
  per_page: 1,
  status: 1,
  from,
  to,
});
</script>
