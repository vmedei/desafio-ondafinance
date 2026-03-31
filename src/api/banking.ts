import { api } from '@/api/client'
import type { Account, Transaction, TransferInput, User } from '@/types/banking'

export async function login(input: { email: string; password: string }) {
  const res = await api.post<{ token: string; user: User }>('/auth/login', input)
  return res.data
}

export async function logout() {
  const res = await api.post<{ ok: true }>('/auth/logout', {})
  return res.data
}

export async function getMe() {
  const res = await api.get<{ user: User | null }>('/me')
  return res.data
}

export async function listAccounts() {
  const res = await api.get<{ accounts: Account[] }>('/accounts')
  return res.data
}

export type TransactionDateRange = { from?: string; to?: string }

export async function listTransactions(accountId?: string, dateRange?: TransactionDateRange) {
  const params = new URLSearchParams()
  if (accountId) params.set('accountId', accountId)
  if (dateRange?.from) params.set('fromDate', dateRange.from)
  if (dateRange?.to) params.set('toDate', dateRange.to)
  const qs = params.toString()
  const url = qs ? `/transactions?${qs}` : '/transactions'
  const res = await api.get<{ transactions: Transaction[] }>(url)
  return res.data
}

export async function getTransaction(id: string) {
  const res = await api.get<{ transaction: Transaction }>(`/transaction/${id}`)
  return res.data
}

export async function createTransfer(input: TransferInput) {
  const res = await api.post<{ transaction: Transaction; account: Account }>('/transfer', input)
  return res.data
}
