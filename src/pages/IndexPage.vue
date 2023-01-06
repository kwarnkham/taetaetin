<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-gutter-y-sm">
      <q-input
        label="Email"
        v-model="formData.email"
        autocomplete="username"
        type="email"
        required
      />
      <q-input
        label="Password"
        v-model="formData.password"
        :type="isPwd ? 'password' : 'text'"
        autocomplete="current-password"
        required
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="text-right">
        <q-btn label="Login" no-caps type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { ref } from "vue";

const formData = ref({
  name: "",
  password: "",
});

const isPwd = ref(true);
const { localStorage } = useQuasar();
const { api } = useUtil();

const submit = () => {
  api({
    method: "POST",
    url: "login",
    data: formData.value,
  })
    .then((response) => {
      localStorage.set("token", response.data.token);
    })
    .catch((e) => {
      console.log(e);
    });
};
</script>
