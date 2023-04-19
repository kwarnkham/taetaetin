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
        <div class="text-weight-bold text-subtitle1">
          Select Item for new product
        </div>
        <q-btn icon="close" flat @click="onDialogCancel" dense />
      </div>
      <div class="col column">
        <q-input label="Item Name" v-model.trim="search" />
        <q-list
          v-if="pagination && pagination.data.length"
          class="overflow-auto col"
          padding
          separator
          bordered
        >
          <q-item
            v-for="item in pagination.data"
            :key="item.id"
            clickable
            @click="selectItemForProduct(item)"
          >
            <q-item-section>
              <div>{{ item.name }}</div>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          class="text-right q-mt-sm"
          v-else-if="pagination && pagination.data.length == 0 && search"
        >
          <q-btn no-caps flat @click="showCreateOrSelectItemForProuct">
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
import ProductFormDialog from "./ProductFormDialog.vue";

const { dialog } = useQuasar();
const { api } = useUtil();
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { pagination, updateQueryAndFetch } = usePagination("items");
const { search } = useSearchFilter({ updateQueryAndFetch });

const selectItemForProduct = (item) => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id: item.id,
      product: {
        name: props.name,
        price: item.latest_product?.price,
        purchase_price: item.latest_product?.latest_purchase?.price,
      },
    },
  }).onOk((product) => {
    onDialogOK(product);
  });
};

const showCreateOrSelectItemForProuct = () => {
  dialog({
    title: "Description for new item",
    prompt: {
      model: "",
    },
  }).onOk((description) => {
    api(
      {
        method: "POST",
        url: "items",
        data: {
          name: search.value,
          description,
        },
      },
      true
    )
      .then((response) => {
        const item = response.data.item;
        dialog({
          component: ProductFormDialog,
          componentProps: {
            item_id: item.id,
            product: {
              name: props.name,
              price: item.latest_product?.price,
              purchase_price: item.latest_product?.latest_purchase?.price,
            },
          },
        }).onOk((product) => {
          onDialogOK(product);
        });
      })
      .catch((e) => {
        console.warn(e);
      });
  });
};
</script>
