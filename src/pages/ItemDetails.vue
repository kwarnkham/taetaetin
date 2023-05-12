<template>
  <q-page padding v-if="item">
    <div class="text-center text-h5">
      {{ item.name }}
    </div>
    <p>{{ item.description }}</p>
    <div class="text-right" v-if="item.type == 1">
      <div>Total purchased quantity :{{ purchasedQty }}</div>
      <div>Total ordered quantity :{{ item.ordered_quantity }}</div>
      <div>Total remaining quantity :{{ item.stock }}</div>
      <div>
        {{ Number(item.stock) + Number(item.ordered_quantity) - purchasedQty }}
      </div>
    </div>
    <q-separator spaced />
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const { api } = useUtil();
const item = ref(null);
const route = useRoute();

const purchasedQty = computed(() => {
  if (!item.value) return 0;
  else
    return item.value.purchases.reduce(
      (carry, e) => carry + (e.status == 1 ? e.quantity : 0),
      0
    );
});
// const printQR = () => {
//   dialog({
//     component: PrintQrDialog,
//     componentProps: {
//       item: item.value,
//     },
//   });
// };
onMounted(() => {
  api({
    method: "GET",
    url: `a-items/${route.params.item}`,
  }).then((response) => {
    item.value = response.data.a_item;
  });
});
</script>
