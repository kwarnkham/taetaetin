<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import useUtil from "./composables/util";
import { useUserStore } from "./stores/user-store";
const { localStorage } = useQuasar();
const { api } = useUtil();
const token = localStorage.getItem("token");
const { setUser } = useUserStore();
onMounted(() => {
  if (token) {
    api({
      method: "GET",
      url: "user",
    }).then((response) => {
      setUser(response.data.user);
    });
  }
});
</script>
