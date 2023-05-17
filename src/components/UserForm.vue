<template>
  <q-form @submit.prevent="submit" class="q-pa-md rounded-borders shadow-up-2">
    <div class="text-center">Add New User</div>
    <q-input label="Username" v-model="form.username" required />
    <q-input label="Name" v-model="form.name" required />
    <div class="text-right">
      <q-btn label="Add" no-caps type="submit" class="q-mt-sm" />
    </div>
  </q-form>
</template>

<script setup>
import useUtil from "src/composables/util";
import { ref } from "vue";

const emit = defineEmits(["userAdded"]);
const { api } = useUtil();
const submit = () => {
  api({
    method: "POST",
    url: "users",
    data: {
      name: form.value.name,
      username: form.value.username,
    },
  }).then((response) => {
    emit("userAdded", response.data.user);
    form.value.name = "";
    form.value.username = "";
  });
};
const form = ref({
  name: "",
  username: "",
});
</script>
