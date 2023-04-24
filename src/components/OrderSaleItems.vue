<template>
  <div>
    <q-markup-table
      class="fit bg-transparent"
      separator="cell"
      wrap-cells
      flat
      dense
    >
      <thead class="bg-black">
        <tr>
          <th class="text-left number-column">#</th>
          <th class="text-left">Name</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price(-Dis)</th>
          <th class="text-right">Amt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in aItems" :key="key">
          <td class="text-left number-column">
            {{ key + 1 }}
          </td>

          <td class="text-left" @click="showSelectAItemsDialog(key)">
            {{ item?.name }}
          </td>

          <td class="text-right" @click="editQuantity(item, key)">
            {{ item?.quantity }}
          </td>
          <td
            class="text-right"
            @click="applyItemDiscount(item, key)"
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
        <!-- <tr>
          <td colspan="5" class="text-center">
            <q-btn
              icon="add"
              dense
              flat
              color="primary"
              @click="$emit('addRow')"
            />
          </td>
        </tr> -->
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import SelectAItemsDialog from "src/components/dialogs/SelectAItemsDialog";

const { dialog, localStorage } = useQuasar();
const aItems = ref(localStorage.getItem("aItems") ?? new Array(10));

watch(
  aItems,
  () => {
    localStorage.set("aItems", aItems.value);
  },
  { deep: true }
);

const showSelectAItemsDialog = (key) => {
  dialog({
    component: SelectAItemsDialog,
    componentProps: {
      aItems: aItems.value,
    },
  }).onOk((aItem) => {
    aItems.value[key] = { ...aItem, quantity: 1 };
  });
};

const getRealStock = (aItem) => {
  const existed = aItems.value.reduce((carry, e) => {
    if (aItem.id == e?.id) return e.quantity + carry;
    else return carry;
  }, 0);
  return aItem.stock - existed + aItem.quantity;
};

const editQuantity = (item, key) => {
  if (item)
    dialog({
      title: "Edit quantity for " + item.name,
      message: `Stock : ${getRealStock(item)}`,
      position: "top",
      noBackdropDismiss: true,
      cancel: true,
      prompt: {
        model: item.quantity,
        type: "number",
        inputmode: "numeric",
        pattern: "[0-9]*",
        isValid: (val) => val != "" && val >= 0 && val <= getRealStock(item),
      },
    }).onOk((qty) => {
      qty = Number(qty);
      if (qty > 0) aItems.value[key].quantity = qty;
      else aItems.value.splice(key, 1);
    });
};

const applyItemDiscount = (item, key) => {
  if (item)
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
      aItems.value[key].discount = discount;
    });
};
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
  color: white;
  th {
    border-color: white;
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
