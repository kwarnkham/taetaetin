<template>
  <q-form
    @submit.prevent="submit"
    class="q-gutter-y-sm q-pa-sm rounded-borders"
    :class="{ 'shadow-1': !update }"
  >
    <div class="text-h6 text-center text-weight-bold" v-if="update">
      Update Expense {{ expense.name }}
    </div>
    <div class="text-h6 text-center text-weight-bold" v-else>
      Create new expense type
    </div>
    <q-input v-model="formData.name" label="Name" required />
    <div class="text-right q-gutter-x-sm">
      <q-btn
        label="Close"
        no-caps
        @click="$emit('closed')"
        v-if="update"
        outline
      />
      <q-btn label="Submit" no-caps type="submit" outline />
    </div>
  </q-form>
</template>

<script setup>
import { ref, inject } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";

const { pickBy, api } = useUtil();
const { notify } = useQuasar();
const bus = inject("bus");
const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
  expense: {
    type: Object,
    default: () => ({
      name: "",
    }),
  },
});

const emit = defineEmits(["expenseSubmitted", "closed"]);

const formData = ref({
  name: props.expense.name,
});

const submit = () => {
  const url = props.update ? "expenses/" + props.expense.id : "expenses";
  api({
    method: props.update ? "PUT" : "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("expenseSubmitted", response.data.expense);
      if (!props.update) bus.emit("expenseCreated", response.data.expense);
      formData.value.name = "";
      notify({
        message: "Success",
        type: "positive",
      });
    })
    .catch((e) => {
      console.warn(e);
    });
};
</script>
