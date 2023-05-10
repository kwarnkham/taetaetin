<template>
  <q-page padding>
    <div class="text-center text-h5">သေးသေးတင်မှ ကြိုဆိုပါတယ်</div>
    <BalanceReport v-if="userStore.getUser" class="q-mt-sm" />
    <div v-else class="text-center q-mt-md">
      <q-btn
        no-caps
        @click="
          $router.push({
            name: 'login',
          })
        "
      >
        Login to see the reports
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";
import BalanceReport from "src/components/BalanceReport.vue";

const userStore = useUserStore();
</script>
