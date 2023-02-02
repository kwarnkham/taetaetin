<template>
  <q-form @submit.prevent="submit">
    <div class="text-center">Add New User</div>
    <q-input label="Name" v-model="form.name" required />
    <q-input label="Email" v-model="form.email" type="email" required />
    <div class="text-right">
      <q-btn label="Add" no-caps type="submit" class="q-mt-sm" />
    </div>
  </q-form>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref, inject } from "vue";
const bus = inject("bus");

const { api } = useUtil();
const submit = () => {
  api({
    method: "POST",
    url: "users",
    data: {
      name: form.value.name,
      email: form.value.email,
    },
  }).then((response) => {
    bus.emit("userAdded", response.data.user);
    form.value.name = "";
    form.value.email = "";
  });
};
const form = ref({
  name: "",
  email: "",
});
</script>
