<template>
  <q-page padding v-if="item" :style-fn="vhPage" class="column">
    <div class="text-center text-h5">
      {{ item.name }}
    </div>
    <p>{{ item.description }}</p>
    <div class="text-right" v-if="item.type == 1">
      <div>{{ $t("purchasedQuantity") }} :{{ purchasedQty }}</div>
      <div>{{ $t("soldQuantity") }} :{{ item.ordered_quantity }}</div>
      <div>{{ $t("remainingQuantity") }} :{{ item.stock }}</div>
      <div>
        {{ Number(item.stock) + Number(item.ordered_quantity) - purchasedQty }}
      </div>
    </div>

    <q-separator spaced />
    <div class="row">
      <q-btn
        :label="item.status == 2 ? 'Enable' : 'Disable'"
        no-caps
        class="col"
        :color="item.status == 2 ? 'info' : 'warning'"
        @click="toggleStatus"
      />
    </div>
    <q-separator spaced />
    <div class="justify-evenly row">
      <q-btn icon="add" @click="correctStock(1)" />
      <q-btn icon="remove" @click="correctStock(-1)" />
    </div>
    <q-separator spaced />
    <q-list class="col overflow-auto" v-if="pagination" bordered separator>
      <q-item v-for="correction in pagination.data" :key="correction.id">
        <q-item-section>
          <q-item-label
            :class="[correction.stock > 0 ? 'text-secondary' : 'text-negative']"
          >
            {{ correction.stock }}
          </q-item-label>
          <q-item-label caption v-if="correction.note">
            {{ correction.note }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div
      class="row justify-center full-width"
      :class="{
        hidden:
          pagination?.current_page == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="max" input />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { api, vhPage } = useUtil();
const item = ref(null);
const route = useRoute();
const { dialog } = useQuasar();
const { t } = useI18n();

const toggleStatus = () => {
  dialog({
    title: `${item.value.status == 1 ? "Disable" : "Enable"} the product ${
      item.value.name
    }?`,
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `a-items/${route.params.item}/toggle-status`,
    }).then((response) => {
      item.value.status = response.data.a_item.status;
    });
  });
};

const purchasedQty = computed(() => {
  if (!item.value) return 0;
  else
    return item.value.purchases.reduce(
      (carry, e) => carry + (e.status == 1 ? e.quantity : 0),
      0
    );
});
const { pagination, current, max } = usePagination("corrections", {
  a_item_id: route.params.item,
});
const correctStock = (type) => {
  dialog({
    title: "Stock correction, " + (type > 0 ? "addition" : "reduction"),
    prompt: {
      model: "",
      type: "number",
      inputmode: "numeric",
      pattern: "[0-9*]",
      isValid: (val) => val != "" && val > 0,
    },
    position: "top",
    cancel: true,
    noBackdropDismiss: true,
  }).onOk((value) => {
    dialog({
      title: t("note"),
      prompt: {
        model: "",
      },
      position: "top",
      cancel: true,
      noBackdropDismiss: true,
    }).onOk((note) => {
      api({
        method: "POST",
        url: "corrections",
        data: {
          stock: value * type,
          a_item_id: item.value.id,
          note,
        },
      }).then((response) => {
        pagination.value.data.push(response.data.correction);
        item.value.stock += response.data.correction.stock;
      });
    });
  });
};
// const printQR = () => {
//   dialog({
//     component: PrintQrDialog,
//     componentProps: {
//       item: item.value,
//     },
//   });
// };
onMounted(() => {
  api({
    method: "GET",
    url: `a-items/${route.params.item}`,
  }).then((response) => {
    item.value = response.data.a_item;
  });
});
</script>
