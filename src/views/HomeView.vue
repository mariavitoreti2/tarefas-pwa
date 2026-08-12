<template>
  <div>
    <TaskForm @add="addTask" />

    <section v-if="pendingTasks.length > 0">
      <h2 class="section-title">Pendentes ({{ pendingTasks.length }})</h2>
      <TaskItem
        v-for="task in pendingTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <section v-if="completedTasks.length > 0">
      <h2 class="section-title">Concluídas ({{ completedTasks.length }})</h2>
      <TaskItem
        v-for="task in completedTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @remove="removeTask"
      />
    </section>

    <p v-if="tasks.length === 0" class="empty-message">
      Nenhuma tarefa cadastrada. Adicione uma acima.
    </p>
  </div>
</template>

<script setup>
import TaskForm from '../components/TaskForm.vue';
import TaskItem from '../components/TaskItem.vue';
import { useTasks } from '../composables/useTasks';

const { tasks, pendingTasks, completedTasks, addTask, toggleTask, removeTask } =
  useTasks();
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
  margin-top: 20px;
}

.empty-message {
  text-align: center;
  color: #999;
  margin-top: 40px;
  font-size: 0.95rem;
}
</style>