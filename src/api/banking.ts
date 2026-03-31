import { api } from '@/api/client'
import type { Account, Transaction, TransferInput, User } from '@/types/banking'

export async function login(input: { email: string; password: string }) {
  const res = await api.post<{ token: string; user: User }>('/auth/login', input)
  return res.data
}

export async function logout(token: string) {
  const res = await api.post<{ ok: true }>(
    '/auth/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}

export async function getMe(token: string) {
  const res = await api.get<{ user: User | null }>('/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function listAccounts(token: string) {
  const res = await api.get<{ accounts: Account[] }>('/accounts', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export type TransactionDateRange = { from?: string; to?: string }

export async function listTransactions(
  token: string,
  accountId?: string,
  dateRange?: TransactionDateRange,
) {
  const params = new URLSearchParams()
  if (accountId) params.set('accountId', accountId)
  if (dateRange?.from) params.set('fromDate', dateRange.from)
  if (dateRange?.to) params.set('toDate', dateRange.to)
  const qs = params.toString()
  const url = qs ? `/transactions?${qs}` : '/transactions'
  const res = await api.get<{ transactions: Transaction[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function getTransaction(token: string, id: string) {
  const res = await api.get<{ transaction: Transaction }>(`/transaction/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function createTransfer(token: string, input: TransferInput) {
  const res = await api.post<{ transaction: Transaction; account: Account }>(
    '/transfer',
    input,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}

