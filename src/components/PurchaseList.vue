<template>
  <div class="full-height column">
    <div v-if="total">Total: {{ total.toLocaleString() }} MMK</div>
    <div>
      <q-input v-model.trim="search" label="Search" />
    </div>
    <div class="row">
      <div class="col">
        <q-checkbox left-label v-model="canceled" label="Include Canceled" />
      </div>

      <q-select
        :options="purchaseTypes"
        label="Type"
        v-model="type"
        class="col"
      />
    </div>
    <div>
      <q-input v-model.trim="group" label="Group" />
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
        <q-btn icon="search" @click="findByDates" />
      </div>
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="purchase in pagination?.data" :key="purchase.id">
        <q-item-section>
          <q-item-label>
            <span>
              {{ purchase.name || purchase.purchasable.name }}
            </span>
            <span
              v-if="purchase.name && purchase.name != purchase.purchasable.name"
              class="text-overline"
            >
              ({{ purchase.purchasable.name }})
            </span>
          </q-item-label>
          <q-item-label caption v-if="purchase.purchasable.item">
            {{ purchase.purchasable.item?.name }}
          </q-item-label>
          <q-item-label>
            Type: {{ purchaseType[purchase.purchasable_type] }}
          </q-item-label>
          <q-item-label v-if="purchase.note">
            Note: {{ purchase.note }}
          </q-item-label>
          <div
            class="row justify-start q-gutter-x-sm q-mt-sm"
            v-if="purchase.status != 2"
          >
            <q-btn
              round
              icon="cancel"
              dense
              @click="cancelPurchase(purchase)"
            />
            <q-btn
              round
              :label="purchase.group ?? 'G'"
              dense
              @click="assignGroup(purchase)"
            />
          </div>
        </q-item-section>
        <q-item-section side top>
          <q-item-label
            >Price: {{ purchase.price.toLocaleString() }}</q-item-label
          >
          <q-item-label>Quantity: {{ purchase.quantity }}</q-item-label>
          <q-item-label v-if="purchase.status == 2">
            Status: Canceled
          </q-item-label>
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
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import { useRoute } from "vue-router";

const props = defineProps({
  hasDateFilter: {
    type: Boolean,
    default: false,
  },
});
const purchaseTypes = ["All", "Feature", "Expense"];
const { api } = useUtil();
const { dialog, notify, screen } = useQuasar();
const route = useRoute();
const purchaseType = {
  "App\\Models\\Feature": "Product",
  "App\\Models\\Expense": "Expense",
};
const assignGroup = (purchase) => {
  dialog({
    title: `Add to group`,
    persistent: true,
    cancel: true,
    position: "bottom",
    prompt: {
      model: "",
      type: "tel",
      isValid: (val) => !isNaN(Number(val)) && val != "",
    },
  }).onOk((val) => {
    api({
      method: "POST",
      url: `purchases/${purchase.id}/group`,
      data: {
        group: val,
      },
    }).then((response) => {
      const index = pagination.value.data.findIndex((e) => e.id == purchase.id);
      if (index >= 0)
        pagination.value.data[index].group = response.data.purchase.group;
    });
  });
};
const fetchPurchases = (params = {}) => {
  if (params.canceled != "true") {
    params.status = 1;
  }
  const types = {
    All: undefined,
    Feature: "App\\Models\\Feature",
    Expense: "App\\Models\\Expense",
  };

  params.type = types[params.type];

  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "purchases",
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

const {
  pagination,
  max,
  search,
  current,
  findByDates,
  from,
  to,
  total,
  canceled,
  type,
  group,
} = usePagination(fetchPurchases, {
  hasDateFilter: props.hasDateFilter,
  canceled: route.query.canceled == "true" ? true : false,
  type: route.query.type ?? "All",
  group: route.query.group ?? null,
});

const cancelPurchase = (purchase) => {
  dialog({
    title: "Confirmation",
    message: "Do you want to cancel?",
    persistent: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `purchases/${purchase.id}/cancel`,
    }).then((response) => {
      const index = pagination.value.data.findIndex((e) => e.id == purchase.id);
      if (index >= 0) {
        if (!canceled.value) {
          pagination.value.data.splice(index, 1);
        } else {
          pagination.value.data[index].status = 2;
        }
      }

      notify({
        message: response.data.message,
        type: "positive",
      });
    });
  });
};
</script>
