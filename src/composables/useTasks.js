import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'tarefas-pwa-tasks';

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return JSON.parse(stored);
  }

  return [
    { id: 1, title: 'Estudar Progressive Web Apps', done: false },
    { id: 2, title: 'Configurar o Service Worker', done: false },
    { id: 3, title: 'Testar funcionamento offline', done: true },
  ];
}

const tasks = ref(loadTasks());

let nextId =
  tasks.value.length > 0
    ? Math.max(...tasks.value.map((t) => t.id)) + 1
    : 1;

watch(
  tasks,
  (newTasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  },
  { deep: true },
);

export function useTasks() {
  const pendingTasks = computed(() =>
    tasks.value.filter((t) => !t.done),
  );

  const completedTasks = computed(() =>
    tasks.value.filter((t) => t.done),
  );

  function addTask(title) {
    if (!title.trim()) return;

    tasks.value.push({
      id: nextId++,
      title: title.trim(),
      done: false,
    });
  }

  function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);

    if (task) {
      task.done = !task.done;
    }
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    toggleTask,
    removeTask,
  };
}