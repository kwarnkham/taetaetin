<template>
  <q-file
    :modelValue="modelValue"
    @update:model-value="updateValue"
    label="Picture"
    accept=".jpg, image/*"
    capture="environment"
    @rejected="onRejected"
    clearable
    use-chips
  >
    <template v-slot:prepend>
      <q-icon :name="icon" />
    </template>
  </q-file>
</template>

<script setup>
const props = defineProps(["modelValue", "icon"]);
const emit = defineEmits(["update:modelValue"]);
const onRejected = () => {
  notify({
    message: "Please select image file type",
    type: "warning",
  });
};

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>
