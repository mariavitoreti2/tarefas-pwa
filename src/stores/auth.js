import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import authApi from '../api/authApi'
import {
  usePushNotifications,
} from '../composables/usePushNotifications'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(
    localStorage.getItem('access_token'),
  )

  const refreshToken = ref(
    localStorage.getItem('refresh_token'),
  )

  const isAuthenticated = computed(
    () => !!accessToken.value,
  )

  const {
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications()

  async function login(email, password) {
    const { data } = await authApi.login(
      email,
      password,
    )

    accessToken.value = data.access_token
    refreshToken.value = data.refresh_token

    localStorage.setItem(
      'access_token',
      data.access_token,
    )

    localStorage.setItem(
      'refresh_token',
      data.refresh_token,
    )

    // Se a permissão já foi concedida,
    // faz a subscription em segundo plano.
    if (
      'serviceWorker' in navigator &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      navigator.serviceWorker.ready
        .then((reg) => subscribe(reg))
        .catch(() => {})
    }
  }

  async function logout() {
    await unsubscribe()

    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    requestPermission,
    subscribe,
  }
})