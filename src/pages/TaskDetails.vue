<template>
  <q-page padding :style="vhPage" class="column">
    <div class="q-mb-xs">
      Name:
      <q-btn no-caps outline @click="updateTask('name')">
        {{ task?.name }}
      </q-btn>
    </div>
    <div>
      Sort:
      <q-btn no-caps outline @click="updateTask('sort')">
        {{ task?.sort }}
      </q-btn>
    </div>
    <div class="row justify-evenly q-my-xs">
      <q-btn
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        no-caps
        rounded
        :color="
          role.tasks.map((e) => e.id).includes(task.id) ? 'primary' : 'grey'
        "
        @click="assignTask(role)"
      />
    </div>
    <div class="text-center text-h6">
      Duties <q-btn icon="add" rounded @click="addDuty" />
    </div>
    <q-list bordered separator v-if="pagination" class="col overflow-auto">
      <q-item
        v-for="duty in pagination.data"
        :key="duty.id"
        clickable
        @click="editDuty(duty)"
      >
        <q-item-section>
          <q-item-label>
            {{ duty.name }}
          </q-item-label>
          <q-item-label caption v-if="duty.note">
            {{ duty.note }}
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
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { api, vhPage } = useUtil();
const task = ref("");
const { dialog, localStorage } = useQuasar();

const roles = ref(localStorage.getItem("roles"));

const updateTask = (key) => {
  const title = key == "sort" ? "Task sorting" : "Edit name";
  const prompt = {
    model: task.value[key],
  };
  if (key == "sort") {
    prompt.type = "number";
    prompt.inputmode = "numeric";
    prompt.pattern = "[0-9]*";
    prompt.isValid = (val) => val != "" && val > 0;
  }
  const data = {
    name: task.value.name,
    sort: task.value.sort,
  };

  dialog({
    title,
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt,
  }).onOk((value) => {
    data[key] = value;
    api({
      method: "PUT",
      url: `tasks/${task.value.id}`,
      data,
    }).then((response) => {
      task.value = response.data.task;
    });
  });
};

const assignTask = (role) => {
  api({
    method: "POST",
    url: `roles/${role.id}/tasks/toggle/${task.value.id}`,
  }).then((response) => {
    const index = roles.value.findIndex((e) => e.id == role.id);
    roles.value[index] = response.data.role;
    localStorage.set("roles", roles.value);
  });
};

api({
  method: "GET",
  url: "tasks/" + route.params.task,
}).then((response) => {
  task.value = response.data.task;
});

const { pagination, current, max } = usePagination("duties", {
  task_id: route.params.task,
});

const addDuty = () => {
  dialog({
    title: `Create new duty for ${task.value.name}`,
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      isValid: (val) => val != "",
    },
  }).onOk((name) => {
    dialog({
      title: `Do you and any note for dutiy '${name}'`,
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: "",
      },
    }).onOk((note) => {
      api({
        method: "POST",
        url: "duties",
        data: {
          name,
          note: note || undefined,
          task_id: task.value.id,
        },
      }).then((response) => {
        pagination.value.data.unshift(response.data.duty);
      });
    });
  });
};

const editDuty = (duty) => {
  dialog({
    title: "Choose an option",
    position: "top",
    noBackdropDismiss: true,
    cancel: true,
    options: {
      items: [
        {
          label: "Name",
          value: "name",
        },
        {
          label: "Note",
          value: "note",
        },
        {
          label: "Delete",
          value: "delete",
        },
      ],
      model: "name",
    },
  }).onOk((option) => {
    if (option == "delete") {
      dialog({
        title: "Confirm",
        message: `Do you want to delete duty - '${duty.name}'?`,
        noBackdropDismiss: true,
        cancel: true,
      }).onOk(() => {
        api({
          method: "DELETE",
          url: `duties/${duty.id}`,
        }).then(() => {
          pagination.value.data.splice(
            pagination.value.data.findIndex((e) => e.id == duty.id),
            1
          );
        });
      });
    } else if (["name", "note"].includes(option)) {
      dialog({
        title: "Change " + option,
        position: "top",
        noBackdropDismiss: true,
        cancel: true,
        prompt: {
          model: duty[option],
          isValid: (val) => (option == "name" ? val != "" : true),
        },
      }).onOk((value) => {
        const data = {
          name: duty.name,
          note: duty.note,
        };
        data[option] = value;

        api({
          method: "PUT",
          url: `duties/${duty.id}`,
          data,
        }).then((response) => {
          const index = pagination.value.data.findIndex((e) => e.id == duty.id);
          pagination.value.data[index] = response.data.duty;
        });
      });
    }
  });
};
</script>
