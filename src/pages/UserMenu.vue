<template>
  <q-page padding :style-fn="vhPage" class="column q-gutter-y-sm">
    <UserForm @user-added="addUserToList" />
    <UserList
      v-if="pagination"
      :users="pagination.data"
      class="col"
      @user-updated="updateUser"
    />
    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </q-page>
</template>

<script setup>
import UserForm from "src/components/UserForm.vue";
import UserList from "src/components/UserList.vue";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();
const { pagination, current, max } = usePagination("users");

const addUserToList = (user) => {
  pagination.value.data.unshift(user);
};

const updateUser = (user) => {
  const index = pagination.value.data.findIndex((e) => e.id == user.id);
  pagination.value.data[index] = user;
};
</script>
