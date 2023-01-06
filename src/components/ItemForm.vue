<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold">
      {{ update ? "Update" : "Item" }} Item {{ item?.name }}
    </div>
    <q-input v-model="formData.name" label="Name" required />
    <q-input v-model="formData.description" label="Description" required />
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
  update: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({
      name: "",
      description: "",
    }),
  },
});

const emit = defineEmits(["itemUpdated"]);

const formData = ref({
  name: props.item.name,
  description: props.item.description,
});

const submit = () => {
  const url = props.update ? "items/" + props.item.id : "items";
  api({
    method: props.update ? "PUT" : "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("itemUpdated", response.data.item);
      formData.value.name = "";
      formData.value.description = "";
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
