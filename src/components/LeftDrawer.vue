<template>
  <q-drawer v-model="leftDrawerOpen" bordered>
    <q-list>
      <q-item-label header> Main Menu </q-item-label>
      <LeftDrawerLink v-for="link in links" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import LeftDrawerLink from "src/components/LeftDrawerLink.vue";
import { ref, watch } from "vue";

const links = [
  {
    title: "Item",
    caption: "Manage items",
    icon: "inventory_2",
    route: "item",
  },
  {
    title: "Product",
    caption: "Manage Product",
    icon: "storefront",
    route: "product",
  },
];

const props = defineProps(["open"]);

watch(
  props,
  () => {
    leftDrawerOpen.value = props.open;
  },
  {
    deep: true,
  }
);

const leftDrawerOpen = ref(props.open);
</script>
