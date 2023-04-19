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
            <template
              v-if="
                userStore.getUser &&
                userStore.getUser.roles.map((e) => e.name).includes('admin')
              "
            >
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
import { useQuasar } from "quasar";
import EditItemDialog from "src/components/dialogs/EditItemDialog.vue";
import ProductFormDialog from "src/components/dialogs/ProductFormDialog.vue";
import usePagination from "src/composables/pagination";
import { useUserStore } from "src/stores/user-store";
import useSearchFilter from "src/composables/searchFilter";

const { dialog } = useQuasar();
const userStore = useUserStore();

const { pagination, max, current, updateQueryAndFetch } =
  usePagination("items");
const { search } = useSearchFilter({ updateQueryAndFetch });

const showCreateProductDialog = (item) => {
  dialog({
    component: ProductFormDialog,
    componentProps: {
      item_id: item.id,
      product: {
        price: item.latest_product?.price,
        purchase_price: item.latest_product?.latest_purchase?.price,
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
</script>
