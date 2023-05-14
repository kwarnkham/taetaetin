<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-pa-sm">
      <div class="text-h6 text-center">Change password</div>
      <input
        :value="userStore.getUser.username"
        autocomplete="username"
        class="hidden"
      />
      <q-input
        label="Password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
      />
      <q-input
        label="New Password"
        v-model="form.new_password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
      />
      <q-input
        label="New Password Again"
        v-model="form.new_password_confirmation"
        autocomplete="new-password"
        :type="showPassword ? 'text' : 'password'"
      />
      <div class="text-right">
        <q-checkbox label="Show passwords" v-model="showPassword" />
      </div>
      <div class="text-right">
        <q-btn type="submit" label="Update" no-caps outline />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";

const { api } = useUtil();
const { notify } = useQuasar();
const userStore = useUserStore();
const form = ref({
  password: "",
  new_password: "",
  new_password_confirmation: "",
});
const showPassword = ref(false);
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
