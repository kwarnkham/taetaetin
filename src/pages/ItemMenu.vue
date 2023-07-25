<template>
  <q-page padding :style-fn="vhPage" class="column">
    <div
      class="text-center"
      v-if="userStore.getUser?.roles.map((role) => role.name).includes('admin')"
    >
      <q-btn
        :label="$t('addANewProduct')"
        no-caps
        outline
        @click="addANewItem"
        color="primary"
      />
    </div>
    <div>
      <q-input v-model.trim="search" :label="$t('search')">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <div>
        <q-radio v-model="aItemType" label="Stocked" val="1" />
        <q-radio v-model="aItemType" label="Non stocked" val="2" />
      </div>
      <div>
        <q-radio v-model="status" label="Endabled" val="1" />
        <q-radio v-model="status" label="Disabled" val="2" />
      </div>
    </div>
    <ItemList
      :items="pagination.data"
      v-if="pagination"
      class="col"
      @item-updated="updateItem"
    />
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
import ItemList from "src/components/ItemList.vue";
import useUtil from "src/composables/util";
import useSearchFilter from "src/composables/searchFilter";
import usePagination from "src/composables/pagination";
import { useQuasar } from "quasar";
import useItem from "src/composables/item";
import { useUserStore } from "src/stores/user-store";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const { t } = useI18n();
const aItemType = ref("1");
const status = ref("1");
const { dialog, localStorage } = useQuasar();
const route = useRoute();
if (route.query.tenant !== undefined)
  localStorage.set("tenantSpace", route.query.tenant);
const userStore = useUserStore();
const { pagination, max, current, updateQueryAndFetch } = usePagination(
  "a-items",
  {
    tenant: localStorage.getItem("tenantSpace") ?? undefined,
    type: aItemType.value,
    status: status.value,
  }
);
const { search } = useSearchFilter({ updateQueryAndFetch });
watch(aItemType, () => {
  updateQueryAndFetch({ type: aItemType.value });
});

watch(status, () => {
  updateQueryAndFetch({ status: status.value });
});

const { vhPage } = useUtil();
const { showCreateAItem, submitItem } = useItem();

const updateItem = (item) => {
  const index = pagination.value.data.findIndex((e) => e.id == item.id);
  pagination.value.data[index] = item;
};

const addANewItem = () => {
  dialog({
    title: t("createANewProduct"),
    position: "top",
    persistent: true,
    cancel: true,
    prompt: {
      model: "",
      isValid: (val) => val != "",
    },
  }).onOk((name) => {
    showCreateAItem(name, aItemType.value).then((data) => {
      submitItem(data).then((value) => {
        pagination.value.data.unshift(value);
      });
    });
  });
};
</script>
