<template>
  <div class="task-item" :class="{ done: task.done }">
    <label class="task-label">
      <input
        type="checkbox"
        :checked="task.done"
        @change="$emit('toggle', task.id)"
      />
      <span class="task-title">{{ task.title }}</span>
    </label>
    <button class="task-remove" @click="$emit('remove', task.id)">
      Remover
    </button>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle', 'remove']);
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
}

.task-item.done {
  opacity: 0.6;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-label input[type='checkbox'] {
  width: 20px;
  height: 20px;
  accent-color: #4a90d9;
}

.task-title {
  font-size: 1rem;
}

.task-item.done .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-remove {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
}

.task-remove:hover {
  text-decoration: underline;
}
</style>