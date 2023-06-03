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
          {{ $t("type") }}: {{ purchaseType[purchase.purchasable_type] }}
        </q-item-label>
        <q-item-label v-if="purchase.note">
          {{ $t("note") }}: {{ purchase.note }}
        </q-item-label>
        <div
          class="row justify-start q-gutter-x-sm q-mt-sm"
          v-if="purchase.status != 2"
        >
          <q-btn round icon="cancel" dense @click="cancel(purchase)" />
        </div>
      </q-item-section>
      <q-item-section side top>
        <q-item-label>
          {{ $t("price") }} :
          {{ purchase.price.toLocaleString() }}
        </q-item-label>
        <q-item-label>
          {{ $t("quantity") }} : {{ purchase.quantity }}
        </q-item-label>
        <q-item-label>
          {{ $t("amount") }} :
          {{ (purchase.quantity * purchase.price).toLocaleString() }}
        </q-item-label>
        <q-item-label v-if="purchase.status == 2">
          {{ $t("status") }} : {{ $t("canceled") }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import usePurchase from "src/composables/purchase";
import { useI18n } from "vue-i18n";

const props = defineProps({
  purchases: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["purchaseUpdated"]);

const { cancelPurchase } = usePurchase();

const cancel = (purchase) => {
  cancelPurchase(purchase).then((purchase) => {
    emit("purchaseUpdated", purchase);
  });
};

const { t } = useI18n();
const purchaseType = {
  "App\\Models\\AItem": t("product"),
  "App\\Models\\Expense": t("expense"),
  "App\\Models\\Order": t("order"),
};
</script>
