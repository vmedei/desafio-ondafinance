import type { Account } from '@/types/banking'

export function accountFilterLabel(accountId: string, accounts: Account[]) {
  return accountId === 'all'
    ? 'Todas as contas'
    : `${accounts.find((a) => a.id === accountId)?.name ?? 'Conta'}`
}
