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
        <div class="text-weight-bold text-subtitle1">Select Product</div>
        <q-btn icon="close" flat @click="onDialogCancel" dense />
      </div>
      <div class="col column">
        <q-input label="Prodcut Name" v-model.trim="search" autofocus />
        <q-list
          v-if="pagination && pagination.data.length"
          class="overflow-auto col"
          padding
          separator
          bordered
        >
          <q-item
            v-for="product in pagination.data"
            :key="product.id"
            clickable
            @click="showAddProductToCart(product)"
          >
            <q-item-section>
              <div>{{ product.name }}</div>
              <q-item-label overline>{{ product.price }}</q-item-label>
              <q-item-label caption>{{ product.item.name }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              Stock:
              {{
                product.stock -
                (cartStore.getCart.products.find((e) => e.id == product.id)
                  ?.quantity ?? 0)
              }}
            </q-item-section>
          </q-item>
        </q-list>
        <div
          class="text-right q-mt-sm"
          v-else-if="pagination && pagination.data.length == 0 && search"
        >
          <q-btn no-caps flat @click="showCreateOrSelectItemForProuct">
            Create new product "{{ search }}"
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import useCart from "src/composables/cart";
import usePagination from "src/composables/pagination";
import { useCartStore } from "src/stores/cart-store";
import SelectItemDialog from "./SelectItemDialog.vue";
import useSearchFilter from "src/composables/searchFilter";

const { dialog, loading } = useQuasar();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { pagination, updateQueryAndFetch } = usePagination("products");
const { search } = useSearchFilter({ updateQueryAndFetch });

const { showAddProductToCart } = useCart();
const cartStore = useCartStore();

const showCreateOrSelectItemForProuct = () => {
  const name = search.value;
  search.value = "";
  loading.show();
  setTimeout(() => {
    loading.hide();
    dialog({
      component: SelectItemDialog,
      componentProps: {
        name,
      },
    }).onOk((product) => {
      search.value = product.name;
    });
  }, 900);
};
</script>
