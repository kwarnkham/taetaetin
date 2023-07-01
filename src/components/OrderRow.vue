<template>
  <tr>
    <td class="text-left number-column">
      {{ number + 1 }}
    </td>

    <td
      class="text-left"
      @click="showSelectAItemsDialog()"
      :class="{ 'text-white bg-indigo': item?.type == 2 }"
    >
      {{ item?.name }}
    </td>

    <td class="text-right" @click="editQuantity(item)">
      {{ item?.quantity }}
    </td>
    <td
      class="text-right"
      @click="editPrice(item)"
      :class="{ 'text-indigo': item?.discount }"
    >
      <span v-if="item?.price">
        {{ (item.price - (item?.discount || 0)).toLocaleString() }}
        <span v-if="item.discount">
          (-{{ item.discount.toLocaleString() }})
        </span>
      </span>
    </td>
    <td class="text-right">
      <span v-if="item?.quantity * item?.price">
        {{
          (
            item?.quantity *
            (item?.price - (item?.discount || 0))
          ).toLocaleString()
        }}
      </span>
    </td>
  </tr>
</template>

<script setup>
import SelectAItemsDialog from "src/components/dialogs/SelectAItemsDialog";
import { useQuasar } from "quasar";
import { useOrderStore } from "src/stores/order-store";

const emit = defineEmits("dataUpdated");
const orderStore = useOrderStore();
const { dialog } = useQuasar();
const props = defineProps({
  item: {
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  onDataUpdated: {
    type: Function,
    required: true,
  },
  a_items: {
    type: Array,
    required: true,
  },
});

const editQuantity = (item) => {
  if (item)
    dialog({
      title: "Edit quantity for " + item.name,
      message:
        item.type == 1 ? `Max : ${getRealStock(item)}` : "Non stocked item",
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: item.quantity,
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        isValid: (val) =>
          val != "" &&
          val >= 0 &&
          (item.type == 1 ? val <= getRealStock(item) : item.type == 2),
      },
    }).onOk((qty) => {
      qty = Number(qty);
      const a_items = JSON.parse(JSON.stringify(props.a_items));
      if (qty > 0) a_items[props.number].quantity = qty;
      else a_items.splice(props.number, 1);
      emit("dataUpdated", "a_items", a_items);
    });
};

const editPrice = (item) => {
  if (item?.type == 1)
    dialog({
      title: "Discount for " + item.name,
      message: `Normal price is ${item.price}`,
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: item.price - (item.discount || 0),
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        isValid: (val) => val != "" && val >= 0 && val <= item.price,
      },
    }).onOk((price) => {
      price = Number(price);
      const discount = item.price - price;
      const a_items = JSON.parse(JSON.stringify(props.a_items));
      a_items[props.number].discount = discount;
      emit("dataUpdated", "a_items", a_items);
    });
  else if (item?.type == 2)
    dialog({
      title: "Edit price for " + item.name,
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: item.price - (item.discount || 0),
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        isValid: (val) => val != "" && val >= 0,
      },
    }).onOk((price) => {
      price = Number(price);
      const a_items = JSON.parse(JSON.stringify(props.a_items));
      a_items[props.number].price = price;
      emit("dataUpdated", "a_items", a_items);
    });
};

const showSelectAItemsDialog = () => {
  dialog({
    component: SelectAItemsDialog,
    componentProps: {
      a_items: props.a_items,
    },
  }).onOk((a_item) => {
    const a_items = JSON.parse(JSON.stringify(props.a_items));
    a_items[props.number] = { ...a_item, quantity: 1 };
    emit("dataUpdated", "a_items", a_items);
  });
};

const getRealStock = (a_item) => {
  let existed = props.a_items
    .filter((e) => !!e)
    .reduce((carry, e) => {
      if (a_item.id == e?.id) return e.quantity + carry;
      else return carry;
    }, 0);

  existed -= orderStore.getExistedItems.reduce(
    (carry, e) => carry + (e.id == a_item.id ? e.quantity : 0),
    0
  );

  return a_item.stock - existed + a_item.quantity;
};
</script>
