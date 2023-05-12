<template>
  <q-page padding :style-fn="vhPage" class="column">
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

const { pagination, max, current, updateQueryAndFetch } =
  usePagination("a-items");
const { search } = useSearchFilter({ updateQueryAndFetch });

const { vhPage } = useUtil();
const updateItem = (item) => {
  const index = pagination.value.data.findIndex((e) => e.id == item.id);
  pagination.value.data[index] = item;
};
</script>
