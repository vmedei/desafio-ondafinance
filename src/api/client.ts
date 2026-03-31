import axios, { type AxiosError } from 'axios'

import { getLoginPath } from '@/lib/login-path'
import { useAuthStore } from '@/stores/auth-store'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function isAuthLoginRequest(url: string) {
  return url === '/auth/login' || url.startsWith('/auth/login?')
}

let redirectingFor401 = false

api.interceptors.request.use((config) => {
  const path = config.url ?? ''
  if (isAuthLoginRequest(path)) {
    return config
  }

  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    if (status === 401 && !isAuthLoginRequest(url) && !redirectingFor401) {
      redirectingFor401 = true
      useAuthStore.getState().clearSession()
      window.location.assign(getLoginPath())
    }
    return Promise.reject(error)
  },
)
