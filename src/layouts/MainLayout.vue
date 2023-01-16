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

        <q-toolbar-title> Quasar App </q-toolbar-title>

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
          >
            <q-badge color="info" floating transparent rounded>
              {{
                getTotal(cartStore.getCart.products, "quantity") +
                getTotal(cartStore.getCart.services, "quantity")
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
import useUtil from "src/composables/util";
import { useCartStore } from "src/stores/cart-store";
import { ref } from "vue";

const { screen } = useQuasar();
const leftDrawerOpen = ref(screen.gt.sm);
const { getTotal } = useUtil();
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const cartStore = useCartStore();
</script>
