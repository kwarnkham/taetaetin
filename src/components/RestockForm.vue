<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold">
      Resotck product {{ product.name }}
    </div>
    <q-input
      v-model.number="formData.price"
      label="Purcahse Price"
      required
      dense
      type="tel"
      autofocus
    />
    <q-input
      v-model.number="formData.quantity"
      type="tel"
      label="Stock"
      required
      dense
    />
    <!-- <q-date
      :landscape="$q.screen.gt.xs"
      v-model="formData.expired_on"
      title="Expire Date"
      subtitle="Optional"
    /> -->
    <!-- <FileInput v-model="formData.picture" label="Receipt of the purchase" /> -->

    <div class="text-right">
      <q-btn label="Submit" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import FileInput from "./FileInput.vue";

const { pickBy, api, buildForm } = useUtil();
const { notify } = useQuasar();
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["restocked"]);

const formData = ref({
  price: props.product.latest_batch.purchase.price,
  quantity: "",
  expired_on: null,
  picture: null,
});

const submit = () => {
  api({
    method: "POST",
    url: `features/${props.product.id}/restock`,
    data: buildForm(pickBy(formData.value)),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      emit("restocked", response.data.feature);
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
