<template>
  <q-page padding :style-fn="vhPage" class="column">
    <div
      class="text-center"
      v-if="userStore.getUser?.roles.map((role) => role.name).includes('admin')"
    >
      <q-btn label="Add a new item" no-caps outline @click="addANewItem" />
    </div>
    <div>
      <q-input v-model.trim="search" label="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <ItemList
      :items="pagination.data"
      v-if="pagination"
      class="col"
      @item-updated="updateItem"
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
import ItemList from "src/components/ItemList.vue";
import useUtil from "src/composables/util";
import useSearchFilter from "src/composables/searchFilter";
import usePagination from "src/composables/pagination";
import { useQuasar } from "quasar";
import useItem from "src/composables/item";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();
const { pagination, max, current, updateQueryAndFetch } =
  usePagination("a-items");
const { search } = useSearchFilter({ updateQueryAndFetch });
const { dialog } = useQuasar();
const { vhPage } = useUtil();
const { showCreateAItem, submitItem } = useItem();
const updateItem = (item) => {
  const index = pagination.value.data.findIndex((e) => e.id == item.id);
  pagination.value.data[index] = item;
};

const addANewItem = () => {
  dialog({
    title: "Create a new item",
    position: "top",
    persistent: true,
    cancel: true,
    prompt: {
      model: "",
      isValid: (val) => val != "",
    },
  }).onOk((name) => {
    showCreateAItem(name).then((data) => {
      submitItem(data).then((value) => {
        pagination.value.data.unshift(value);
      });
    });
  });
};
</script>
