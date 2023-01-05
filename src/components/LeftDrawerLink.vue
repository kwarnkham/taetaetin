<template>
  <q-item
    clickable
    tag="div"
    @click="
      $router.push({
        name: route,
      })
    "
    :active="$route.name == route"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: "",
  },

  route: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    default: "",
  },
});
</script>
