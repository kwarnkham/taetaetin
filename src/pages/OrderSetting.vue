<template>
  <q-page padding>
    <div class="text-center text-h6">
      Choose the order status you want to work with
    </div>
    <div>
      <q-checkbox
        :label="orderSetting.label"
        v-for="orderSetting in orderSettings"
        :key="orderSetting.id"
        v-model="orderSetting.value"
        :disable="![6, 7].includes(orderSetting.id)"
      />
    </div>
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref, watch } from "vue";

const { localStorage } = useQuasar();
const orderStatuses = localStorage.getItem("orderStatuses");
const setting = localStorage.getItem("setting");
const { api } = useUtil();

const orderSettings = ref(
  orderStatuses.map((status) => ({
    ...status,
    value: setting.active_order_status.split(",").includes(String(status.id)),
  }))
);

watch(
  orderSettings,
  () => {
    const active_order_status = orderSettings.value
      .filter((e) => e.value)
      .map((e) => e.id)
      .join(",");

    localStorage.set("setting", { ...setting, active_order_status });

    api({
      method: "PUT",
      url: "settings/1",
      data: {
        active_order_status,
      },
    });
  },
  {
    deep: true,
  }
);
</script>
