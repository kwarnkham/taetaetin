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
          v-if="$route.name != 'items'"
        />
        <q-toolbar-title> သေးသေးတင် </q-toolbar-title>

        <div>
          <q-btn
            dense
            color="positive"
            round
            icon="shopping_cart"
            @click="
              $router.push({
                name: 'manage-cart',
              })
            "
            v-if="userStore.getUser"
          >
            <q-badge color="info" floating transparent rounded>
              {{
                sumArray(cartStore.getCart.products, "quantity") +
                sumArray(cartStore.getCart.services, "quantity")
              }}
            </q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <LeftDrawer v-model="leftDrawerOpen" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import LeftDrawer from "src/components/LeftDrawer.vue";
import useApp from "src/composables/app";
import { useCartStore } from "src/stores/cart-store";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";

const { screen } = useQuasar();
const userStore = useUserStore();
const leftDrawerOpen = ref(screen.gt.sm);
const { sumArray } = useApp();
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const cartStore = useCartStore();
</script>
