<template>
  <q-page padding>
    <div class="row justify-between">
      <template v-for="setting in settings" :key="setting.route">
        <div
          class="q-pa-xs col-6"
          v-if="
            userStore.getUser?.roles.map((e) => e.name).includes(setting.role)
          "
        >
          <q-card
            @click="
              $router.push({
                name: setting.route,
              })
            "
          >
            <q-card-section class="row items-center justify-between">
              <div class="text-center text-subtitle2">{{ setting.label }}</div>
              <q-icon :name="setting.icon" size="md" />
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const settings = [
  {
    label: "Change Password",
    icon: "lock",
    route: "change-password",
    role: "sale",
  },
  {
    label: "Printer",
    icon: "print",
    route: "printer-setting",
    role: "sale",
  },
  {
    label: "Order",
    icon: "shopping_basket",
    route: "order-setting",
    role: "admin",
  },
];
</script>
