<template>
  <div class="bg-light-blue-2 rounded-borders q-pa-xs">
    <div class="text-h5 text-center">{{ $t("balanceReport") }}</div>
    <div class="row no-wrap q-pa-sm">
      <q-input
        type="date"
        v-model="from"
        dense
        class="col"
        :label="$t('from')"
      />
      <q-separator vertical spaced />
      <q-input type="date" v-model="to" dense class="col" :label="$t('to')" />
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
            <div class="text-h6">{{ $t("order", 2) }}</div>
            <div class="text-overline">
              {{ orders.toLocaleString() }} {{ $t("mmk") }}
            </div>
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
              outline
              color="primary"
            >
              {{ $t("details") }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-6 q-pl-xs">
        <q-card class="col-6">
          <q-card-section>
            <div class="text-h6">{{ $t("purchase", 2) }}</div>
            <div class="text-overline">
              {{ purchases.toLocaleString() }} {{ $t("mmk") }}
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
              outline
              color="primary"
            >
              {{ $t("details") }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <q-card class="col-12">
        <q-card-section>
          <div class="text-h6 text-center">{{ $t("summary") }}</div>
          <div class="text-overline text-right">
            <div>
              {{ $t("order", 2) }}: {{ orders.toLocaleString() }}
              {{ $t("mmk") }}
            </div>
            <div>
              {{ $t("purchase", 2) }}: {{ purchases.toLocaleString() }}
              {{ $t("mmk") }}
            </div>
            <div>
              {{ $t("balance") }}: {{ (orders - purchases).toLocaleString() }}
              {{ $t("mmk") }}
            </div>
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
