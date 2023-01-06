<template>
  <q-page padding>
    <div v-for="item in items?.data" :key="item.id">{{ item.name }}</div>
    <q-pagination v-model="current" :max="max" input />
  </q-page>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const { api } = useUtil();
const items = ref(null);
const router = useRouter();
const route = useRoute();
const current = ref(1);
const max = computed(
  () => Math.ceil(items.value?.total / items.value?.per_page) || 1
);
watch(current, () => {
  router.replace({
    name: route.name,
    query: { ...route.query, page: current.value },
  });
  api({
    method: "GET",
    url: "items",
    params: {
      page: current.value,
    },
  }).then((response) => {
    items.value = response.data.items;
  });
});
onMounted(() => {
  api({
    method: "GET",
    url: "items",
    params: {
      page: route.query.page,
    },
  }).then((response) => {
    items.value = response.data.items;
    current.value = response.data.items.current_page;
  });
});
</script>
