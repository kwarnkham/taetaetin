<template>
  <div class="column fit">
    <div class="text-subtitle1 text-weight-bold text-center">Service List</div>
    <q-list bordered separator class="col overflow-auto">
      <q-item v-for="service in pagination?.data" :key="service.id">
        <q-item-section>
          <q-item-label>
            {{ service.name }}
          </q-item-label>
          <q-item-label caption>
            {{ service.price }}
          </q-item-label>
          <q-item-label>
            {{ service.cost }}
          </q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="edit" dense @click="showEditService(service)" />
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
import { inject, onBeforeUnmount } from "vue";
import EditServiceDialog from "src/components/dialogs/EditServiceDialog.vue";

const { api } = useUtil();
const { dialog } = useQuasar();
const bus = inject("bus");

const updateServiceList = (service) => {
  pagination.value.data.unshift(service);
};
bus.on("serviceCreated", updateServiceList);

onBeforeUnmount(() => {
  bus.off("serviceCreated", updateServiceList);
});

const featchServices = () => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "services",
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, current } = usePagination(featchServices);

const showEditService = (service) => {
  dialog({
    component: EditServiceDialog,
    componentProps: {
      service,
    },
  }).onOk((updatedService) => {
    const index = pagination.value.data.findIndex((e) => e.id == service.id);
    if (index >= 0) pagination.value.data.splice(index, 1, updatedService);
  });
};
</script>
