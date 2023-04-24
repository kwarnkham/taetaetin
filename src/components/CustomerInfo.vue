<template>
  <div class="row">
    <div class="col-6 row">
      <q-icon name="phone" size="sm" />
      <input v-model="customerInfo.phone" type="tel" class="col" />
    </div>
    <div class="col-6 row">
      <q-icon name="today" size="sm" />
      <input v-model="customerInfo.date" type="date" class="col" />
    </div>
    <div class="separator col-12"></div>
    <div class="col-12 row">
      <q-icon name="person" size="sm" />
      <input v-model="customerInfo.name" type="text" class="col" />
    </div>
    <div class="separator col-12"></div>

    <div class="col-12 row">
      <q-icon name="place" size="sm" />
      <textarea
        v-model="customerInfo.address"
        type="text-area"
        class="col"
        rows="1"
        @input="autogrow"
      />
    </div>
    <div class="separator col-12"></div>
    <div class="col-12 row">
      <q-icon name="note" size="sm" />
      <textarea
        v-model="customerInfo.note"
        type="text"
        class="col"
        rows="1"
        @input="autogrow"
      />
    </div>
    <div class="separator col-12"></div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, watch } from "vue";

const { localStorage } = useQuasar();

const customerInfo = ref(
  localStorage.getItem("customerInfo") ?? {
    phone: "",
    date: new Date().toJSON().slice(0, 10),
    name: "",
    address: "",
    note: "",
  }
);

watch(
  customerInfo,
  () => {
    localStorage.set("customerInfo", customerInfo.value);
  },
  {
    deep: true,
  }
);

const autogrow = (e) => {
  const element = e.target;
  element.style.height = element.scrollHeight + "px";
};
</script>

<style scoped>
.separator {
  min-height: 1px;
  background-color: black;
}
input,
textarea {
  border: none;
}
</style>
