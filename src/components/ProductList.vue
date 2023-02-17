<template>
  <div class="full-height column">
    <div class="row justify-between">
      <q-input v-model.trim="search" label="Search" class="col" />
      <q-checkbox left-label v-model="onlyStocked" label="Only stocked" />
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="product in pagination?.data" :key="product.id">
        <q-item-section>
          <q-item-label>
            Name : {{ product.name }}
            <q-badge align="top"> stock : {{ product.stock }}</q-badge>
          </q-item-label>
          <q-item-label caption>From : {{ product.item.name }}</q-item-label>
          <q-item-label>Price : {{ product.price }} MMK</q-item-label>
          <q-item-label
            caption
            v-if="
              userStore.getUser &&
              userStore.getUser.roles.map((e) => e.name).includes('admin')
            "
          >
            Purchase Price :
            {{ product.latest_batch.purchase.price }} MMK</q-item-label
          >
          <q-item-label>
            Description : {{ product.item.description }}
          </q-item-label>

          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <template
              v-if="
                userStore.getUser &&
                userStore.getUser.roles.map((e) => e.name).includes('admin')
              "
            >
              <q-btn
                round
                icon="add"
                dense
                @click="showRestockDialog(product)"
              />
              <q-btn
                round
                icon="edit"
                dense
                @click="showEditProductForm(product)"
              />
            </template>
            <q-btn
              v-if="userStore.getUser"
              round
              icon="shopping_cart"
              color="positive"
              dense
              @click="showAddProductToCart(product)"
            >
              <q-badge color="primary" floating>
                {{
                  cartStore.getCart.products.find((e) => e.id == product.id)
                    ?.quantity ?? 0
                }}
              </q-badge>
            </q-btn>
            <q-btn
              round
              icon="open_in_new"
              dense
              @click="showProductDetails(product)"
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
import { useUserStore } from "src/stores/user-store";
import { useRoute } from "vue-router";
import ProductFormDialog from "./dialogs/ProductFormDialog.vue";
import ProductDetailsDialog from "./dialogs/ProductDetailsDialog.vue";

const props = defineProps({
  item_id: {
    type: Number,
  },
});
const userStore = useUserStore();
const { api } = useUtil();
const { dialog, notify } = useQuasar();
const cartStore = useCartStore();
const fetchProducts = (params) => {
  if (params.stocked == "true" || params.stocked == true) {
    params.stocked = 1;
  }
  return new Promise((resolve, reject) => {
    api(
      {
        method: "GET",
        url: "features",
        params: params,
      },
      false
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const showProductDetails = (product) => {
  dialog({
    component: ProductDetailsDialog,
    componentProps: {
      productId: product.id,
    },
  });
};
const route = useRoute();
const { pagination, max, search, current, onlyStocked } = usePagination(
  fetchProducts,
  { onlyStocked: route.query.stocked == "true" ? true : false }
);

const showRestockDialog = (product) => {
  dialog({
    component: RestockDialog,
    componentProps: {
      product,
    },
  }).onOk((updatedProduct) => {
    updateProductList(updatedProduct);
  });
};

const showEditProductForm = (product) => {
  dialog({
    title: "Edit product " + product.name,
    component: ProductFormDialog,
    componentProps: {
      update: true,
      item_id: product.item_id,
      product,
    },
    cancel: true,
    noBackdropDismiss: true,
  }).onOk((updatedProduct) => {
    updateProductList(updatedProduct);
  });
};

const updateProductList = (updatedProduct) => {
  const index = pagination.value.data.findIndex(
    (e) => e.id == updatedProduct.id
  );
  if (index >= 0) pagination.value.data.splice(index, 1, updatedProduct);
};

const showAddProductToCart = (product) => {
  dialog({
    title: "Quantity",
    prompt: {
      model: "1",
      type: "tel", // optional
    },
    cancel: true,
    noBackdropDismiss: true,
    position: "top",
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

    cartStore.addProduct({ product, quantity });
    notify({
      message: "Added to cart",
      type: "positive",
    });
  });
};
</script>
