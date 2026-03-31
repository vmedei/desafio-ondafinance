import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { BalanceDisplay } from '@/components/balance-display'
import { accountFilterLabel, TransactionsFilters } from '@/components/transactions-filters'
import { useAccounts, useTransactions } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'

function firstName(fullName: string | undefined) {
  const n = fullName?.trim()
  if (!n) return 'Usuário'
  return n.split(/\s+/)[0] ?? 'Usuário'
}

function toYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function Amount({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <div
      className={
        positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      }
    >
      <div className="flex items-center justify-end gap-1">
        {positive ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
        <span className="font-medium tabular-nums">{formatBRL(value)}</span>
      </div>
    </div>
  )
}

export function TransactionsPage() {
  const user = useAuthStore((s) => s.user)
  const greeting = useMemo(() => firstName(user?.name), [user?.name])

  const { data: accountsData } = useAccounts()
  const accounts = accountsData?.accounts ?? []
  const [accountId, setAccountId] = useState<string>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const effectiveAccountId = useMemo(
    () => (accountId === 'all' ? undefined : accountId),
    [accountId],
  )
  const dateRangeQuery = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined
    return { from: toYMD(dateRange.from), to: toYMD(dateRange.to) }
  }, [dateRange])
  const txQ = useTransactions(effectiveAccountId, dateRangeQuery)
  const txs = txQ.data?.transactions ?? []

  const selectedAccount = accountId !== 'all' ? accounts.find((a) => a.id === accountId) : undefined

  return (
    <div className="grid gap-6">
      <div
        className="dashboard-enter flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ ['--dashboard-delay' as string]: '0ms' }}
      >
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            Transações · <span className="text-primary">{greeting}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Histórico de movimentações com filtros por conta e por período.
          </p>
        </div>

        {selectedAccount && (
          <BalanceDisplay currency={selectedAccount.currency} balance={selectedAccount.balance} />
        )}
      </div>

      <Card
        className="dashboard-enter shadow-4"
        style={{ ['--dashboard-delay' as string]: '80ms' }}
      >
        <CardHeader className="pb-2">
          <CardTitle>Movimentações</CardTitle>
          <CardDescription>
            {txQ.isLoading ? 'Carregando...' : `${txs.length} transações`}
            {accountId !== 'all' ? ` · ${accountFilterLabel(accountId, accounts)}` : ''}
            {dateRangeQuery ? ' · período filtrado' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TransactionsFilters
            accounts={accounts}
            accountId={accountId}
            onAccountIdChange={setAccountId}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {txQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : txQ.isError ? (
            <p className="text-sm text-destructive">
              {txQ.error instanceof Error ? txQ.error.message : 'Erro ao carregar.'}
            </p>
          ) : txs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem transações.</p>
          ) : (
            <div className="grid gap-2">
              {txs.map((t, i) => (
                <Link
                  key={t.id}
                  to={`/app/transacoes/${t.id}`}
                  className="dashboard-row-enter anim-sm grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-accent"
                  style={{ ['--dashboard-row-delay' as string]: `${40 + i * 35}ms` }}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.description ?? '—'} • {formatDateTime(t.createdAt)}
                    </div>
                  </div>
                  <Amount value={t.amount} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
