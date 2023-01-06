<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold" v-if="update">
      Update Product {{ feature?.name }}
    </div>
    <q-input v-model="formData.name" label="Name" required dense />
    <q-input
      v-model.number="formData.purchase_price"
      label="Purchase Price"
      required
      dense
    />
    <q-input
      v-model.number="formData.price"
      label="Sale Price"
      required
      dense
    />
    <q-input v-model.number="formData.stock" label="Stock" required dense />
    <q-date
      :landscape="$q.screen.gt.xs"
      v-model="formData.expired_on"
      title="Expire Date"
      subtitle="Optional"
    />
    <q-input v-model="formData.note" label="Note" dense />

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
  item_id: {
    type: Number,
    required: true,
  },
  feature: {
    type: Object,
    default: () => ({
      name: "",
      price: "",
      purchase_price: "",
      stock: "1",
      note: "",
      expired_on: null,
    }),
  },
});

const emit = defineEmits(["featureUpdated"]);

const formData = ref({
  name: props.feature.name,
  price: props.feature.price,
  purchase_price: props.feature.purchase_price,
  stock: props.feature.stock,
  note: props.feature.note,
  expired_on: null,
  item_id: props.item_id,
});

const submit = () => {
  const url = props.update ? "features/" + props.feature.id : "features";
  api({
    method: props.update ? "PUT" : "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("featureUpdated", response.data.feature);
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
