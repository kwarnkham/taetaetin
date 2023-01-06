<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-gutter-y-sm">
      <div class="text-h6 text-center text-weight-bold">Create Item</div>
      <q-input v-model="formData.name" label="Name" required />
      <q-input v-model="formData.description" label="Description" required />
      <div class="text-right">
        <q-btn label="Submit" no-caps type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import useUitl from "src/composables/util";
const formData = ref({
  name: "",
  description: "",
});

const { pickBy, api } = useUitl();
const submit = () => {
  api({
    method: "POST",
    url: "items",
    data: pickBy(formData.value),
  })
    .then(() => {
      formData.value.name = "";
      formData.value.description = "";
    })
    .catch((e) => {
      console.warn(e);
    });
};
</script>
