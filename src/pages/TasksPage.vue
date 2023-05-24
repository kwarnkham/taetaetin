<template>
  <q-page padding class="column" :style-fn="vhPage">
    <div>
      <q-btn label="Add New Task" outline no-caps @click="addNewTask" />
    </div>
    <q-separator spaced />
    <q-list bordered separator v-if="pagination" class="col overflow-auto">
      <q-item
        v-for="task in pagination.data"
        :key="task.id"
        :to="{
          name: 'task-details',
          params: {
            task: task.id,
          },
        }"
      >
        <q-item-section>
          <q-item-label>
            {{ task.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { pagination, current, max } = usePagination("tasks");
const { dialog } = useQuasar();
const { api, vhPage } = useUtil();

const addNewTask = () => {
  dialog({
    title: "Create a new task",
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
    prompt: {
      model: "",
      isValid: (val) => val != "",
    },
  }).onOk((name) => {
    api({
      method: "POST",
      url: "tasks",
      data: {
        name,
      },
    }).then((response) => {
      pagination.value.data.unshift(response.data.task);
    });
  });
};
</script>
