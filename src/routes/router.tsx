import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'
import { ProtectedRoute } from '@/routes/protected'
import { DashboardPage } from '@/routes/dashboard-page'
import { LoginPage } from '@/routes/login-page'
import { NotFoundPage } from '@/routes/not-found'
import { SettingsPage } from '@/routes/settings-page'
import { TransactionDetailsPage } from '@/routes/transaction-details-page'
import { TransactionsPage } from '@/routes/transactions-page'
import { TransferPage } from '@/routes/transfer-page'

/** Alinha com `base` do Vite (ex.: GitHub Pages em `/repo/`). */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

const routes = [
  { path: '/', element: <Navigate to="/app" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'transferir', element: <TransferPage /> },
      { path: 'transacoes', element: <TransactionsPage /> },
      { path: 'transacoes/:id', element: <TransactionDetailsPage /> },
      { path: 'configuracoes', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]

const basename = routerBasename()

export const router = createBrowserRouter(routes, basename ? { basename } : undefined)

