<template>
  <q-page padding>
    <div
      class="text-center text-h5 q-py-sm q-my-sm rounded-borders bg-grey text-white"
    >
      {{ $t("welcome") }}
    </div>
    <div class="row justify-around">
      <q-btn
        icon="point_of_sale"
        no-caps
        color="primary"
        @click="
          $router.push({
            name: userStore.getUser ? 'sale' : 'login',
          })
        "
      />
      <q-btn
        icon="request_quote"
        no-caps
        color="negative"
        v-if="
          userStore.getUser?.roles.map((role) => role.name).includes('admin')
        "
        @click="
          $router.push({
            name: userStore.getUser ? 'expenses' : 'login',
          })
        "
      />
    </div>
    <BalanceReport
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((role) => role.name).includes('admin')
      "
      class="q-mt-sm"
    />
    <div v-else-if="!userStore.getUser" class="text-center q-mt-md">
      <q-btn
        no-caps
        @click="
          $router.push({
            name: 'login',
          })
        "
        outline
      >
        {{ $t("loginToSeeReports") }}
      </q-btn>
    </div>
    <div>
      <TodoTask
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        class="q-mt-xs"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user-store";
import BalanceReport from "src/components/BalanceReport.vue";
import { computed, ref } from "vue";
import TodoTask from "src/components/TodoTask.vue";
import useUtil from "src/composables/util";

const userStore = useUserStore();
const { api } = useUtil();

const roles = ref([]);

if (userStore.getUser)
  api({
    method: "GET",
    url: "roles",
  }).then((response) => {
    roles.value = response.data.roles;
  });

const tasks = computed(() => {
  const tasks = roles.value.map((role) => role.tasks).flat();
  const temp = [];
  tasks.forEach((task) => {
    if (temp.length == 0) temp.push(task);
    else {
      const index = temp.findIndex((e) => e.id == task.id);
      if (index == -1) temp.push(task);
    }
  });
  return temp;
});
</script>
