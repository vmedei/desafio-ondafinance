import axios from 'axios'

import { useAuthStore } from '@/stores/auth-store'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const path = config.url ?? ''
  if (path === '/auth/login' || path.startsWith('/auth/login?')) {
    return config
  }

  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
