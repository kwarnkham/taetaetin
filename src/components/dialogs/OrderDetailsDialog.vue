<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    maximized
    no-route-dismiss
  >
    <div class="q-pa-xs fit bg-white column no-wrap" v-if="order">
      <div class="row q-my-xs q-gutter-xs justify-between">
        <q-btn
          icon="save"
          @click="updateOrder()"
          v-if="[1, 2, 3, 6, 7].includes(order.status)"
        />
        <q-btn
          icon="cleaning_services"
          @click="clearData(orderStore.getExistedOrder)"
          v-if="[1, 2, 3, 6, 7].includes(order?.status)"
        />

        <q-btn
          icon="add_card"
          no-caps
          color="secondary"
          @click="addPurchase()"
          v-if="
            [1, 2, 3, 6, 7].includes(order?.status) &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />

        <q-btn
          icon="backpack"
          no-caps
          color="secondary"
          @click="packOrder"
          v-if="
            order.status == 3 &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />

        <q-btn
          icon="local_shipping"
          no-caps
          color="secondary"
          @click="deliverOrder"
          v-if="
            order.status == 6 &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />

        <q-btn
          label="Expenses"
          no-caps
          color="secondary"
          @click="showExpenses()"
          v-if="
            order.status != 4 &&
            order.purchases.length > 0 &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />

        <q-btn
          icon="done"
          no-caps
          color="positive"
          @click="completeOrder"
          v-if="
            [3, 6, 7].includes(order.status) &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />

        <q-btn
          icon="block"
          no-caps
          color="warning"
          @click="cancelOrder"
          v-if="
            [1, 2, 3, 6, 7].includes(order.status) &&
            userStore.getUser.roles.map((e) => e.name).includes('admin')
          "
        />
        <q-btn
          icon="print"
          no-caps
          color="accent"
          @click="showPrintOrderDialog"
        />
        <q-btn
          icon="pin_drop"
          no-caps
          color="accent"
          @click="showPrintAddressDialog"
        />
        <q-btn
          icon="save"
          no-caps
          color="secondary"
          @click="updateOrderInfo"
          v-if="order.status == 5"
        />
        <q-btn icon="close" @click="onDialogOK(orderStore.getExistedOrder)" />
      </div>
      <div>
        <div class="text-center text-h6">
          #{{ order.id }} ({{
            orderStatuses.find((e) => e.id == order.status).label
          }})
        </div>
        <CustomerInfo v-bind="order" @dataUpdated="syncOrder" />
        <OrderSaleItems
          class="q-mt-xs"
          v-bind="order"
          @dataUpdated="syncOrder"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref, onBeforeUnmount } from "vue";
import { useQuasar, useDialogPluginComponent } from "quasar";
import PrintOrderDialog from "src/components/dialogs/PrintOrderDialog.vue";
import PrintAddressDialog from "src/components/dialogs/PrintAddressDialog.vue";
import { useUserStore } from "src/stores/user-store";
import CustomerInfo from "../CustomerInfo.vue";
import OrderSaleItems from "../OrderSaleItems.vue";
import useOrder from "src/composables/order";
import { useOrderStore } from "src/stores/order-store";
import OrderExpenseDialog from "./OrderExpenseDialog.vue";

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
});
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { localStorage, dialog } = useQuasar();
const orderStore = useOrderStore();
const { api } = useUtil();
const order = ref(null);

const { syncOrder, saveOrder, clearData, assignOrder, resetData } =
  useOrder(order);
const updateOrder = () => {
  saveOrder(true).then((response) => {
    assignOrder(response.data.order);
  });
};
const orderStatuses = localStorage.getItem("orderStatuses");
const userStore = useUserStore();

const showExpenses = () => {
  dialog({
    component: OrderExpenseDialog,
    componentProps: {
      purchases: order.value.purchases,
    },
  }).onOk((purchases) => {
    order.value.purchases = purchases;
  });
};

const updateOrderInfo = () => {
  api(
    {
      method: "PUT",
      url: "orders/" + order.value.id,
      data: {
        customer: order.value.customer,
        phone: order.value.phone,
        address: order.value.address,
        note: order.value.note,
      },
    },
    true
  ).then((response) => {
    assignOrder(response.data.order);
  });
};

const addPurchase = () => {
  dialog({
    title: "Expense for order",
    message: "Name",
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      isValid: (v) => v != "",
    },
  }).onOk((name) => {
    dialog({
      title: "Expense for order",
      message: "Amount",
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: "",
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9*]",
        isValid: (v) => v != "" && v > 0,
      },
    }).onOk((price) => {
      dialog({
        title: "Expense for order",
        message: "Quantity",
        position: "top",
        noBackdropDismiss: true,
        cancel: true,
        prompt: {
          model: "1",
          type: "number",
          inputmode: "numeric",
          pattern: "[0-9*]",
          isValid: (v) => v != "" && v > 0,
        },
      }).onOk((quantity) => {
        api({
          method: "POST",
          url: `orders/${order.value.id}/purchase`,
          data: {
            name,
            price,
            quantity,
          },
        }).then((response) => {
          assignOrder(response.data.order);
        });
      });
    });
  });
};
const showPrintOrderDialog = () => {
  dialog({
    component: PrintOrderDialog,
    componentProps: {
      order: order.value,
    },
  });
};

const showPrintAddressDialog = () => {
  dialog({
    component: PrintAddressDialog,
    componentProps: {
      order: order.value,
    },
  });
};
const cancelOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to cancel the order?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    saveOrder(true, 4).then((response) => {
      assignOrder(response.data.order);
    });
  });
};

const completeOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to complete the order?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    saveOrder(true, 5).then((response) => {
      assignOrder(response.data.order);
    });
  });
};

const packOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to pack the order?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    saveOrder(true, 6).then((response) => {
      assignOrder(response.data.order);
    });
  });
};

const deliverOrder = () => {
  dialog({
    title: "Confirmation",
    message: "Do you want to delivery the order?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    saveOrder(true, 7).then((response) => {
      assignOrder(response.data.order);
    });
  });
};

api({
  method: "GET",
  url: "orders/" + props.orderId,
}).then((response) => {
  assignOrder(response.data.order);
});

onBeforeUnmount(() => {
  orderStore.setExistedItems([]);
  orderStore.setExistedOrder(null);
});
</script>
