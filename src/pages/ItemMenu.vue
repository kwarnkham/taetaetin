<template>
  <q-page padding class="column">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="item-list" label="Item List" no-caps />
      <q-tab
        name="create-item"
        label="Create Item"
        no-caps
        v-if="userStore.getUser"
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="create-item">
        <CreateItem />
      </q-tab-panel>

      <q-tab-panel name="item-list" id="item-list">
        <ItemList />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import CreateItem from "src/components/CreateItem.vue";
import ItemList from "src/components/ItemList.vue";
import { useUserStore } from "src/stores/user-store";
import { ref, watch, onUpdated, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const tab = ref(route.query.tab ?? "item-list");
const router = useRouter();
watch(tab, () => {
  router.replace({
    name: route.name,
    query: {
      tab: tab.value,
    },
  });
});
const updateItemListHeight = () => {
  if (tab.value == "item-list")
    document.getElementById("item-list").style.height =
      document.querySelector(".q-tab-panels").clientHeight + "px";
};
onUpdated(updateItemListHeight);
onMounted(updateItemListHeight);
</script>
