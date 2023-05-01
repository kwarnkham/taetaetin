<template>
  <div>
    <q-markup-table
      class="fit bg-transparent"
      separator="cell"
      wrap-cells
      flat
      dense
    >
      <thead>
        <tr>
          <th class="text-left number-column">#</th>
          <th class="text-left">Name</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price(-Dis)</th>
          <th class="text-right">Amt</th>
        </tr>
      </thead>
      <tbody>
        <OrderRow
          v-for="(item, key) in a_items"
          :key="key"
          :item="item"
          :number="key"
          @dataUpdated="emitDataUpdated"
          :a_items="a_items"
        />
        <tr>
          <td colspan="4" class="text-right">Total</td>
          <td class="text-right">{{ total.toLocaleString() }}</td>
        </tr>
        <tr @click="applyOrderPaid">
          <td colspan="4" class="text-right">Paid</td>
          <td class="text-right">{{ paid.toLocaleString() }}</td>
        </tr>
        <tr @click="applyOrderDiscount">
          <td colspan="4" class="text-right">Discount</td>
          <td class="text-right">{{ discount.toLocaleString() }}</td>
        </tr>
        <tr>
          <td colspan="4" class="text-right">Remaining</td>
          <td
            class="text-right"
            :class="{ 'text-red': total - paid - discount < 0 }"
          >
            {{ (total - paid - discount).toLocaleString() }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";
import OrderRow from "src/components/OrderRow";

const props = defineProps({
  paid: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  a_items: {
    type: Array,
    required: true,
  },
  onDataUpdated: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits("dataUpdated");
const emitDataUpdated = (...args) => {
  emit("dataUpdated", args[0], args[1]);
};
const { dialog } = useQuasar();

const applyOrderPaid = () => {
  dialog({
    title: "Paid amount",
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      model: props.paid > 0 ? props.paid : "",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9*]",
      isValid: (val) => val <= total.value - props.discount && val >= 0,
    },
  }).onOk((val) => {
    emit("dataUpdated", "paid", Number(val));
  });
};
const applyOrderDiscount = () => {
  dialog({
    title: "Order discount",
    noBackdropDismiss: true,
    cancel: true,
    position: "top",
    prompt: {
      model: props.discount > 0 ? props.discount : "",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9*]",
      isValid: (val) => val <= total.value - props.paid && val >= 0,
    },
  }).onOk((val) => {
    emit("dataUpdated", "discount", Number(val));
  });
};

const total = computed(() => {
  return props.a_items
    .filter((v) => !!v)
    .reduce(
      (carry, e) => (e.price - (e.discount ?? 0)) * e.quantity + carry,
      0
    );
});
</script>

<style scoped lang="scss">
.q-markup-table {
  border: 1px solid black;
}
table {
  position: relative;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  th {
    border-color: black;
  }
}

.number-column {
  width: 1em;
}
tr {
  td {
    font-size: 11px !important;
  }
}
</style>
