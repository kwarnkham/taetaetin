<template>
  <q-list bordered separator class="overflow-auto">
    <q-item v-for="purchase in purchases" :key="purchase.id">
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
          <q-btn round icon="cancel" dense @click="cancelPurchase(purchase)" />
        </div>
      </q-item-section>
      <q-item-section side top>
        <q-item-label>
          Price: {{ purchase.price.toLocaleString() }}</q-item-label
        >
        <q-item-label>Quantity: {{ purchase.quantity }}</q-item-label>
        <q-item-label
          >Amount:
          {{
            (purchase.quantity * purchase.price).toLocaleString()
          }}</q-item-label
        >
        <q-item-label v-if="purchase.status == 2">
          Status: Canceled
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";

const props = defineProps({
  purchases: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["purchaseUpdated"]);

const { api } = useUtil();
const { dialog } = useQuasar();

const purchaseType = {
  "App\\Models\\AItem": "Item",
  "App\\Models\\Expense": "Expense",
  "App\\Models\\Order": "Order",
};

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
      emit("purchaseUpdated", response.data.purchase);
    });
  });
};
</script>
