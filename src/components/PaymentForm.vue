<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm full-width">
    <div class="text-h6 text-center text-weight-bold">
      {{ update ? "Update" : "Create" }} Payment {{ payment?.name }}
    </div>
    <q-select
      v-if="!update"
      v-model="formData.payment_type_id"
      :options="paymentTypes"
      label="Payment Type"
      option-value="id"
      option-label="name"
      map-options
      emit-value
      autofocus
    />
    <template v-if="formData.payment_type_id != 1">
      <q-input v-model="formData.number" label="Number" required type="tel" />
      <q-input v-model="formData.account_name" label="Account Name" required />
      <FileInput icon="qr_code" label="Payment QR" v-model="formData.qr" />
    </template>

    <div class="text-right">
      <q-btn label="Submit" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, inject } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import FileInput from "./FileInput.vue";

const { pickBy, api, buildForm } = useUtil();
const { notify, localStorage } = useQuasar();
const bus = inject("bus");

const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Object,
    default: () => ({
      name: "",
      account_name: "",
    }),
  },
});

const emit = defineEmits(["paymentSubmitted"]);
const paymentTypes = localStorage.getItem("paymentTypes");

const formData = ref({
  number: props.payment.number,
  payment_type_id: props.update
    ? props.payment.payment_type?.id
    : paymentTypes[0]?.id,
  account_name: props.payment.account_name,
  qr: null,
});

if (props.update) formData.value._method = "PUT";

const submit = () => {
  const url = props.update ? "payments/" + props.payment.id : "payments";

  api({
    method: "POST",
    url,
    data: buildForm(pickBy(formData.value)),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      emit("paymentSubmitted", response.data.payment);
      if (!props.update) bus.emit("paymentCreated", response.data.payment);
      formData.value.number = "";
      formData.value.account_name = "";
      formData.value.qr = null;
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
