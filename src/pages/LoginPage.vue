<template>
  <q-page padding>
    <q-form
      @submit.prevent="submit"
      class="q-gutter-y-sm q-pa-xs"
      v-if="!userStore.getUser"
    >
      <q-input
        :label="$t('username')"
        v-model="formData.username"
        autocomplete="username"
        required
        autofocus
      />
      <q-input
        :label="$t('password')"
        v-model="formData.password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="password"
        required
      />

      <q-input :label="$t('space')" v-model="tenant" required />
      <div class="text-right">
        <q-checkbox v-model="showPassword" :label="$t('showPassword')" />
      </div>
      <div class="text-right">
        <q-btn
          :label="$t('login')"
          no-caps
          type="submit"
          outline
          color="primary"
        />
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
import { useTenantStore } from "stores/tenant-store";
import { useRoute, useRouter } from "vue-router";
import useApp from "src/composables/app";

const formData = ref({
  username: "",
  password: "",
});

const { localStorage } = useQuasar();
const { api } = useUtil();
const { init } = useApp();
const userStore = useUserStore();
const { setTenant } = useTenantStore();
const route = useRoute();

if (route.query.tenant !== undefined)
  localStorage.set("tenantSpace", route.query.tenant);

const tenant = ref(localStorage.getItem("tenantSpace") ?? "");

const showPassword = ref(false);
const router = useRouter();
const submit = () => {
  localStorage.set("tenantSpace", tenant.value);
  axios.defaults.headers.common["Tenant"] = tenant.value;
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
      userStore.setUser(response.data.user);
      setTenant(response.data.tenant);
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
