<template>
  <div class="column">
    <div class="text-subtitle1 text-weight-bold text-center">Topping List</div>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="topping in pagination?.data" :key="topping.id">
        <q-item-section>
          <q-item-label>
            {{ topping.name }}
          </q-item-label>
          <q-item-label caption>
            {{ topping.price }}
          </q-item-label>
          <q-item-label>
            {{ topping.cost }}
          </q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="edit" dense @click="showEditTopping(topping)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import EditPaymentDialog from "src/components/dialogs/EditPaymentDialog.vue";
import { inject, onBeforeUnmount } from "vue";
import EditToppingDialog from "./dialogs/EditToppingDialog.vue";

const { api } = useUtil();
const { dialog } = useQuasar();
const bus = inject("bus");

const updateToppingList = (topping) => {
  pagination.value.data.unshift(topping);
};
bus.on("toppingCreated", updateToppingList);

onBeforeUnmount(() => {
  bus.off("toppingCreated", updateToppingList);
});

const featchToppings = () => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "toppings",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, current } = usePagination(featchToppings);

const showEditTopping = (topping) => {
  dialog({
    component: EditToppingDialog,
    componentProps: {
      topping,
    },
  }).onOk((updatedTopping) => {
    const index = pagination.value.data.findIndex((e) => e.id == topping.id);
    if (index >= 0) pagination.value.data.splice(index, 1, updatedTopping);
  });
};
</script>
