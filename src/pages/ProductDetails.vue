<template>
  <q-page padding v-if="product" :style-fn="vhPage" class="column">
    <div class="text-h6">{{ product.name }}</div>
    <div>From : {{ product.item.name }}</div>
    <div>Description: {{ product.item.description }}</div>
    <div>Price : {{ product.price }}</div>
    <div
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((role) => role.name).includes('admin')
      "
    >
      Purchase price: {{ product.latest_purchase?.price }}
    </div>
    <div class="row items-center">
      <div>Stock : {{ product.stock }}</div>
      <q-btn
        icon="info"
        flat
        @click="showStockDetails"
        v-if="
          userStore.getUser &&
          userStore.getUser.roles.map((role) => role.name).includes('admin')
        "
      />
    </div>
    <q-form
      class="full-width"
      @submit="submit"
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((role) => role.name).includes('sale')
      "
    >
      <FileInput icon="add_a_photo" v-model="form.pictures" multiple required />
      <div class="text-right">
        <q-btn
          icon="upload"
          flat
          type="submit"
          :color="form.pictures.length <= 0 ? '' : 'primary'"
          :disabled="form.pictures.length <= 0"
        />
      </div>
    </q-form>
    <div
      class="row wrap justify-between no-wrap full-width overflow-auto q-gutter-x-sm col"
    >
      <q-img
        :class="{
          'col-6': $q.screen.gt.xs,
          'col-10': $q.screen.lt.sm,
          'full-width': product.pictures.length == 1,
        }"
        fit="contain"
        :src="picture.name"
        v-for="picture in product.pictures"
        :key="picture.id"
        @click="showImage(picture.name)"
      >
        <div
          class="absolute-top text-right"
          v-if="
            userStore.getUser &&
            userStore.getUser.roles.map((role) => role.name).includes('sale')
          "
        >
          <q-btn
            icon="delete_forever"
            color="warning"
            flat
            @click.stop="deletePicture(picture)"
          />
        </div>
      </q-img>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import StockDetailsDialog from "src/components/dialogs/StockDetailsDialog";
import { useUserStore } from "src/stores/user-store";
import FileInput from "src/components/FileInput.vue";

const userStore = useUserStore();
const product = ref(null);
const { api, buildForm, vhPage } = useUtil();
const route = useRoute();
const { dialog } = useQuasar();
const form = ref({
  type: "product",
  type_id: route.params.product,
  pictures: [],
});
const submit = () => {
  Promise.all(
    form.value.pictures.map((picture) =>
      api({
        method: "POST",
        url: "pictures",
        data: buildForm({
          type: form.value.type,
          type_id: form.value.type_id,
          pictures: [picture],
        }),
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    )
  ).then((responses) => {
    product.value = responses.find(
      (e) =>
        e.data.product.pictures.length ==
        Math.max(...responses.map((e) => e.data.product.pictures.length))
    ).data.product;
    form.value.pictures = [];
  });
};
const deletePicture = (picture) => {
  dialog({
    title: "Confirm",
    message: "Do you want to delete the picture?",
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "DELETE",
      url: "pictures/" + picture.id,
    }).then(() => {
      product.value.pictures = product.value.pictures.filter(
        (e) => e.id != picture.id
      );
    });
  });
};
const showImage = (src) => {
  dialog({
    noBackdropDismiss: true,
    maximized: true,
    message: `<img src='${src}' style='width:90vw;'>`,
    html: true,
  });
};
const showStockDetails = () => {
  dialog({
    component: StockDetailsDialog,
    componentProps: {
      product: product.value,
    },
  }).onOk((updatedProduct) => {
    product.value = updatedProduct;
    showStockDetails();
  });
};
onMounted(() => {
  api({
    url: "products/" + route.params.product,
    method: "GET",
  }).then((response) => {
    product.value = response.data.product;
  });
});
</script>
