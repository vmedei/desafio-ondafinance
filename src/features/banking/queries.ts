import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTransfer,
  getTransaction,
  listAccounts,
  listTransactions,
  logout,
  type TransactionDateRange,
} from '@/api/banking'
import type { TransferInput } from '@/types/banking'
import { useAuthStore } from '@/stores/auth-store'

export function useAccounts() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['accounts'],
    queryFn: listAccounts,
    enabled: Boolean(token),
  })
}

export function useTransactions(accountId?: string, dateRange?: TransactionDateRange) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: [
      'transactions',
      { accountId: accountId ?? null, from: dateRange?.from ?? null, to: dateRange?.to ?? null },
    ],
    queryFn: () => listTransactions(accountId, dateRange),
    enabled: Boolean(token),
  })
}

export function useTransaction(id: string) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransaction(id),
    enabled: Boolean(token) && Boolean(id),
  })
}

export function useTransfer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TransferInput) => createTransfer(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['accounts'] })
      await qc.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useLogout() {
  const token = useAuthStore((s) => s.token)
  const clearSession = useAuthStore((s) => s.clearSession)
  return useMutation({
    mutationFn: async () => {
      if (!token) return { ok: true as const }
      return logout()
    },
    onSettled: () => clearSession(),
  })
}
