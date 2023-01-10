<template>
  <div class="column">
    <div class="text-subtitle1 text-weight-bold text-center">Payment List</div>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="payment in pagination?.data" :key="payment.id">
        <q-item-section>
          <q-item-label>
            {{ payment.number }}
          </q-item-label>
          <q-item-label caption>
            {{ payment.payment_type.name }}
          </q-item-label>
          <q-item-label>
            {{ payment.account_name }}
          </q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn
              round
              icon="edit"
              dense
              @click="showEditPayment(payment)"
              :disabled="payment.payment_type.id == 1"
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
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import EditPaymentDialog from "src/components/dialogs/EditPaymentDialog.vue";
import { inject, onBeforeUnmount } from "vue";

const { api } = useUtil();
const { dialog } = useQuasar();
const bus = inject("bus");

const updatePaymentList = (payment) => {
  pagination.value.data.unshift(payment);
};
bus.on("paymentCreated", updatePaymentList);

onBeforeUnmount(() => {
  bus.off("paymentCreated", updatePaymentList);
});

const fetchPayments = () => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "payments",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, current } = usePagination(fetchPayments);

const showEditPayment = (payment) => {
  dialog({
    component: EditPaymentDialog,
    componentProps: {
      payment,
    },
  }).onOk((updatedPayment) => {
    const index = pagination.value.data.findIndex((e) => e.id == payment.id);
    if (index >= 0) pagination.value.data.splice(index, 1, updatedPayment);
  });
};
</script>
