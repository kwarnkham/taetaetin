<template>
  <q-file
    :modelValue="modelValue"
    @update:model-value="updateValue"
    :label="label"
    accept=".jpg, image/*"
    @rejected="onRejected"
    clearable
    use-chips
    :multiple="multiple"
    :required="required"
  >
    <template v-slot:prepend>
      <q-icon :name="icon" />
    </template>
  </q-file>
</template>

<script setup>
// const props = defineProps(["modelValue", "icon", "label"]);
const props = defineProps({
  modelValue: {
    required: true,
  },
  icon: {
    type: String,
    default: "image",
  },
  label: {
    type: String,
    default: "Picture",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
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
