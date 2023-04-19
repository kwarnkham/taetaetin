<template>
  <q-list bordered separator class="overflow-auto col">
    <q-item v-for="user in pagination?.data" :key="user.id">
      <q-item-section>
        <q-item-label>{{ user.name }}</q-item-label>
        <q-item-label caption>{{ user.email }}</q-item-label>
        <div class="row q-gutter-x-xs">
          <q-badge
            class="cursor-pointer"
            :color="
              user.roles.map((e) => e.name).includes('admin')
                ? 'primary'
                : 'grey'
            "
          >
            admin
          </q-badge>
          <q-badge
            class="cursor-pointer"
            :color="
              user.roles.map((e) => e.name).includes('sale')
                ? 'primary'
                : 'grey'
            "
            @click="toggleRole('sale', user)"
          >
            sale
          </q-badge>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import { inject, onMounted, onBeforeUnmount } from "vue";

const { dialog } = useQuasar();
const bus = inject("bus");

const { pagination } = usePagination("users");
const addUserToList = (user) => {
  pagination.value.data.unshift(user);
};

const toggleRole = (role, user) => {
  let message = "Do you want to add the role " + role;
  if (user.roles.map((e) => e.name).includes(role))
    message = "Do you want to remove the role " + role;

  dialog({
    title: "Confirm",
    message,
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    console.log(role);
  });
};

onMounted(() => {
  bus.on("userAdded", addUserToList);
});

onBeforeUnmount(() => {
  bus.off("userAdded", addUserToList);
});
</script>
