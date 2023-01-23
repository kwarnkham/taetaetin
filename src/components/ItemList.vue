<template>
  <div class="full-height column">
    <div>
      <q-input v-model.trim="search" label="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="item in pagination?.data" :key="item.id">
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <div class="row justify-start q-gutter-x-sm q-mt-sm">
            <template v-if="userStore.getUser">
              <q-btn
                round
                icon="add"
                dense
                @click="showCreateProductDialog(item)"
              />
              <q-btn
                round
                icon="edit"
                dense
                @click="showEditItemDialog(item)"
              />
              <q-btn
                round
                icon="open_in_new"
                dense
                @click="showItemDetailsDialog(item)"
              />
            </template>

            <q-btn
              rounded
              label="More"
              no-caps
              @click="
                $router.push({
                  name: 'item-details',
                  params: {
                    item: item.id,
                  },
                  query: {
                    item: item.id,
                  },
                })
              "
            />
          </div>
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
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";
import { useQuasar } from "quasar";
import EditItemDialog from "src/components/dialogs/EditItemDialog.vue";
import ItemDetailDialog from "src/components/dialogs/ItemDetailDialog.vue";
import ProductFormDialog from "src/components/dialogs/ProductFormDialog.vue";
import usePagination from "src/composables/pagination";
import { useUserStore } from "src/stores/user-store";

const { api } = useUtil();
const { dialog } = useQuasar();
const userStore = useUserStore();

const fetchItems = (params) => {
  return new Promise((resolve, reject) => {
    api(
      {
        method: "GET",
        url: "items",
        params: params,
      },
      false
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const { pagination, max, search, current } = usePagination(fetchItems);

const showCreateProductDialog = (item) => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id: item.id,
      product: {
        price: item.latest_feature.price,
        purchase_price: item.latest_feature.latest_purchase.price,
      },
    },
  });
};

const showEditItemDialog = (item) => {
  dialog({
    component: EditItemDialog,
    componentProps: {
      item: item,
    },
  }).onOk((item) => {
    const index = pagination.value.data.findIndex((e) => e.id == item.id);
    if (index >= 0) pagination.value.data.splice(index, 1, item);
  });
};

const showItemDetailsDialog = (item) => {
  dialog({
    component: ItemDetailDialog,
    componentProps: {
      item: item,
    },
  });
};
</script>
