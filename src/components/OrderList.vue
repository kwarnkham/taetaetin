<template>
  <div class="full-height column">
    <template v-if="hasDateFilter">
      <div v-if="total" class="text-center text-subtitle2 q-mt-sm">
        Total: {{ total.toLocaleString() }} MMK
      </div>
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
          <q-btn
            icon="search"
            @click="
              updateQueryAndFetch({
                from,
                to,
              })
            "
          />
        </div>
      </div>
    </template>
    <div v-if="hasSearch">
      <q-input v-model="search" placeholder="Search by phone number or ID" />
    </div>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="order in pagination?.data" :key="order.id">
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
              {{ orderStatus[order.status] }}
            </span>
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
              @click="showOrderDetails(order)"
            />
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
import usePagination from "src/composables/pagination";
import { useQuasar, date, debounce } from "quasar";
import OrderDetailsDialog from "./dialogs/OrderDetailsDialog.vue";
import useSearchFilter from "src/composables/searchFilter";
import useDateFilter from "src/composables/dateFilter";
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  hasDateFilter: { type: Boolean, default: false },
  status: { required: false },
  hasSearch: { type: Boolean, default: false },
});
const { formatDate } = date;
const { localStorage, screen, dialog } = useQuasar();
const orderStatus = localStorage.getItem("orderStatus");

const showOrderCustomer = (order) => {
  dialog({
    noBackdropDismiss: true,
    title: order.customer,
    message: `<div>Phone : ${order.phone}. </div>
              <div>Address : ${order.address}.</div>
              <div>Note :${order.note ?? ""}</div>`,
    html: true,
  });
};

const showOrderDetails = (order) => {
  dialog({
    component: OrderDetailsDialog,
    componentProps: {
      orderId: order.id,
    },
  }).onOk((val) => {
    const key = pagination.value.data.findIndex((e) => e.id == val.id);
    pagination.value.data[key] = val;
  });
};

const { pagination, max, current, total, updateQueryAndFetch } = usePagination(
  "orders",
  {
    status: props.status,
    from: props.hasDateFilter
      ? route.query.from ??
        formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          "YYYY-MM-DD"
        )
      : undefined,
    to: props.hasDateFilter
      ? route.query.to ??
        formatDate(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          "YYYY-MM-DD"
        )
      : undefined,
  }
);

const { search } = useSearchFilter({ updateQueryAndFetch });

const { from, to } = useDateFilter(new Date().getMonth());

watch(
  props,
  debounce(() => {
    updateQueryAndFetch({ status: props.status || undefined });
  }, 800)
);
</script>
