<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold">
      {{ $t("recordExpenseForm") }} ({{ expense.name }})
    </div>
    <q-input
      v-model.number="formData.price"
      :label="$t('price')"
      required
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      autofocus
    />
    <q-input v-model="formData.note" :label="$t('note')" required type="text" />
    <!-- <FileInput v-model="formData.picture" /> -->
    <div class="text-right q-gutter-x-sm">
      <q-btn :label="$t('cancel')" no-caps @click="$emit('closed')" />
      <q-btn :label="$t('submit')" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
// import FileInput from "./FileInput.vue";

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

const emit = defineEmits(["expenseRecorded", "closed"]);

const formData = ref({
  price: "",
  note: "",
  // picture: null,
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
</script>
