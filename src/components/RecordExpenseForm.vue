<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold">
      Record Expense {{ expense.name }}
    </div>
    <q-input
      v-model.number="formData.price"
      label="Price"
      required
      type="tel"
      autofocus
    />
    <q-input v-model="formData.note" label="Note" required type="text" />
    <div class="text-right">
      <q-btn label="Submit" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";

const { pickBy, api } = useUtil();
const { notify } = useQuasar();
const props = defineProps({
  expense: {
    type: Object,
    default: () => ({
      name: "",
    }),
  },
});

const emit = defineEmits(["expenseRecorded"]);

const formData = ref({
  price: "",
  note: "",
});

const submit = () => {
  api({
    method: props.update ? "PUT" : "POST",
    url: `expenses/${props.expense.id}/record`,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("expenseRecorded", response.data.purchase);
      formData.value.price = "";
      formData.value.note = "";
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
