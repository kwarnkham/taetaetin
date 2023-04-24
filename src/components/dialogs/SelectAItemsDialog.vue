<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    full-height
    no-route-dismiss
    class="column"
  >
    <div
      class="q-dialog-plugin q-pa-sm col column no-wrap bg-white"
      style="width: 500px; max-width: 100vw"
    >
      <div class="row justify-between items-center">
        <div class="text-weight-bold text-subtitle1">Select Item for Sale</div>
        <q-btn icon="close" flat @click="onDialogCancel" dense />
      </div>
      <div class="col column">
        <q-input label="Prodcut Name" v-model.trim="search" autofocus />
        <q-list
          v-if="saleItems.length"
          class="overflow-auto col"
          padding
          separator
          bordered
        >
          <q-item
            v-for="aItem in saleItems"
            :key="aItem.id"
            clickable
            @click="onDialogOK(aItem)"
            :disable="aItem.realStock < 1"
          >
            <q-item-section>
              <div :class="{ 'text-primary': aItem.isInOrder }">
                {{ aItem.name }}
              </div>
              <q-item-label overline>{{ aItem.price }}</q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
              :class="{ 'text-red': aItem.realStock < 1 }"
            >
              Stock:{{ aItem.realStock }}
            </q-item-section>
          </q-item>
        </q-list>
        <div
          class="text-right q-mt-sm"
          v-else-if="pagination && pagination.data.length == 0 && search"
        >
          <q-btn no-caps flat @click="showCreateAItem">
            Create new aItem "{{ search }}"
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useSearchFilter from "src/composables/searchFilter";
import useUtil from "src/composables/util";
import { computed } from "vue";

const { dialog } = useQuasar();
const { api } = useUtil();
const props = defineProps({
  aItems: {
    type: Array,
    required: true,
  },
});

const getRealStock = (aItem) => {
  const existed = props.aItems.reduce((carry, e) => {
    if (aItem.id == e.id) return e.quantity + carry;
    else return carry;
  }, 0);
  return aItem.stock - existed;
};

const isInOrder = (aItem) => {
  return props.aItems.map((e) => e.id).includes(aItem.id);
};

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { pagination, updateQueryAndFetch } = usePagination("a-items");
const { search } = useSearchFilter({ updateQueryAndFetch });

const saleItems = computed(() => {
  if (!pagination.value) return [];
  else
    return pagination.value.data.map((e) => ({
      ...e,
      realStock: getRealStock(e),
      isInOrder: isInOrder(e),
    }));
});

const showCreateAItem = () => {
  dialog({
    title: `What is the purchase price for ${search.value}?`,
    message: "After this you'll be asked to fill sale price",
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      placeholder: "Purchase Price",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) => val != "" && val >= 0,
    },
  }).onOk((purchasePrice) => {
    dialog({
      title: `What is the sale price for ${search.value}?`,
      message: "After this you'll be asked to fill stock quantity",
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: "",
        placeholder: "Sale Price",
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        isValid: (val) => val != "" && val >= 0,
      },
    }).onOk((salePrice) => {
      dialog({
        title: `How many of ${search.value} is going to inventory?`,
        message: "After this you'll be asked to fill note for this purchase",
        position: "top",
        noBackdropDismiss: true,
        cancel: true,
        prompt: {
          model: "",
          placeholder: "Quantity",
          type: "number",
          inputmode: "numeric",
          pattern: "[0-9]*",
          isValid: (val) => val != "" && val > 0,
        },
      }).onOk((quantity) => {
        dialog({
          title: `Do you have note for the purchase of ${search.value}?`,
          message: "After this you'll be asked to fill expired date",
          position: "top",
          noBackdropDismiss: true,
          cancel: true,
          prompt: {
            model: "",
            type: "textarea",
            placeholder: "Note",
          },
        }).onOk((note) => {
          console.log({
            name: search.value,
            purchasePrice,
            salePrice,
            quantity,
            note: note || undefined,
          });
          const data = {
            name: search.value,
            purchase_price: purchasePrice,
            price: salePrice,
            stock: quantity,
            note: note || undefined,
          };
          api(
            {
              method: "POST",
              url: "a-items",
              data,
            },
            true
          ).then((response) => {
            pagination.value.data.unshift(response.data.a_item);
          });
        });
      });
    });
  });
};
</script>
