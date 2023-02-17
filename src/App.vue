<template>
  <router-view v-if="isReady" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import useApp from "src/composables/app";

const { init } = useApp();

const isReady = ref(false);
onMounted(() => {
  init().finally(() => {
    isReady.value = true;
  });
});
</script>
