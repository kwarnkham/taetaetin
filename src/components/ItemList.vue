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
          <q-item-label :class="{ 'text-indigo': item.type == 2 }">
            {{ item.name }}
          </q-item-label>
          <q-item-label caption v-if="item.type == 1">
            Stock : {{ item.stock }}
          </q-item-label>
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
                v-if="item.type == 1"
              />
              <q-btn
                round
                icon="edit"
                dense
                @click="showEditItemDialog(item)"
              />
              <q-btn
                flat
                icon="more"
                dense
                no-caps
                @click="
                  $router.push({
                    name: 'item-details',
                    params: {
                      item: item.id,
                    },
                  })
                "
              />
            </template>
          </div>
        </q-item-section>
        <q-item-section side top>
          <q-item-label> Price : {{ item.price }} </q-item-label>
          <q-item-label
            caption
            v-if="item.type == 1 && userStore.getUser && item.latest_purchase"
          >
            Purchase price: {{ item.latest_purchase.price }}
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
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import { useUserStore } from "src/stores/user-store";
import useSearchFilter from "src/composables/searchFilter";
import useItem from "src/composables/item";
import useUtil from "src/composables/util";

const { dialog } = useQuasar();
const userStore = useUserStore();
const { reStock } = useItem();
const { api } = useUtil();

const { pagination, max, current, updateQueryAndFetch } =
  usePagination("a-items");
const { search } = useSearchFilter({ updateQueryAndFetch });

const showCreateProductDialog = (item) => {
  if (item.type == 1)
    reStock(item).then((response) => {
      const index = pagination.value.data.findIndex(
        (e) => e.id == response.data.a_item.id
      );
      pagination.value.data[index] = response.data.a_item;
    });
};

const showEditItemDialog = (item) => {
  dialog({
    title: `Edit item ${item.name}`,
    message: "Choose an option:",
    position: "top",
    options: {
      type: "radio",
      model: "name",
      items: [
        { label: "Name", value: "name" },
        { label: "Price", value: "price" },
      ],
    },
    cancel: true,
    persistent: true,
  }).onOk((option) => {
    const prompt = {
      model: item[option],
    };
    if (option == "name") {
      prompt.isValid = (val) => val != "";
    } else if (option == "price") {
      prompt.isValid = (val) => val != "" || val >= 0;
      prompt.type = "number";
      prompt.inputmode = "numeric";
      prompt.pattern = "[0-9]*";
    }
    dialog({
      title: `Edit item ${item.name} - ${option}`,
      position: "top",
      prompt,
      cancel: true,
      noBackdropDismiss: true,
    }).onOk((val) => {
      const data = JSON.parse(JSON.stringify(item));
      data[option] = val;
      api({
        method: "PUT",
        url: `a-items/${item.id}`,
        data,
      }).then((response) => {
        const index = pagination.value.data.findIndex((e) => e.id == item.id);
        pagination.value.data[index] = response.data.a_item;
      });
    });
  });
};
</script>
