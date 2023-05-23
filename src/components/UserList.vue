<template>
  <q-list bordered separator class="overflow-auto">
    <q-item v-for="user in users" :key="user.id">
      <q-item-section>
        <q-item-label>{{ user.username }} ({{ user.name }})</q-item-label>
        <q-item-label caption>{{ user.email }}</q-item-label>
        <div class="row q-gutter-x-xs">
          <q-badge
            v-for="role in roles"
            :key="role.id"
            class="cursor-pointer"
            :color="
              user.roles.map((e) => e.id).includes(role.id) ? 'primary' : 'grey'
            "
            @click="toggleRole(role, user)"
          >
            {{ role.name }}
          </q-badge>
        </div>
        <div class="row q-gutter-x-xs q-mt-sm">
          <q-btn
            dense
            label="Record Absence"
            no-caps
            outline
            @click="recordAbsence(user)"
          />

          <q-btn
            dense
            label="Check Absence"
            no-caps
            outline
            @click="
              $router.push({
                name: 'absences',
                params: {
                  user: user.id,
                },
                query: {
                  name: user.name,
                },
              })
            "
          />
        </div>
        <div class="row q-gutter-x-xs q-mt-sm">
          <q-btn
            dense
            label="Record Overtime"
            no-caps
            outline
            @click="recordOvertime(user)"
          />

          <q-btn
            dense
            label="Check Overtime"
            no-caps
            outline
            @click="
              $router.push({
                name: 'overtimes',
                params: {
                  user: user.id,
                },
                query: {
                  name: user.name,
                },
              })
            "
          />
        </div>
      </q-item-section>
      <q-item-section side top>
        <q-btn
          icon="lock_reset"
          @click="resetPassword(user)"
          color="secondary"
          flat
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { date } from "quasar";

const { addToDate } = date;
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["userUpdated"]);
const { api } = useUtil();
const { dialog, localStorage, notify } = useQuasar();
const roles = localStorage.getItem("roles");

const resetPassword = (user) => {
  dialog({
    title: "Confirm",
    message: `Do you want to reset the password of ${user.username} : ${user.name}?`,
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `users/${user.id}/reset-password`,
    }).then((response) => {
      notify({
        message: `Password has been reset. Now, password is "${response.data.password}"`,
        type: "info",
        timeout: 0,
        closeBtn: true,
      });
    });
  });
};

const toggleRole = (role, user) => {
  if (role.name == "admin") {
    notify({
      message: "Cannot modify admin role",
      type: "info",
    });
    return;
  }
  let message = "Do you want to add the role " + role.name;
  if (user.roles.map((e) => e.id).includes(role.id))
    message = "Do you want to remove the role " + role.name;

  dialog({
    title: "Confirm",
    message,
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `users/${user.id}/roles/${role.id}/toggle`,
    }).then((response) => {
      emit("userUpdated", response.data.user);
    });
  });
};

const recordAbsence = (user) => {
  dialog({
    title: `Record absence for "${user.name}"`,
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
    prompt: {
      label: "Absence date",
      model: new Date().toJSON().slice(0, 10),
      type: "date",
      isValid: (val) => val != "",
    },
  }).onOk((date) => {
    dialog({
      title: "Reason for the absence",
      position: "top",
      cancel: true,
      noBackdropDismiss: true,
      prompt: {
        model: "",
      },
    }).onOk((note) => {
      api({
        method: "POST",
        url: "absences",
        data: {
          user_id: user.id,
          note,
          date,
        },
      }).then(() => {
        notify({
          message: "Success",
          type: "positive",
        });
      });
    });
  });
};

const recordOvertime = (user) => {
  dialog({
    title: `Record overtime for "${user.name}"`,
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
    prompt: {
      label: "From",
      model: addToDate(new Date(), { hours: 6, minutes: 30 })
        .toJSON()
        .slice(0, 16),
      type: "datetime-local",
      isValid: (val) => val != "",
    },
  }).onOk((from) => {
    dialog({
      title: `Record overtime for "${user.name}"`,
      position: "top",
      cancel: true,
      noBackdropDismiss: true,
      prompt: {
        label: "To",
        model: addToDate(new Date(), { hours: 6, minutes: 30 })
          .toJSON()
          .slice(0, 16),
        type: "datetime-local",
        isValid: (val) => val != "",
      },
    }).onOk((to) => {
      dialog({
        title: "Reason for the overtime",
        position: "top",
        cancel: true,
        noBackdropDismiss: true,
        prompt: {
          model: "",
        },
      }).onOk((note) => {
        api({
          method: "POST",
          url: "overtimes",
          data: {
            from: new Date(from).toJSON(),
            to: new Date(to).toJSON(),
            note,
            user_id: user.id,
          },
        }).then(() => {
          notify({
            message: "Success",
            type: "positive",
          });
        });
      });
    });
  });
};
</script>
