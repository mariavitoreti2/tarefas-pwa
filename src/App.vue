<template>
  <OfflineBanner />
  <AppHeader />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import OfflineBanner from './components/OfflineBanner.vue';
</script>

<style scoped>
main {
  padding-bottom: 40px;
}
</style>