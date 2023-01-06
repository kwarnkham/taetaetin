<template>
  <q-page padding>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="create-item" label="Create Item" no-caps />
      <q-tab name="item-list" label="Item List" no-caps />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="create-item">
        <CreateItem />
      </q-tab-panel>

      <q-tab-panel name="item-list">
        <ItemList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import CreateItem from "src/components/CreateItem.vue";
import ItemList from "src/components/ItemList.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const tab = ref(route.query.tab ?? "create-item");
const router = useRouter();

watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      tab: tab.value,
    },
  });
});
</script>
