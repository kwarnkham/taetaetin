<template>
  <div class="full-height column">
    <div v-if="total" class="text-center text-h6 text-weight-bold">
      Total: {{ total.toLocaleString() }} MMK
    </div>
    <div>
      <q-input v-model.trim="search" label="Search" />
    </div>
    <div class="row">
      <div class="col">
        <q-checkbox left-label v-model="canceled" label="Only Canceled" />
      </div>

      <q-select
        :options="purchaseTypes"
        emit-value
        option-value="value"
        option-label="label"
        label="Type"
        v-model="type"
        class="col"
        map-options
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
        <q-btn icon="search" @click="searchByDates" />
      </div>
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="purchase in pagination?.data" :key="purchase.id">
        <q-item-section>
          <q-item-label>
            <span>
              {{ purchase.name }}
            </span>
            <span
              v-if="
                purchase.name &&
                purchase.purchasable.name &&
                purchase.name != purchase.purchasable.name
              "
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
import { debounce, useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import { useRoute } from "vue-router";
import useSearchFilter from "src/composables/searchFilter";
import { ref, watch } from "vue";
import useDateFilter from "src/composables/dateFilter.js";
import { date } from "quasar";
const { formatDate } = date;

const props = defineProps({
  hasDateFilter: {
    type: Boolean,
    default: false,
  },
});

const purchaseTypes = [
  { label: "All", value: "All" },
  { label: "Item", value: "App\\Models\\AItem" },
  { label: "Expense", value: "App\\Models\\Expense" },
  { label: "Order", value: "App\\Models\\Order" },
];
const { api } = useUtil();
const { dialog, notify, screen } = useQuasar();
const route = useRoute();
const type = ref(route.query.type ?? "All");
const group = ref(route.query.group ?? "");
watch(type, () => {
  updateQueryAndFetch({
    type: type.value == "All" ? undefined : type.value,
  });
});
const purchaseType = {
  "App\\Models\\AItem": "Item",
  "App\\Models\\Expense": "Expense",
  "App\\Models\\Order": "Order",
};
const assignGroup = (purchase) => {
  dialog({
    title: `Add to group`,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
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

const canceled = ref(route.query.status == 2 ? true : false);

watch(canceled, () => {
  updateQueryAndFetch({ status: canceled.value ? 2 : 1 });
});

watch(
  group,
  debounce(() => {
    updateQueryAndFetch({ group: group.value || undefined });
  }, 1000)
);

const { pagination, max, current, total, updateQueryAndFetch } = usePagination(
  "purchases",
  {
    status: canceled.value ? 2 : 1,
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
    group: group.value || undefined,
  }
);

const { search } = useSearchFilter({ updateQueryAndFetch });

const { from, to, searchByDates } = useDateFilter({ updateQueryAndFetch });

const cancelPurchase = (purchase) => {
  dialog({
    title: "Confirmation",
    message: "Do you want to cancel?",
    noBackdropDismiss: true,
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
