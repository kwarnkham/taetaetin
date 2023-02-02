<template>
  <router-view v-if="isReady" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import useUtil from "./composables/util";

const { init } = useUtil();

const isReady = ref(false);
onMounted(() => {
  init().finally(() => {
    isReady.value = true;
  });
});
</script>
