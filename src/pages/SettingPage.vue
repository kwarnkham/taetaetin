<template>
  <q-page padding>
    <div class="row justify-between">
      <div
        v-for="setting in settings"
        :key="setting.route"
        class="q-pa-xs col-6"
      >
        <q-card
          @click="
            $router.push({
              name: setting.route,
            })
          "
        >
          <q-card-section class="row items-center justify-between">
            <div class="text-center text-h6">{{ setting.label }}</div>
            <q-icon :name="setting.icon" size="md" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const settings = [
  {
    label: "Printer",
    icon: "print",
    route: "printer-setting",
  },
  {
    label: "Order",
    icon: "shopping_basket",
    route: "order-setting",
  },
];
</script>
