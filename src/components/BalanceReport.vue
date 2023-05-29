<template>
  <div class="bg-light-blue-2 rounded-borders q-pa-xs">
    <div class="text-h5 text-center">Balance Report</div>
    <div class="row no-wrap q-pa-sm">
      <q-input type="date" v-model="from" dense class="col" label="From" />
      <q-separator vertical spaced />
      <q-input type="date" v-model="to" dense class="col" label="To" />
      <q-btn
        icon="download"
        flat
        :color="loading ? 'grey' : 'secondary'"
        @click="getData()"
        :disable="loading"
      />
    </div>
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
                  query: {
                    report: '1',
                  },
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
import useDateFilter from "src/composables/dateFilter";
import { ref } from "vue";

const { from, to } = useDateFilter(new Date().getMonth());

const loading = ref(false);

const { total: orders, updateQueryAndFetch: getOrders } = usePagination(
  "orders",
  {
    per_page: 1,
    status: 5,
    from: from.value,
    to: to.value,
  }
);
const { total: purchases, updateQueryAndFetch: getPurchases } = usePagination(
  "purchases",
  {
    per_page: 1,
    status: 1,
    from: from.value,
    to: to.value,
  }
);

const getData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
  getOrders({ from: from.value, to: to.value, status: 5 });
  getPurchases({ from: from.value, to: to.value, status: 1 });
};
</script>
