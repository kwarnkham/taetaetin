<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm full-width">
    <div class="text-h6 text-center text-weight-bold">
      {{ update ? "Update" : "Create" }} Service {{ service?.name }}
    </div>
    <q-input v-model="formData.name" label="Name" required />

    <q-input
      v-model.number="formData.price"
      label="Price"
      required
      type="tel"
    />
    <q-input v-model.number="formData.cost" label="Cost" required type="tel" />

    <div class="text-right">
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
  service: {
    type: Object,
    default: () => ({
      name: "",
      price: "",
      cost: "",
    }),
  },
});

const emit = defineEmits(["serviceSubmitted"]);

const formData = ref({
  name: props.service.name,
  price: props.service.price,
  cost: props.service.cost,
});

if (props.update) formData.value._method = "PUT";

const submit = () => {
  const url = props.update ? "services/" + props.service.id : "services";

  api({
    method: "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("serviceSubmitted", response.data.service);
      if (!props.update) bus.emit("serviceCreated", response.data.service);
      formData.value.name = "";
      formData.value.price = "";
      formData.value.cost = "";
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
