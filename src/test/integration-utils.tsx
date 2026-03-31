import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { initMockApi } from '@/api/mock-adapter'
import { mockDb } from '@/api/mock-db'
import { login } from '@/api/banking'
import { AppShell } from '@/components/layout/app-shell'
import { DashboardPage } from '@/routes/dashboard-page'
import { LoginPage } from '@/routes/login-page'
import { ProtectedRoute } from '@/routes/protected'
import { TransactionsPage } from '@/routes/transactions-page'
import { TransferPage } from '@/routes/transfer-page'
import { useAuthStore } from '@/stores/auth-store'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function resetClientAndMockState() {
  mockDb.resetMockDatabase()
  localStorage.clear()
  useAuthStore.getState().clearSession()
}

/** Garante API mock + adapter (idempotente). */
export function ensureMockApi() {
  initMockApi()
}

export async function seedAuthenticatedSession() {
  const data = await login({ email: 'vinicius@onda.finance', password: '1234' })
  useAuthStore.getState().setSession({ token: data.token, user: data.user })
}

function AppLayout() {
  return (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  )
}

function IntegrationRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transferir" element={<TransferPage />} />
        <Route path="transacoes" element={<TransactionsPage />} />
      </Route>
    </Routes>
  )
}

export function renderIntegrationApp(initialEntry: string) {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <IntegrationRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
