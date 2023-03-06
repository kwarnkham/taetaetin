<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-gutter-y-sm" v-if="!getUser">
      <q-input
        label="Email"
        v-model="formData.email"
        autocomplete="username"
        type="email"
        required
        autofocus
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
import { api as axios } from "boot/axios";
import { useUserStore } from "stores/user-store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import useApp from "src/composables/app";
const formData = ref({
  name: "",
  password: "",
});

const isPwd = ref(true);
const { localStorage } = useQuasar();
const { api } = useUtil();
const { init } = useApp();
const { setUser } = useUserStore();
const { getUser } = storeToRefs(useUserStore());

const router = useRouter();
const submit = () => {
  api(
    {
      method: "POST",
      url: "login",
      data: formData.value,
    },
    true
  )
    .then((response) => {
      localStorage.set("token", response.data.token);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      setUser(response.data.user);
      formData.value.password = "";
      init().finally(() => {
        router.replace({
          name: "index",
        });
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
</script>
