<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold">
      {{ update ? "Update" : "Create" }} Expense {{ expense?.name }}
    </div>
    <q-input v-model="formData.name" label="Name" required />
    <div class="text-right q-gutter-x-sm">
      <q-btn label="Close" no-caps @click="$emit('closed')" v-if="update" />
      <q-btn label="Submit" no-caps type="submit" />
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
