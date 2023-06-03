<template>
  <q-page padding class="column" :style-fn="vhPage">
    <div class="row justify-between q-gutter-y-xs">
      <q-checkbox
        v-for="status in statuses"
        :key="status.id"
        dense
        v-model="status.value"
        :label="$t(status.translateKey)"
        :disable="String(statusParam).length == 1 && status.value"
      />
    </div>

    <div v-if="total" class="text-center text-subtitle2 q-mt-sm">
      {{ $t("total") }}: {{ total.toLocaleString() }} {{ $t("mmk") }}
    </div>

    <div
      class="row justify-between items-end q-pa-xs"
      :class="{ 'bg-info rounded-borders': $route.query.report }"
    >
      <q-input v-model="from" type="date" :label="$t('from')" class="col" />
      <q-separator vertical spaced />
      <q-input v-model="to" type="date" :label="$t('to')" class="col" />
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
      <q-input v-model="search" :placeholder="$t('searchByPhoneNumberOrID')" />
    </div>

    <OrderList
      :status="statusParam"
      class="col"
      :orders="pagination.data"
      @order-updated="updateOrder"
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

const orderStatuses = localStorage.getItem("orderStatuses");
const setting = localStorage.getItem("setting");
const selectedStatuses = localStorage.getItem("selectedStatuses");

const statuses = ref(
  orderStatuses
    .filter((e) =>
      setting.active_order_status.split(",").includes(String(e.id))
    )
    .map((e) => ({
      ...e,
      value: true,
      translateKey: e.label
        .split(" ")
        .map((e, index) =>
          index == 0
            ? e.toLowerCase()
            : e.toLowerCase().charAt(0).toUpperCase() + e.slice(1)
        )
        .join(""),
    }))
);
if (selectedStatuses)
  selectedStatuses.forEach((e) => {
    const index = statuses.value.findIndex((el) => el.id == e.id);
    if (index != -1) statuses.value[index].value = e.value;
  });

if (route.query.report) {
  statuses.value.forEach((e) => {
    if (e.id == 5) e.value = true;
    else e.value = false;
  });
}

const { from, to } = useDateFilter(
  route.query.report ? new Date().getMonth() : undefined
);

const statusParam = computed(() =>
  statuses.value
    .filter((e) => e.value)
    .map((el) => el.id)
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

const updateOrder = (order) => {
  const index = pagination.value.data.findIndex((e) => e.id == order.id);
  pagination.value.data[index] = order;
};

watch(
  statuses,
  () => {
    localStorage.set("selectedStatuses", statuses.value);
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
