<template>
  <div class="column">
    <div class="text-subtitle1 text-weight-bold text-center">Payment List</div>
    <q-list bordered separator class="overflow-auto col">
      <q-item
        v-for="payment in pagination?.data"
        :key="payment.id"
        :class="{ hidden: !userStore.getUser && payment.status == 2 }"
      >
        <q-item-section>
          <q-item-label>
            {{ payment.number }}
          </q-item-label>
          <q-item-label caption :class="{ 'text-red': payment.status == 2 }">
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
              v-if="
                userStore.getUser &&
                userStore.getUser.roles.map((e) => e.name).includes('admin')
              "
            />
            <q-btn
              round
              :icon="payment.status == 1 ? 'visibility_off' : 'visibility'"
              dense
              @click="togglePayment(payment)"
              v-if="
                userStore.getUser &&
                userStore.getUser.roles.map((e) => e.name).includes('admin')
              "
            />
            <q-btn
              round
              :icon="'qr_code'"
              dense
              @click="showQR(payment)"
              v-if="payment.qr"
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
import { useUserStore } from "src/stores/user-store";

const { api } = useUtil();
const { dialog, notify, localStorage } = useQuasar();
const bus = inject("bus");
const userStore = useUserStore();

const showQR = (payment) => {
  dialog({
    noBackdropDismiss: true,
    title: `QR code for ${payment.payment_type.name} ${payment.number}`,
    message: `<div class="text-center"><img src='${payment.qr}' width='280'><div/>`,
    html: true,
  });
};
const updatePaymentList = (payment) => {
  pagination.value.data.unshift(payment);
  localStorage.set("payments", pagination.value.data);
};
bus.on("paymentCreated", updatePaymentList);

onBeforeUnmount(() => {
  bus.off("paymentCreated", updatePaymentList);
});

const { pagination, max, current } = usePagination("payments");

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

const togglePayment = (payment) => {
  dialog({
    title: "Confirm",
    message: `Do you want to ${
      payment.status == 1 ? "disable" : "enable"
    } the payment`,
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `payments/${payment.id}/toggle`,
    }).then((response) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == response.data.payment.id
      );
      if (index >= 0)
        pagination.value.data.splice(index, 1, response.data.payment);
      notify({
        message: "Updated",
        type: "positive",
      });
    });
  });
};
</script>
