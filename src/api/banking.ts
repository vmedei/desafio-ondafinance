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

export async function listTransactions(token: string, accountId?: string) {
  const qs = accountId ? `?accountId=${encodeURIComponent(accountId)}` : ''
  const res = await api.get<{ transactions: Transaction[] }>(`/transactions${qs}`, {
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

