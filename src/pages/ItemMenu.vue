<template>
  <q-page padding :style-fn="vhPage">
    <ItemList />
  </q-page>
</template>

<script setup>
import ItemList from "src/components/ItemList.vue";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();
</script>
