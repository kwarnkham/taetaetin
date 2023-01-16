<template>
  <div>
    <q-input
      placeholder="Search"
      label="Service"
      dense
      outlined
      v-model="search"
    />
    <div class="row wrap justify-around q-mt-sm">
      <q-btn
        rounded
        no-caps
        :label="service.name"
        v-for="service in pagination?.data"
        :key="service.id"
        @click="addService(service)"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const emit = defineEmits(["serviceAdded"]);
const { api } = useUtil();
const { dialog } = useQuasar();

const featchServices = (params) => {
  return new Promise((resolve, reject) => {
    api({
      method: "GET",
      url: "services",
      params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, search } = usePagination(featchServices);

const addService = (service) => {
  dialog({
    prompt: {
      model: "1",
      type: "tel",
      isValid: (val) => val !== "" && val >= 1,
    },
    persistent: true,
    cancel: true,
    title: "Quantity",
  }).onOk((quantity) => {
    emit("serviceAdded", {
      service,
      quantity,
    });
  });
};
</script>
