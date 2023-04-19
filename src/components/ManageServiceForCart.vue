<template>
  <div>
    <q-input
      placeholder="Search"
      label="Service"
      dense
      outlined
      v-model.trim="search"
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

const emit = defineEmits(["serviceAdded"]);
const { dialog } = useQuasar();

const { pagination, search } = usePagination("services");

const addService = (service) => {
  dialog({
    prompt: {
      model: "1",
      type: "tel",
      isValid: (val) => val !== "" && val >= 1,
    },
    noBackdropDismiss: true,
    cancel: true,
    title: "Quantity",
    position: "top",
  }).onOk((quantity) => {
    emit("serviceAdded", {
      service,
      quantity,
    });
  });
};
</script>
