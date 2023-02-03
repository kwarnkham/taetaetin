<template>
  <q-page padding v-if="product">
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
      Purchase price: {{ product.latest_purchase.price }}
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
      @submit="submit"
      v-if="
        userStore.getUser &&
        userStore.getUser.roles.map((role) => role.name).includes('admin')
      "
    >
      <FileInput icon="add_a_photo" v-model="form.pictures" multiple required />
      <div class="text-right">
        <q-btn icon="upload" flat type="submit" />
      </div>
    </q-form>
    <div class="row wrap justify-between">
      <q-img
        :class="{ 'col-6': $q.screen.gt.xs }"
        :src="picture.name"
        v-for="picture in product.pictures"
        :key="picture.id"
        @click="showImage(picture.name)"
      >
        <div class="absolute-top text-right">
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
const { api, buildForm } = useUtil();
const route = useRoute();
const { dialog } = useQuasar();
const form = ref({
  type: "feature",
  type_id: route.params.product,
  pictures: [],
});
const submit = () => {
  api({
    method: "POST",
    url: "pictures",
    data: buildForm({
      type: form.value.type,
      type_id: form.value.type_id,
      pictures: form.value.pictures,
    }),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    product.value = response.data.feature;
  });
};
const deletePicture = (picture) => {
  dialog({
    title: "Confirm",
    message: "Do you want to delete the picture?",
    persistent: true,
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
    persistent: true,
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
    url: "features/" + route.params.product,
    method: "GET",
  }).then((response) => {
    product.value = response.data.feature;
  });
});
</script>
