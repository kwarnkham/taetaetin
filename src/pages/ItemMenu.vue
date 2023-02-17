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
        v-if="
          userStore.getUser &&
          userStore.getUser.roles.map((e) => e.name).includes('admin')
        "
      />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="col">
      <q-tab-panel name="create-item" id="create-item">
        <CreateItem @vnode-mounted="updateItemListHeight" />
      </q-tab-panel>

      <q-tab-panel name="item-list" id="item-list">
        <ItemList @vnode-mounted="updateItemListHeight" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import CreateItem from "src/components/CreateItem.vue";
import ItemList from "src/components/ItemList.vue";
import { useUserStore } from "src/stores/user-store";
import useTabPanels from "src/composables/tabPanels";

const { tab, updateItemListHeight } = useTabPanels("item-list");
const userStore = useUserStore();
</script>
