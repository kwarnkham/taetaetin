<template>
  <q-list bordered separator class="overflow-auto col">
    <template v-if="items.length">
      <q-item v-for="item in items" :key="item.id">
        <q-item-section>
          <q-item-label :class="{ 'text-indigo': item.type == 2 }">
            {{ item.name }}
            <q-icon name="do_not_disturb_on" v-if="item.status == 2" />
          </q-item-label>
          <q-item-label caption v-if="item.type == 1">
            {{ $t("stock") }} : {{ item.stock }}
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
                @click="showRestockProductDialog(item)"
                v-if="item.type == 1"
              />
              <q-btn
                round
                icon="edit"
                dense
                @click="showEditItemDialog(item)"
              />
              <q-btn
                round
                :icon="item.status == 1 ? 'do_not_disturb_on' : 'check'"
                dense
                @click="toggleStatus(item)"
              />
              <q-btn
                flat
                icon="more"
                dense
                no-caps
                v-if="item.type == 1"
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
          <q-item-label>
            {{ $t("salePrice") }} : {{ item.price }}
          </q-item-label>
          <q-item-label
            caption
            v-if="item.type == 1 && userStore.getUser && item.latest_purchase"
          >
            {{ $t("purchasePrice") }}: {{ item.latest_purchase.price }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <div v-else class="text-h6 text-center">No products</div>
  </q-list>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";
import useItem from "src/composables/item";
import useUtil from "src/composables/util";
import { useI18n } from "vue-i18n";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["itemUpdated"]);
const { dialog } = useQuasar();
const userStore = useUserStore();
const { reStock } = useItem();
const { api } = useUtil();
const { t } = useI18n();

const showRestockProductDialog = (item) => {
  if (item.type == 1)
    reStock(item).then((response) => {
      emit("itemUpdated", response.data.a_item);
    });
};

const toggleStatus = (item) => {
  dialog({
    title: `${item.status == 1 ? "Disable" : "Enable"} the product ${
      item.name
    }?`,
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `a-items/${item.id}/toggle-status`,
    }).then((response) => {
      emit("itemUpdated", { ...item, status: response.data.a_item.status });
    });
  });
};

const showEditItemDialog = (item) => {
  dialog({
    title: `${t("editProduct")} (${item.name})`,
    message: t("chooseAnOption") + ":",
    position: "top",
    options: {
      type: "radio",
      model: "name",
      items: [
        { label: t("name"), value: "name" },
        { label: t("salePrice"), value: "price" },
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
      prompt.isValid = (val) => val != "" || val > 0;
      prompt.type = "number";
      prompt.inputmode = "numeric";
      prompt.pattern = "[0-9]*";
    }
    dialog({
      title: `${t("editProduct")} (${item.name} - ${t(
        option == "price" ? "salePrice" : option
      )})`,
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
        emit("itemUpdated", response.data.a_item);
      });
    });
  });
};
</script>
