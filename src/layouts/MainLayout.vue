<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-separator vertical spaced />
        <template v-if="$route.name != 'index'">
          <q-btn
            flat
            dense
            round
            icon="keyboard_arrow_left"
            aria-label="Back"
            @click="$router.go(-1)"
          />
          <q-separator vertical spaced />
          <q-btn
            flat
            dense
            round
            icon="home"
            aria-label="Back"
            @click="
              $router.push({
                name: 'index',
              })
            "
          />
        </template>
        <div class="col"></div>
        <LanguageSwitcher />
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
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";

const { screen } = useQuasar();
const leftDrawerOpen = ref(screen.gt.sm);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
