<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="top"
  >
    <q-card class="q-dialog-plugin q-pa-sm">
      <div class="text-right">
        <q-btn icon="close" flat @click="onDialogOK(activePurchases)" />
      </div>
      <q-list dense bordered padding>
        <q-item v-for="purchase in activePurchases" :key="purchase.id">
          <q-item-section>
            <q-item-label>
              {{ purchase.name }}
            </q-item-label>
            <q-item-label>
              {{ purchase.price }} x {{ purchase.quantity }}
            </q-item-label>
            <div class="q-mt-sm">
              <q-btn label="Cancel" no-caps outline @click="cancel(purchase)" />
            </div>
          </q-item-section>
          <q-item-section side top>
            <q-item-label>
              {{ (purchase.quantity * purchase.price).toLocaleString() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import usePurchase from "src/composables/purchase";
import { computed, ref } from "vue";

const props = defineProps({
  purchases: {
    type: Array,
    required: true,
  },
});

const { cancelPurchase } = usePurchase();

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
  "purchaseCanceled",
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const canceledPurchases = ref([]);

const activePurchases = computed(() => {
  return props.purchases.filter(
    (purchase) => !canceledPurchases.value.includes(purchase.id)
  );
});

const cancel = (purchase) => {
  cancelPurchase(purchase).then((purchase) => {
    canceledPurchases.value.push(purchase.id);
    if (activePurchases.value.length == 0) onDialogOK([]);
  });
};
</script>
