<template>
  <div class="full-height column">
    <div class="row justify-between">
      <q-input v-model="search" label="Search" class="col" />
      <q-checkbox left-label v-model="onlyStocked" label="Only stocked" />
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="product in pagination?.data" :key="product.id">
        <q-item-section>
          <q-item-label>
            Name : {{ product.name }}
            <q-badge align="top">{{ product.stock }}</q-badge>
            <q-badge align="top" color="info" class="q-ml-sm">
              {{
                cartStore.getCart.products.find((e) => e.id == product.id)
                  ?.quantity ?? 0
              }}
            </q-badge>
          </q-item-label>
          <q-item-label caption>From : {{ product.item.name }}</q-item-label>
          <q-item-label>Price : {{ product.price }} MMK</q-item-label>
          <q-item-label>
            Description : {{ product.item.description }}
          </q-item-label>

          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="add" dense @click="showRestockDialog(product)" />
            <q-btn
              round
              icon="shopping_cart"
              color="positive"
              dense
              @click="showAddProductToCart(product)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import RestockDialog from "src/components/dialogs/RestockDialog.vue";
import usePagination from "src/composables/pagination";
import { useCartStore } from "src/stores/cart-store";

const { api } = useUtil();
const { dialog, notify } = useQuasar();
const cartStore = useCartStore();
const fetchProducts = (params) => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "features",
      params: params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, search, current, onlyStocked } =
  usePagination(fetchProducts);

const showRestockDialog = (product) => {
  dialog({
    component: RestockDialog,
    componentProps: {
      product,
    },
  }).onOk((feature) => {
    const index = pagination.value.data.findIndex((e) => e.id == feature.id);
    if (index >= 0) pagination.value.data.splice(index, 1, feature);
  });
};

const showAddProductToCart = (product) => {
  dialog({
    title: "Quantity",
    prompt: {
      model: "1",
      type: "tel", // optional
    },
    cancel: true,
    persistent: true,
  }).onOk((quantity) => {
    quantity = Number(quantity);
    if (
      (cartStore.getCart.products.find((e) => e.id == product.id)?.quantity ??
        0) +
        quantity >
      product.stock
    ) {
      notify({
        message: "No enough stock",
        type: "warning",
      });
      return;
    }

    cartStore.addProductToCart({ product, quantity });
    notify({
      message: "Added to cart",
      type: "positive",
    });
  });
};
</script>
