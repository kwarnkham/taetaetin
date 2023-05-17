<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    maximized
    no-route-dismiss
    class="full-height"
    position="bottom"
  >
    <div
      class="q-dialog-plugin q-pa-sm window-height column no-wrap bg-white"
      style="width: 500px; max-width: 100vw"
    >
      <div class="row justify-between items-center">
        <div class="text-weight-bold text-subtitle1">Select Item for Sale</div>
        <q-btn icon="close" flat @click="onDialogCancel" dense />
      </div>
      <div class="col column">
        <q-input label="Prodcut Name" v-model="search" autofocus />
        <q-list
          v-if="saleItems.length"
          class="overflow-auto col"
          padding
          separator
          bordered
        >
          <q-item v-for="a_item in saleItems" :key="a_item.id">
            <q-item-section>
              <div :class="{ 'text-primary': a_item.isInOrder }">
                {{ a_item.name }}
              </div>
              <q-item-label overline>{{ a_item.price }}</q-item-label>
              <div class="q-mt-sm q-gutter-x-xs">
                <q-btn
                  label="Select"
                  no-caps
                  @click="onDialogOK(a_item)"
                  :disable="a_item.realStock < 1 && a_item.type == 1"
                  :color="
                    a_item.realStock || a_item.type == 2 ? 'primary' : 'grey'
                  "
                />
                <q-btn
                  label="Re-stock"
                  no-caps
                  @click="addStock(a_item)"
                  color="secondary"
                  v-if="a_item.type == 1"
                />
              </div>
            </q-item-section>
            <q-item-section
              side
              top
              :class="{ 'text-red': a_item.realStock < 1 }"
            >
              <span v-if="a_item.type == 1">
                Stock:{{ a_item.realStock }}
              </span>
              <span v-else class="text-grey"> Non stocked item </span>
            </q-item-section>
          </q-item>
          <q-item v-if="search">
            <q-item-section></q-item-section>
            <q-item-section side top>
              <q-btn
                no-caps
                flat
                @click="createItem(search)"
                v-if="!saleItems.map((e) => e.name).includes(search)"
              >
                Create new item "{{ search }}"
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          class="text-right q-mt-sm"
          v-else-if="aItems.length == 0 && search"
        >
          <q-btn no-caps flat @click="createItem(search)">
            Create new item "{{ search }}"
          </q-btn>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { debounce, useDialogPluginComponent, useQuasar } from "quasar";
import useUtil from "src/composables/util";
import useItem from "src/composables/item";
import { useOrderStore } from "src/stores/order-store";
import { computed, watch, ref } from "vue";

const { dialog } = useQuasar();
const { api } = useUtil();
const { reStock } = useItem();

const addStock = (aItem) => {
  reStock(aItem).then((response) => {
    const index = aItems.value.findIndex(
      (e) => e.id == response.data.a_item.id
    );
    aItems.value[index] = response.data.a_item;
  });
};
const props = defineProps({
  a_items: {
    type: Array,
    required: true,
  },
});

const orderStore = useOrderStore();
const aItems = ref([]);
const search = ref("");
const getRealStock = (a_item) => {
  let existed = props.a_items.reduce((carry, e) => {
    if (a_item.id == e?.id) return e.quantity + carry;
    else return carry;
  }, 0);

  existed -= orderStore.getExistedItems.reduce((carry, e) => {
    if (a_item.id == e?.id) return e.quantity + carry;
    else return carry;
  }, 0);

  return a_item.stock - existed;
};

const isInOrder = (a_item) => {
  return props.a_items.map((e) => e?.id).includes(a_item.id);
};

defineEmits([...useDialogPluginComponent.emits]);
const { showCreateAItem, submitItem } = useItem();

const createItem = (name) => {
  showCreateAItem(name).then((data) => {
    submitItem(data).then((value) => {
      aItems.value.unshift(value);
    });
  });
};
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const fetch = () => {
  api({
    method: "GET",
    url: "a-items",
    params: {
      search: search.value || undefined,
      per_page: 10,
    },
  }).then((response) => {
    aItems.value = response.data.data.data;
  });
};

fetch();

watch(search, debounce(fetch, 700));

const saleItems = computed(() => {
  return aItems.value.map((e) => ({
    ...e,
    realStock: getRealStock(e),
    isInOrder: isInOrder(e),
  }));
});
</script>
