<template>
  <q-drawer bordered :modelValue="modelValue" @update:modelValue="toggle">
    <q-list>
      <q-item-label header> Main Menu </q-item-label>
      <LeftDrawerLink v-for="link in links" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import LeftDrawerLink from "src/components/LeftDrawerLink.vue";

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
    title: "Login",
    icon: "login",
    route: "index",
  },
];
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const toggle = (value) => {
  emit("update:modelValue", value);
};
</script>
