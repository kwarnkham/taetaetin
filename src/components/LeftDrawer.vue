<template>
  <q-drawer bordered :modelValue="modelValue" @update:model-value="toggle">
    <q-list>
      <q-item-label header> {{ getUser?.name ?? "Welcome" }}</q-item-label>
      <template v-for="link in links" :key="link.title">
        <LeftDrawerLink
          v-bind="link"
          :class="{ hidden: !getUser && link.requiresAuth }"
        />
      </template>

      <q-item clickable tag="div" @click="logout" v-if="getUser">
        <q-item-section avatar>
          <q-icon :name="'logout'" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
      <LeftDrawerLink title="Login" icon="login" route="login" v-else />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import LeftDrawerLink from "src/components/LeftDrawerLink.vue";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { useRouter } from "vue-router";

const links = [
  {
    title: "Item",
    caption: "Manage items",
    icon: "inventory_2",
    route: "items",
  },
  {
    title: "Product",
    caption: "Manage Product",
    icon: "storefront",
    route: "products",
  },
  {
    title: "Order",
    caption: "Manage Order",
    icon: "shopping_basket",
    route: "order-menu",
    requiresAuth: true,
  },
  {
    title: "Financial Records",
    caption: "All income and outcome",
    icon: "price_change",
    route: "financial-records",
    requiresAuth: true,
  },
  {
    title: "Set Up",
    caption: "Payments, expense, etc...",
    icon: "topic",
    route: "set-up",
    requiresAuth: false,
  },
  {
    title: "Users",
    caption: "Manage users, roels",
    icon: "group",
    route: "users",
    requiresAuth: true,
  },
];

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const toggle = (value) => {
  emit("update:modelValue", value);
};
const { api } = useUtil();
const { notify, localStorage, dialog } = useQuasar();
const { setUser } = useUserStore();
const { getUser } = storeToRefs(useUserStore());
const router = useRouter();
const logout = () => {
  dialog({
    title: "Confirm",
    message: "Would you like to logout?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: "logout",
    }).then((response) => {
      notify({
        message: response.data.message,
        type: "positive",
      });
      localStorage.remove("token");
      setUser(null);
      router.replace({ name: "index" });
    });
  });
};
</script>
