<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <div class="text-right">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>
      <div>
        <div class="text-center">
          Total {{ batches.reduce((carry, e) => e.stock + carry, 0) }}
        </div>
        <q-card v-for="batch in batches" :key="batch.id">
          <q-card-section>
            <div>Stock:{{ batch.stock }}</div>
            <div v-if="batch.expired_on">
              Expire date:{{ batch.expired_on }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({
  batches: {
    type: Array,
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
