<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <div class="q-pa-xs fit bg-white column no-wrap" v-if="order">
      <div class="row q-mb-xs q-gutter-x-md q-gutter-y-sm justify-between">
        <q-btn
          icon="save"
          @click="updateOrder()"
          v-if="[1, 2, 3, 6, 7].includes(order.status)"
          :disable="!isDirty"
          :color="isDirty ? 'primary' : 'grey'"
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

        <q-btn icon="note" no-caps color="accent">
          <q-popup-proxy v-model="dialogModel">
            <q-dialog position="top" v-model="dialogModel" no-backdrop-dismiss>
              <q-card>
                <q-card-section>
                  <q-editor v-model="editor" min-height="5rem" />
                </q-card-section>
                <q-card-actions>
                  <q-btn icon="print" @click="printNote" />
                  <q-btn icon="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-popup-proxy>
        </q-btn>

        <q-btn
          icon="save"
          no-caps
          color="secondary"
          @click="updateOrderInfo"
          v-if="order.status == 5"
          :disable="!orderInfoIsDirty"
        />

        <q-btn
          icon="content_copy"
          no-caps
          color="light-blue"
          @click="copyOrder"
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
          :class="{ 'no-pointer-events': [4, 5].includes(order.status) }"
          v-bind="order"
          @dataUpdated="syncOrder"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref, onBeforeUnmount, computed } from "vue";
import { useQuasar, useDialogPluginComponent } from "quasar";
import PrintOrderDialog from "src/components/dialogs/PrintOrderDialog.vue";
import PrintAddressDialog from "src/components/dialogs/PrintAddressDialog.vue";
import { useUserStore } from "src/stores/user-store";
import CustomerInfo from "../CustomerInfo.vue";
import OrderSaleItems from "../OrderSaleItems.vue";
import useOrder from "src/composables/order";
import { useOrderStore } from "src/stores/order-store";
import OrderExpenseDialog from "./OrderExpenseDialog.vue";
import { useI18n } from "vue-i18n";
import usePrinter from "src/composables/printer";

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
});
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { sendPrinterData, getPrintWidth, sendTextData } = usePrinter();

const { t } = useI18n();
const { localStorage, dialog } = useQuasar();
const orderStore = useOrderStore();
const { api } = useUtil();
const order = ref(null);
const editor = ref(localStorage.getItem("printNote") ?? "");
const dialogModel = ref(false);

const { syncOrder, saveOrder, clearData, assignOrder } = useOrder(order);
const updateOrder = () => {
  saveOrder(true).then((response) => {
    assignOrder(response.data.order);
  });
};

const printNote = () => {
  localStorage.set("printNote", editor.value);
  const el = document.createElement("div");
  el.innerHTML = editor.value;
  el.style.width = getPrintWidth() + "px";
  el.style.color = "grey";
  el.style.fontSize = "24px";
  document.body.appendChild(el);
  sendPrinterData({ node: el }).then(() => {
    sendTextData("");
    el.remove();
  });
};
const orderStatuses = localStorage.getItem("orderStatuses");
const userStore = useUserStore();

const copyOrder = () => {
  localStorage.set("copiedOrder", order.value);
  onDialogOK("copyOrder");
};

const showExpenses = () => {
  dialog({
    component: OrderExpenseDialog,
    componentProps: {
      purchases: order.value.purchases,
      orderStatus: order.value.status,
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
    title: t("expenseOfOrder"),
    message: t("name"),
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      isValid: (v) => v != "",
    },
  }).onOk((name) => {
    dialog({
      title: t("expenseOfOrder"),
      message: t("amount"),
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
        title: t("expenseOfOrder"),
        message: t("quantity"),
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
          order.value.purchases = response.data.order.purchases;
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
    title: t("confirmation"),
    message: t("doYouWantToCancelTheOrder") + "?",
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
    title: t("confirmation"),
    message: t("doYouWantToCompleteTheOrder") + "?",
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
    title: t("confirmation"),
    message: t("doYouWantToPackTheOrder") + "?",
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
    title: t("confirmation"),
    message: t("doYouWantToDeliverTheOrder") + "?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    saveOrder(true, 7).then((response) => {
      assignOrder(response.data.order);
    });
  });
};

const orderInfoIsDirty = computed(
  () =>
    order.value.phone != orderStore.getExistedOrder.phone ||
    order.value.customer != orderStore.getExistedOrder.customer ||
    order.value.address != orderStore.getExistedOrder.address ||
    order.value.note != orderStore.getExistedOrder.note ||
    order.value.created_at != orderStore.getExistedOrder.created_at ||
    order.value.discount != orderStore.getExistedOrder.discount ||
    order.value.paid != orderStore.getExistedOrder.paid
);
const isDirty = computed(() => {
  if (
    orderStore.getExistedItems.length !=
      order.value.a_items.filter((e) => !!e).length ||
    orderInfoIsDirty.value
  )
    return true;
  else {
    const index = orderStore.getExistedItems.findIndex(
      (item, key) =>
        order.value.a_items[key].quantity != item.quantity ||
        order.value.a_items[key].discount != item.discount
    );
    return index != -1;
  }
});

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
