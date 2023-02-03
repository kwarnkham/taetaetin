<template>
  <q-page padding v-if="item">
    <div class="text-center text-h5">
      {{ item.name }} <q-btn icon="qr_code" round @click="printQR" />
    </div>
    <p>{{ item.description }}</p>
    <q-separator spaced />
    <ProductList />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import PrintQrDialog from "src/components/dialogs/PrintQrDialog.vue";
import ProductList from "src/components/ProductList.vue";
import useUtil from "src/composables/util";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { api } = useUtil();
const { dialog } = useQuasar();
const item = ref(null);
const route = useRoute();
const printQR = () => {
  dialog({
    component: PrintQrDialog,
    componentProps: {
      item: item.value,
    },
  });
};
onMounted(() => {
  api({
    method: "GET",
    url: `items/${route.params.item}`,
  }).then((response) => {
    item.value = response.data.item;
  });
});
</script>
