<template>
  <q-page padding class="column">
    <div class="row justify-between">
      <q-checkbox
        v-model="status.pending"
        label="Pending"
        :disable="String(statusParam).length == 1 && status.pending"
      />
      <q-checkbox
        v-model="status.patiallyPaid"
        label="Partial Paid"
        :disable="String(statusParam).length == 1 && status.patiallyPaid"
      />
      <q-checkbox
        v-model="status.paid"
        label="Paid"
        :disable="String(statusParam).length == 1 && status.paid"
      />
      <q-checkbox
        v-model="status.packed"
        label="Packed"
        :disable="String(statusParam).length == 1 && status.packed"
      />
      <q-checkbox
        v-model="status.onDelivery"
        label="On Delivery"
        :disable="String(statusParam).length == 1 && status.onDelivery"
      />
      <q-checkbox
        v-model="status.completed"
        label="Completed"
        :disable="String(statusParam).length == 1 && status.completed"
      />
      <q-checkbox
        v-model="status.canceled"
        label="Canceled"
        :disable="String(statusParam).length == 1 && status.canceled"
      />
    </div>
    <OrderList :status="statusParam" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import OrderList from "src/components/OrderList.vue";
import { computed, ref, watch } from "vue";

const { localStorage } = useQuasar();
const orderMenuStatus = localStorage.getItem("orderMenuStatus");
const status = ref(
  typeof orderMenuStatus == "object"
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

watch(
  status,
  () => {
    localStorage.set("orderMenuStatus", status.value);
  },
  {
    deep: true,
  }
);
</script>
