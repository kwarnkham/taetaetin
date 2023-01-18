<template>
  <q-page padding v-if="item">
    <div class="text-center text-h5">{{ item.name }}</div>
    <p>{{ item.description }}</p>
    <q-separator spaced />
    <ProductList />
  </q-page>
</template>

<script setup>
import ProductList from "src/components/ProductList.vue";
import useUtil from "src/composables/util";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const { api } = useUtil();
const item = ref(null);
const route = useRoute();
onMounted(() => {
  api({
    method: "GET",
    url: `items/${route.params.item}`,
  }).then((response) => {
    item.value = response.data.item;
  });
});
</script>
