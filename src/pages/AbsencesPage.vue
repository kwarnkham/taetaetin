<template>
  <q-page padding>
    <div class="q-gutter-y-sm q-pa-xs">
      <q-input v-model="from" label="From" type="date" />
      <q-separator vertical spaced />
      <q-input v-model="to" label="To" type="date" />
      <div class="text-right">
        <q-btn
          icon="search"
          @click="
            updateQueryAndFetch({
              from,
              to,
            })
          "
        />
      </div>

      <q-list v-if="pagination" bordered dense separator>
        <div class="text-center text-h6">
          Absence list of {{ route.query.name }}
        </div>
        <q-separator spaced />
        <q-item v-for="absence in pagination.data" :key="absence.id">
          <q-item-section>
            <q-item-label>
              {{ formatDate(new Date(absence.date), "DD/MM/YYYY") }}
            </q-item-label>
            <q-item-label>
              {{ absence.note }}
            </q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn icon="delete" @click="deleteAbsence(absence)" />
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
    </div>
  </q-page>
</template>

<script setup>
import useDateFilter from "src/composables/dateFilter";
import usePagination from "src/composables/pagination";
import { useRoute } from "vue-router";
import { date, useQuasar } from "quasar";
import useUtil from "src/composables/util";
const { formatDate } = date;
const { api } = useUtil();
const { dialog } = useQuasar();
const route = useRoute();
const { from, to } = useDateFilter(new Date().getMonth());
const { pagination, updateQueryAndFetch, current, max } = usePagination(
  "absences",
  {
    user_id: route.params.user,
    from: from.value,
    to: to.value,
  }
);

const deleteAbsence = (absence) => {
  dialog({
    title: "Confirm",
    message: "Do you want to delete record?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "DELETE",
      url: "absences/" + absence.id,
    }).then((_) => {
      const index = pagination.value.data.findIndex((e) => e.id == absence.id);
      pagination.value.data.splice(index, 1);
    });
  });
};
</script>
