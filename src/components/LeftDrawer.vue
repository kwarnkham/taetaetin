<template>
  <q-drawer bordered :modelValue="modelValue" @update:model-value="toggle">
    <q-list>
      <q-item-label header> {{ getUser?.name ?? "Welcome" }}</q-item-label>
      <template v-for="link in links" :key="link.name">
        <LeftDrawerLink
          v-bind="link"
          :class="{
            hidden:
              (!getUser && link.meta?.requiresAuth) ||
              (getUser &&
                link.meta?.requiresAuth &&
                !getUser.roles.map((e) => e.name).includes(link.meta.role)),
          }"
        />
      </template>

      <q-item clickable tag="div" @click="logout" v-if="getUser">
        <q-item-section avatar>
          <q-icon :name="'logout'" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
      <LeftDrawerLink title="Login" icon="login" name="login" v-else />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import LeftDrawerLink from "src/components/LeftDrawerLink.vue";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { useRouter } from "vue-router";
import routes from "src/router/routes";

const links = routes[0].children.filter(
  (e) => e.meta?.navigation && e.name != "login"
);

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const toggle = (value) => {
  emit("update:modelValue", value);
};
const { api } = useUtil();
const { notify, localStorage, dialog } = useQuasar();
const { setUser } = useUserStore();
const { getUser } = storeToRefs(useUserStore());
const router = useRouter();
const logout = () => {
  dialog({
    title: "Confirm",
    message: "Would you like to logout?",
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: "logout",
    }).then((response) => {
      notify({
        message: response.data.message,
        type: "positive",
      });
      localStorage.remove("token");
      setUser(null);
      router.replace({ name: "index" });
    });
  });
};
</script>
