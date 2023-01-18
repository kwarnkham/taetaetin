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

    api({
      method: "GET",
      url: "payment-types",
    }).then((response) => {
      localStorage.set("paymentTypes", response.data.payment_types);
    });

    api({
      method: "GET",
      url: "orders/status",
    }).then((response) => {
      localStorage.set("orderStatus", response.data.status);
    });

    api({
      method: "GET",
      url: "payments",
    }).then((response) => {
      localStorage.set("payments", response.data.data.data);
    });
  }
});
</script>
