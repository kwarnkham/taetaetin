<template>
  <q-page padding>
    <q-form @submit.prevent="submit">
      <q-input label="Password" v-model="form.password" />
      <q-input label="New Password" v-model="form.new_password" />
      <q-input
        label="New Password Again"
        v-model="form.new_password_confirmation"
      />
      <div class="text-right">
        <q-btn type="submit" label="Update" flat />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";

const { api } = useUtil();
const { notify } = useQuasar();
const form = ref({
  password: "",
  new_password: "",
  new_password_confirmation: "",
});

const submit = () => {
  api({
    method: "POST",
    url: "change-password",
    data: {
      password: form.value.password,
      new_password: form.value.new_password,
      new_password_confirmation: form.value.new_password_confirmation,
    },
  }).then(() => {
    form.value.password = "";
    form.value.new_password = "";
    form.value.new_password_confirmation = "";
    notify({
      type: "positive",
      message: "Success",
    });
  });
};
</script>
