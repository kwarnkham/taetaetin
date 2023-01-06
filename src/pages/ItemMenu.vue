<template>
  <q-page padding>
    <div class="q-gutter-y-md">
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

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
import CreateItem from "src/components/CreateItem.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tab = ref(route.query.tab ?? "create-item");
</script>
