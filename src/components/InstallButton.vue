<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const canInstall = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt.value = event;
    canInstall.value = true;
  });
});

async function installApp() {
  if (!deferredPrompt.value) return;

  deferredPrompt.value.prompt();

  const { outcome } = await deferredPrompt.value.userChoice;

  if (outcome === 'accepted') {
    canInstall.value = false;
  }

  deferredPrompt.value = null;
}
</script>

<template>
  <button v-if="canInstall" @click="installApp">
    Instalar aplicativo
  </button>
</template>