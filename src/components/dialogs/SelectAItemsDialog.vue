<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    maximized
    no-route-dismiss
    class="full-height"
    position="bottom"
  >
    <div
      class="q-dialog-plugin q-pa-sm window-height column no-wrap bg-white"
      style="width: 500px; max-width: 100vw"
    >
      <div class="row justify-between items-center">
        <div class="text-weight-bold text-subtitle1">Select Item for Sale</div>
        <q-btn icon="close" flat @click="onDialogCancel" dense />
      </div>
      <div class="col column">
        <q-input label="Prodcut Name" v-model="search" autofocus />
        <q-list
          v-if="saleItems.length"
          class="overflow-auto col"
          padding
          separator
          bordered
        >
          <q-item v-for="a_item in saleItems" :key="a_item.id">
            <q-item-section>
              <div :class="{ 'text-primary': a_item.isInOrder }">
                {{ a_item.name }}
              </div>
              <q-item-label overline>{{ a_item.price }}</q-item-label>
              <div class="q-mt-sm q-gutter-x-xs">
                <q-btn
                  label="Select"
                  no-caps
                  @click="onDialogOK(a_item)"
                  :disable="a_item.realStock < 1 && a_item.type == 1"
                  :color="
                    a_item.realStock || a_item.type == 2 ? 'primary' : 'grey'
                  "
                />
                <q-btn
                  label="Re-stock"
                  no-caps
                  @click="addStock(a_item)"
                  color="secondary"
                  v-if="a_item.type == 1"
                />
              </div>
            </q-item-section>
            <q-item-section
              side
              top
              :class="{ 'text-red': a_item.realStock < 1 }"
            >
              <span v-if="a_item.type == 1">
                Stock:{{ a_item.realStock }}
              </span>
              <span v-else class="text-grey"> Non stocked item </span>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section></q-item-section>
            <q-item-section side top>
              <q-btn
                no-caps
                flat
                @click="showCreateAItem"
                v-if="!saleItems.map((e) => e.name).includes(search)"
              >
                Create new item "{{ search }}"
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          class="text-right q-mt-sm"
          v-else-if="pagination && pagination.data.length == 0 && search"
        >
          <q-btn no-caps flat @click="showCreateAItem()">
            Create new item "{{ search }}"
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
import useItem from "src/composables/item";
import { useOrderStore } from "src/stores/order-store";
import { computed } from "vue";

const { dialog } = useQuasar();
const { api } = useUtil();
const { reStock } = useItem();

const addStock = (aItem) => {
  reStock(aItem).then((response) => {
    const index = pagination.value.data.findIndex(
      (e) => e.id == response.data.a_item.id
    );
    pagination.value.data[index] = response.data.a_item;
  });
};
const props = defineProps({
  a_items: {
    type: Array,
    required: true,
  },
});

const orderStore = useOrderStore();

const getRealStock = (a_item) => {
  let existed = props.a_items.reduce((carry, e) => {
    if (a_item.id == e?.id) return e.quantity + carry;
    else return carry;
  }, 0);

  existed -= orderStore.getExistedItems.reduce((carry, e) => {
    if (a_item.id == e?.id) return e.quantity + carry;
    else return carry;
  }, 0);

  return a_item.stock - existed;
};

const isInOrder = (a_item) => {
  return props.a_items.map((e) => e?.id).includes(a_item.id);
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
    title: "Choose item type",
    options: {
      type: "radio",
      model: "1",
      items: [
        { label: "Stocked", value: "1" },
        { label: "Non Stocked", value: "2" },
      ],
    },
  }).onOk((type) => {
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
      if (type == "1")
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
            title: `How many of ${search.value} is going to inventory?`,
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
            const data = {
              name: search.value,
              purchase_price: purchasePrice,
              price: salePrice,
              stock: quantity,
              type,
            };
            submitItem(data);
          });
        });
      else
        submitItem({
          name: search.value,
          purchase_price: 0,
          price: salePrice,
          stock: 0,
          type,
        });
    });
  });
};

const submitItem = (data) => {
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
};
</script>
