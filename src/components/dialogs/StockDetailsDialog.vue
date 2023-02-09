<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    position="bottom"
  >
    <q-card
      class="q-dialog-plugin q-pa-sm"
      style="width: 500px; max-width: 100vw"
    >
      <div class="text-right">
        <q-btn icon="close" flat @click="onDialogCancel" />
      </div>
      <div>
        <div class="text-center">
          Total {{ product.batches.reduce((carry, e) => e.stock + carry, 0) }}
        </div>
        <q-card v-for="batch in product.batches" :key="batch.id">
          <q-card-section>
            <div>
              Added on : {{ new Date(batch.created_at).toLocaleString() }}
            </div>
            <div>Stock : {{ batch.stock }}</div>
            <div v-if="batch.expired_on">
              Expire date:{{ batch.expired_on }}
            </div>
            <div class="text-right">
              <q-btn
                icon="remove"
                flat
                @click="editStock(batch, 1)"
                :disabled="batch.stock < 1"
              />
              <q-btn icon="add" flat @click="editStock(batch, 2)" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import useUtil from "src/composables/util";

const { dialog } = useQuasar();
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const { api } = useUtil();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const editStock = (batch, type) => {
  dialog({
    title: `${type == 1 ? "Remove" : "Add"} the stock of product ${
      props.product.name
    }`,
    position: "bottom",
    prompt: {
      model: "",
      type: "tel",
      isValid: (val) => {
        if (type == 1) return val <= props.product.stock && val != "";
        else return true;
      },
    },
    noBackdropDismiss: true,
    cancel: true,
  }).onOk((value) => {
    api({
      method: "POST",
      url: `batches/${batch.id}/correct`,
      data: {
        stock: value,
        type: type, //1 reduce , 2 addd,
      },
    }).then((response) => {
      onDialogOK(response.data.feature);
    });
  });
};
</script>
