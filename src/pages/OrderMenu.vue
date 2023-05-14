<template>
  <q-page padding class="column" :style-fn="vhPage">
    <div class="row justify-between q-gutter-y-xs">
      <q-checkbox
        dense
        v-model="status.pending"
        label="Pending"
        :disable="String(statusParam).length == 1 && status.pending"
      />
      <q-checkbox
        dense
        v-model="status.patiallyPaid"
        label="Partial Paid"
        :disable="String(statusParam).length == 1 && status.patiallyPaid"
      />
      <q-checkbox
        dense
        v-model="status.paid"
        label="Paid"
        :disable="String(statusParam).length == 1 && status.paid"
      />
      <q-checkbox
        dense
        v-model="status.packed"
        label="Packed"
        :disable="String(statusParam).length == 1 && status.packed"
      />
      <q-checkbox
        dense
        v-model="status.onDelivery"
        label="On Delivery"
        :disable="String(statusParam).length == 1 && status.onDelivery"
      />
      <q-checkbox
        dense
        v-model="status.completed"
        label="Completed"
        :disable="String(statusParam).length == 1 && status.completed"
      />
      <q-checkbox
        dense
        v-model="status.canceled"
        label="Canceled"
        :disable="String(statusParam).length == 1 && status.canceled"
      />
    </div>

    <div v-if="total" class="text-center text-subtitle2 q-mt-sm">
      Total: {{ total.toLocaleString() }} MMK
    </div>

    <div class="row justify-between items-end">
      <q-input v-model="from" type="date" label="From" class="col" />
      <q-separator vertical spaced />
      <q-input v-model="to" type="date" label="To" class="col" />
      <div class="q-my-sm">
        <q-btn
          icon="search"
          flat
          @click="
            updateQueryAndFetch({
              from,
              to,
            })
          "
        />
      </div>
    </div>

    <div>
      <q-input v-model="search" placeholder="Search by phone number or ID" />
    </div>

    <OrderList
      :status="statusParam"
      class="col"
      :orders="pagination.data"
      v-if="pagination"
    />
    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import OrderList from "src/components/OrderList.vue";
import useDateFilter from "src/composables/dateFilter";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { localStorage } = useQuasar();
const { vhPage } = useUtil();
const { from, to } = useDateFilter();

const orderMenuStatus = localStorage.getItem("orderMenuStatus");

const status = ref(
  typeof orderMenuStatus == "object" && orderMenuStatus != null
    ? orderMenuStatus
    : {
        pending: true,
        patiallyPaid: true,
        paid: true,
        packed: true,
        onDelivery: true,
        completed: true,
        canceled: true,
      }
);

if (route.query.report) {
  Object.keys(status.value).forEach((key) => {
    if (key == "completed") status.value.completed = true;
    else status.value[key] = false;
  });
}

const statusNumber = {
  pending: 1,
  patiallyPaid: 2,
  paid: 3,
  packed: 6,
  onDelivery: 7,
  completed: 5,
  canceled: 4,
};

const statusParam = computed(() =>
  Object.keys(status.value)
    .filter((e) => status.value[e])
    .map((e) => statusNumber[e])
    .join(",")
);

const { pagination, max, current, total, updateQueryAndFetch } = usePagination(
  "orders",
  {
    status: statusParam.value,
    from: from.value,
    to: to.value,
  }
);
const { search } = useSearchFilter({ updateQueryAndFetch });

watch(
  status,
  () => {
    localStorage.set("orderMenuStatus", status.value);
  },
  {
    deep: true,
  }
);

watch(
  statusParam,
  debounce(() => {
    updateQueryAndFetch({
      status: statusParam.value,
    });
  }, 1000)
);
</script>
