import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTransfer,
  getTransaction,
  listAccounts,
  listTransactions,
  logout,
} from '@/api/banking'
import type { TransferInput } from '@/types/banking'
import { useAuthStore } from '@/stores/auth-store'

export function useAccounts() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => listAccounts(token!),
    enabled: Boolean(token),
  })
}

export function useTransactions(accountId?: string) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['transactions', { accountId: accountId ?? null }],
    queryFn: async () => listTransactions(token!, accountId),
    enabled: Boolean(token),
  })
}

export function useTransaction(id: string) {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => getTransaction(token!, id),
    enabled: Boolean(token) && Boolean(id),
  })
}

export function useTransfer() {
  const token = useAuthStore((s) => s.token)
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: TransferInput) => createTransfer(token!, input),
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
      return logout(token)
    },
    onSettled: () => clearSession(),
  })
}

