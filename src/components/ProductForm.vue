<template>
  <q-form @submit.prevent="submit" class="q-gutter-y-sm">
    <div class="text-h6 text-center text-weight-bold" v-if="update">
      Update Product {{ product?.name }}
    </div>
    <q-input v-model="formData.name" label="Name" required dense />
    <q-input
      v-model.number="formData.purchase_price"
      type="tel"
      label="Purchase Price"
      required
      dense
    />
    <q-input
      v-model.number="formData.price"
      type="tel"
      label="Sale Price"
      required
      dense
    />
    <q-input
      v-model.number="formData.stock"
      label="Stock"
      required
      dense
      type="tel"
    />
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
  product: {
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

const emit = defineEmits(["productUpdated"]);

const formData = ref({
  name: props.product.name,
  price: props.product.price,
  purchase_price: props.product.purchase_price,
  stock: props.product.stock,
  note: props.product.note,
  expired_on: null,
  item_id: props.item_id,
});

const submit = () => {
  const url = props.update ? "features/" + props.product.id : "features";
  api({
    method: props.update ? "PUT" : "POST",
    url,
    data: pickBy(formData.value),
  })
    .then((response) => {
      emit("productUpdated", response.data.feature);
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
