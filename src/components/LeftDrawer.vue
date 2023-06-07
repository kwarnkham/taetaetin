<template>
  <q-drawer bordered :modelValue="modelValue" @update:model-value="toggle">
    <q-list>
      <q-item-label header>
        {{ userStore.getUser?.name ?? "Welcome" }}
        {{ tenantStore.getTenant?.name }}</q-item-label
      >
      <template v-for="link in links" :key="link.name">
        <LeftDrawerLink
          :name="link.name"
          :icon="link.icon"
          :title="link.meta.translateKey"
          :class="{
            hidden:
              (!userStore.getUser && link.meta?.requiresAuth) ||
              (userStore.getUser &&
                link.meta?.requiresAuth &&
                !userStore.getUser.roles
                  .map((e) => e.name)
                  .includes(link.meta.role)) ||
              (link.meta.owner && tenantStore.getTenant.type != 2),
          }"
        />
      </template>

      <q-item clickable tag="div" @click="logout" v-if="userStore.getUser">
        <q-item-section avatar>
          <q-icon :name="'logout'" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ $t("logout") }}</q-item-label>
        </q-item-section>
      </q-item>
      <LeftDrawerLink title="Login" icon="login" name="login" v-else />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
import LeftDrawerLink from "src/components/LeftDrawerLink.vue";
import useUtil from "src/composables/util";
import { useUserStore } from "src/stores/user-store";
import { useTenantStore } from "src/stores/tenant-store";
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
const userStore = useUserStore();
const tenantStore = useTenantStore();
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
      userStore.setUser(null);
      tenantStore.setTenant(null);
      router.replace({ name: "index" });
    });
  });
};
</script>
