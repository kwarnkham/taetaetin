<template>
  <q-card>
    <q-card-section>
      {{ task.name }}
      <q-list>
        <q-item v-for="duty in task.duties" :key="duty.id">
          <q-item-section>
            <div>
              {{ duty.name }}
            </div>
            <div v-if="duty.note">Note: {{ duty.note }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>
