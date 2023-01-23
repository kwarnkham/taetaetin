<template>
  <div>
    <q-list>
      <q-item
        tag="label"
        v-ripple
        v-for="payment in payments"
        :key="payment.id"
      >
        <q-item-section avatar top>
          <q-radio v-model="selectedPayment" :val="payment" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ payment.payment_type.name }}</q-item-label>
          <q-item-label caption> {{ payment.number }}</q-item-label>
          <q-item-label caption> {{ payment.acount_name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="text-center">
      <q-img
        :src="selectedPayment.qr"
        v-if="selectedPayment.qr"
        height="200px"
        width="200px"
      />
    </div>
    <q-form @submit.prevent="submit">
      <q-input
        v-model.number="formData.amount"
        label="Amount"
        type="tel"
        required
        :rules="[
          (val) => (val > 0 && val <= remaining) || 'Amount is not right',
        ]"
      />
      <q-input v-model="formData.note" label="Note" type="text" />
      <FileInput v-model="formData.picture" icon="image" label="Screenshot" />
      <div class="text-right">
        <q-btn type="submit" label="Pay" flat no-caps />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, computed, watch } from "vue";
import FileInput from "src/components/FileInput.vue";
import useUtil from "src/composables/util";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["submitted"]);
const { api, buildForm, pickBy } = useUtil();
const { localStorage } = useQuasar();
const payments = localStorage.getItem("payments") ?? [];
const selectedPayment = ref(
  payments.find((e) => e.payment_type.id == 1) ?? payments[0]
);
const remaining = computed(
  () =>
    props.order.amount -
    props.order.discount -
    props.order.payments.reduce((carry, e) => carry + e.pivot.amount, 0)
);
watch(selectedPayment, () => {
  formData.value.payment_id = selectedPayment.value.id;
});
const formData = ref({
  amount: remaining.value,
  note: "",
  picture: null,
  payment_id: selectedPayment.value.id,
});

const submit = () => {
  api({
    method: "POST",
    url: `orders/${props.order.id}/pay`,
    data: buildForm(pickBy(formData.value)),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    emit("submitted", response.data.order);
  });
};
</script>
