<template>
  <q-page padding>
    <div
      class="text-center text-h5 q-py-sm q-my-sm rounded-borders bg-grey text-white"
    >
      Welcome
    </div>
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
        v-if="
          userStore.getUser?.roles.map((role) => role.name).includes('admin')
        "
        @click="
          $router.push({
            name: userStore.getUser ? 'expenses' : 'login',
          })
        "
      />
    </div>
    <BalanceReport
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((role) => role.name).includes('admin')
      "
      class="q-mt-sm"
    />
    <div v-else-if="!userStore.getUser" class="text-center q-mt-md">
      <q-btn
        no-caps
        @click="
          $router.push({
            name: 'login',
          })
        "
        outline
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
