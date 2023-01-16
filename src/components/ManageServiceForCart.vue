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
      />
    </div>
  </div>
</template>

<script setup>
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { api } = useUtil();
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
</script>
