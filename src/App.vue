<template>
  <router-view v-if="isReady" />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useUtil from "./composables/util";
import { useUserStore } from "./stores/user-store";

const { localStorage } = useQuasar();
const { api, init } = useUtil();
const token = localStorage.getItem("token");
const { setUser } = useUserStore();
const router = useRouter();
const isReady = ref(false);
onMounted(() => {
  if (token) {
    api({
      method: "GET",
      url: "user",
    })
      .then((response) => {
        setUser(response.data.user);
        init().finally(() => {
          isReady.value = true;
        });
      })
      .catch((error) => {
        if (error.response.status == 401) {
          localStorage.remove("token");
          router.replace({ name: "index" });
        }
      })
      .finally(() => {});
  }
});
</script>
