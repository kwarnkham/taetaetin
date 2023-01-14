<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm full-width">
    <div class="text-h6 text-center text-weight-bold">
      {{ update ? "Update" : "Create" }} Topping {{ topping?.name }}
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

const { pickBy, api, buildForm } = useUtil();
const { notify } = useQuasar();
const bus = inject("bus");

const props = defineProps({
  update: {
    type: Boolean,
    default: false,
  },
  topping: {
    type: Object,
    default: () => ({
      name: "",
      account_name: "",
    }),
  },
});

const emit = defineEmits(["toppingSubmitted"]);

const formData = ref({
  name: props.topping.name,
  price: props.topping.price,
  cost: props.topping.cost,
});

if (props.update) formData.value._method = "PUT";

const submit = () => {
  const url = props.update ? "toppings/" + props.topping.id : "toppings";

  api({
    method: "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("toppingSubmitted", response.data.topping);
      if (!props.update) bus.emit("toppingCreated", response.data.topping);
      formData.value.name = "";
      formData.value.price = "";
      formData.value.cost = null;
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
