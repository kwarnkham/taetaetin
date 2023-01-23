<template>
  <q-page padding v-if="product">
    <div class="text-h6">{{ product.name }}</div>
    <div>From : {{ product.item.name }}</div>
    <div>Description: {{ product.item.description }}</div>
    <div>Price : {{ product.price }}</div>
    <div v-if="userStore.getUser">
      Purchase price: {{ product.latest_purchase.price }}
    </div>
    <div class="row items-center">
      <div>Stock : {{ product.stock }}</div>
      <q-btn
        icon="info"
        flat
        @click="showStockDetails"
        v-if="userStore.getUser"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import StockDetailsDialog from "src/components/dialogs/StockDetailsDialog";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const product = ref(null);
const { api } = useUtil();
const route = useRoute();
const { dialog } = useQuasar();

const showStockDetails = () => {
  dialog({
    component: StockDetailsDialog,
    componentProps: {
      batches: product.value.batches,
    },
  });
};
onMounted(() => {
  api({
    url: "features/" + route.params.product,
    method: "GET",
  }).then((response) => {
    product.value = response.data.feature;
  });
});
</script>
