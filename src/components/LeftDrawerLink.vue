<template>
  <q-item
    clickable
    tag="div"
    @click="
      $router.push({
        name: name,
      })
    "
    :active="$route.name == name"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  icon: {
    type: String,
    default: "",
  },
});
</script>
