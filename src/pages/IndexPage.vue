<template>
  <q-page padding>
    <div class="text-center text-h5">သေးသေးတင်မှ ကြိုဆိုပါတယ်</div>
    <div class="row justify-around">
      <q-btn
        icon="point_of_sale"
        no-caps
        color="primary"
        @click="
          $router.push({
            name: userStore.getUser ? 'sale' : 'login',
          })
        "
      />
      <q-btn
        icon="request_quote"
        no-caps
        color="negative"
        @click="
          $router.push({
            name: userStore.getUser ? 'expenses' : 'login',
          })
        "
      />
    </div>
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
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";

const userStore = useUserStore();
</script>
