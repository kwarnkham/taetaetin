<template>
  <div class="full-height column">
    <div>
      <q-input v-model="search" label="Search" />
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="item in items?.data" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <q-btn round icon="add" dense />
            <q-btn round icon="edit" dense @click="showEditItemDialog(item)" />
            <q-btn
              round
              icon="open_in_new"
              dense
              @click="showItemDetailsDialog(item)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="row justify-center full-width">
      <q-pagination v-model="current" :max="max" input />
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { debounce, useQuasar } from "quasar";
import EditItemDialog from "./dialogs/EditItemDialog.vue";
import ItemDetailDialog from "./dialogs/ItemDetailDialog.vue";

const { api, pickBy } = useUtil();
const { dialog } = useQuasar();
const items = ref(null);
const router = useRouter();
const route = useRoute();
const current = ref(Number(route.query.page ?? 1) ?? 1);
const search = ref(route.query.search ?? "");
const max = computed(
  () => Math.ceil(items.value?.total / items.value?.per_page) || 1
);

const showEditItemDialog = (item) => {
  dialog({
    component: EditItemDialog,
    componentProps: {
      item: item,
    },
  }).onOk((item) => {
    const index = items.value.data.findIndex((e) => e.id == item.id);
    if (index >= 0) items.value.data.splice(index, 1, item);
  });
};

const showItemDetailsDialog = (item) => {
  dialog({
    component: ItemDetailDialog,
    componentProps: {
      item: item,
    },
  });
};

watch(
  search,
  debounce(() => {
    router
      .replace({
        name: route.name,
        query: pickBy({
          ...route.query,
          search: search.value,
          page: undefined,
        }),
      })
      .then(() => {
        if (current.value != 1) {
          current.value = 1;
        } else {
          fetchMore();
        }
      });
  }, 500)
);
const fetchMore = () => {
  api({
    method: "GET",
    url: "items",
    params: route.query,
  }).then((response) => {
    items.value = response.data.items;
  });
};
watch(current, () => {
  router
    .replace({
      name: route.name,
      query: { ...route.query, page: current.value },
    })
    .then(fetchMore);
});
onMounted(() => {
  api({
    method: "GET",
    url: "items",
    params: route.query,
  }).then((response) => {
    items.value = response.data.items;
    current.value = response.data.items.current_page;
  });
});
</script>
