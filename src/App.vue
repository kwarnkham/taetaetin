<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import useUtil from "./composables/util";
import { useUserStore } from "./stores/user-store";
const { localStorage } = useQuasar();
const { api } = useUtil();
const token = localStorage.getItem("token");
const { setUser } = useUserStore();
const router = useRouter();
onMounted(() => {
  if (token) {
    api({
      method: "GET",
      url: "user",
    })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.remove("token");
          router.replace({ name: "index" });
        }
      });
  }
});
</script>
