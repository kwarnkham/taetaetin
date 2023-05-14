<template>
  <q-page padding class="column" :style-fn="vhPage">
    <div v-if="total" class="text-center text-h6 text-weight-bold">
      Total:
      {{
        (
          total -
          pagination.data.reduce(
            (carry, e) => carry + (e.status == 1 ? 0 : e.quantity * e.price),
            0
          )
        ).toLocaleString()
      }}
      MMK
    </div>
    <div>
      <q-input v-model.trim="search" label="Search" dense />
    </div>
    <div class="row justify-between items-end">
      <q-input v-model="from" type="date" label="From" class="col" dense />
      <q-separator vertical spaced />
      <q-input v-model="to" type="date" label="To" class="col" dense />
      <div class="q-my-sm">
        <q-btn icon="search" @click="updateQueryAndFetch({ from, to })" flat />
      </div>
    </div>
    <q-select
      dense
      :options="purchaseTypes"
      emit-value
      option-value="value"
      option-label="label"
      label="Type"
      v-model="type"
      map-options
    />
    <PurchaseList
      class="col"
      :purchases="pagination.data"
      v-if="pagination"
      @purchase-updated="updatePurchases"
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
import PurchaseList from "src/components/PurchaseList.vue";
import usePagination from "src/composables/pagination";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import useSearchFilter from "src/composables/searchFilter";
import useDateFilter from "src/composables/dateFilter";
import { watch, ref } from "vue";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();
const route = useRoute();
const type = ref(route.query.type ?? "All");
const purchaseTypes = [
  { label: "All", value: "All" },
  { label: "Item", value: "App\\Models\\AItem" },
  { label: "Expense", value: "App\\Models\\Expense" },
  { label: "Order", value: "App\\Models\\Order" },
];
const { screen } = useQuasar();
const { from, to } = useDateFilter(new Date().getMonth());
const { pagination, max, current, total, updateQueryAndFetch } = usePagination(
  "purchases",
  {
    from: route.query.from ?? from.value,
    to: route.query.to ?? to.value,
    status: "1",
  }
);

const { search } = useSearchFilter({ updateQueryAndFetch });

const updatePurchases = (purchase) => {
  const index = pagination.value.data.findIndex((e) => e.id == purchase.id);
  pagination.value.data[index] = purchase;
};

watch(type, () => {
  updateQueryAndFetch({
    type: type.value == "All" ? undefined : type.value,
  });
});
</script>
