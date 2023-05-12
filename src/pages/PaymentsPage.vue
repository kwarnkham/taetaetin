<template>
  <q-page padding :style-fn="vhPage" class="column">
    <PaymentForm
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((e) => e.name).includes('admin')
      "
    />
    <PaymentList class="col" />
  </q-page>
</template>

<script setup>
import PaymentList from "src/components/PaymentList.vue";
import PaymentForm from "src/components/PaymentForm.vue";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { vhPage } = useUtil();
</script>
