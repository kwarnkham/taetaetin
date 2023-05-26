<template>
  <router-view v-if="isReady" />
</template>

<script setup>
import { ref } from "vue";
import useApp from "src/composables/app";
import { useUserStore } from "./stores/user-store";

const { init } = useApp();
const userStore = useUserStore();
const isReady = ref(!userStore.getUser);
if (userStore.getUser)
  init().finally(() => {
    isReady.value = true;
  });
</script>
