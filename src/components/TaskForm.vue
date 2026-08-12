<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
      v-model="newTask"
      type="text"
      placeholder="Nova tarefa..."
      class="task-input"
    />
    <button type="submit" class="task-button">Adicionar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);
const newTask = ref('');

function handleSubmit() {
  if (newTask.value.trim()) {
    emit('add', newTask.value);
    newTask.value = '';
  }
}
</script>

<style scoped>
.task-form {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.task-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.task-input:focus {
  border-color: #4a90d9;
}

.task-button {
  padding: 12px 20px;
  background-color: #4a90d9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-button:hover {
  background-color: #357abd;
}
</style>