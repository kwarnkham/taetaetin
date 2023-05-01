<template>
  <div class="row">
    <div class="col-6 row">
      <q-icon name="phone" size="sm" />
      <input
        :value="phone"
        type="tel"
        class="col"
        @input="
          (e) => {
            $emit('dataUpdated', 'phone', e.target.value);
          }
        "
      />
    </div>
    <div class="col-6 row">
      <q-icon name="today" size="sm" />
      <input
        :value="created_at"
        type="date"
        class="col"
        @input="
          (e) => {
            $emit('dataUpdated', 'created_at', e.target.value);
          }
        "
      />
    </div>
    <div class="separator col-12"></div>
    <div class="col-12 row">
      <q-icon name="person" size="sm" />
      <input
        :value="customer"
        type="text"
        class="col"
        @input="
          (e) => {
            $emit('dataUpdated', 'customer', e.target.value);
          }
        "
      />
    </div>
    <div class="separator col-12"></div>

    <div class="col-12 row">
      <q-icon name="place" size="sm" />
      <textarea
        :value="address"
        type="text-area"
        class="col"
        rows="1"
        @input="
          (e) => {
            autogrow(e);
            $emit('dataUpdated', 'address', e.target.value);
          }
        "
      />
    </div>
    <div class="separator col-12"></div>
    <div class="col-12 row">
      <q-icon name="note" size="sm" />
      <textarea
        :value="note"
        type="text"
        class="col"
        rows="1"
        @input="
          (e) => {
            autogrow(e);
            $emit('dataUpdated', 'note', e.target.value);
          }
        "
      />
    </div>
    <div class="separator col-12"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  phone: {
    required: true,
  },
  created_at: {
    required: true,
  },
  customer: {
    required: true,
  },
  address: {
    required: true,
  },
  note: {
    required: true,
  },
  onDataUpdated: {
    type: Function,
    required: true,
  },
});

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
