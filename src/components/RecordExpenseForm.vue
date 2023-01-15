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
    <q-file
      v-model="formData.picture"
      label="Picture"
      accept=".jpg, image/*"
      capture="environment"
      @rejected="onRejected"
      clearable
      use-chips
    >
      <template v-slot:prepend>
        <q-icon name="image" />
      </template>
    </q-file>
    <div class="text-right">
      <q-btn label="Submit" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";

const { pickBy, api, buildForm } = useUtil();
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
  picture: null,
});

const submit = () => {
  api({
    method: "POST",
    url: `expenses/${props.expense.id}/record`,
    data: buildForm(pickBy(formData.value)),
    headers: {
      "Content-Type": "multipart/form-data",
    },
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

const onRejected = () => {
  notify({
    message: "Please select image file type",
    type: "warning",
  });
};
</script>
