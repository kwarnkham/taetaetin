<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-separator vertical spaced />
        <q-btn
          flat
          dense
          round
          icon="keyboard_arrow_left"
          aria-label="Back"
          @click="$router.go(-1)"
          v-if="$route.name != 'index'"
        />
        <q-toolbar-title
          @click="
            $router.push({
              name: 'index',
            })
          "
        >
          <q-icon name="home"></q-icon>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <LeftDrawer v-model="leftDrawerOpen" />
    <q-page-container class="bg-grey-4">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import LeftDrawer from "src/components/LeftDrawer.vue";
import { ref } from "vue";

const { screen } = useQuasar();
const leftDrawerOpen = ref(screen.gt.sm);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
