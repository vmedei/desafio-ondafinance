import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { useAccounts, useTransactions } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

function Amount({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <div className={positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
      <div className="flex items-center justify-end gap-1">
        {positive ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
        <span className="font-medium">{formatBRL(value)}</span>
      </div>
    </div>
  )
}

export function TransactionsPage() {
  const accountsQ = useAccounts()
  const accounts = accountsQ.data?.accounts ?? []
  const [accountId, setAccountId] = useState<string>('all')

  const effectiveAccountId = useMemo(
    () => (accountId === 'all' ? undefined : accountId),
    [accountId],
  )
  const txQ = useTransactions(effectiveAccountId)
  const txs = txQ.data?.transactions ?? []

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Transações</h2>
        <p className="text-sm text-muted-foreground">Histórico de movimentações.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtro</CardTitle>
          <CardDescription>Selecione uma conta para filtrar.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Label htmlFor="account">Conta</Label>
          <select
            id="account"
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            <option value="all">Todas</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
          <CardDescription>{txQ.isLoading ? 'Carregando...' : `${txs.length} transações`}</CardDescription>
        </CardHeader>
        <CardContent>
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
              {txs.map((t) => (
                <Link
                  key={t.id}
                  to={`/app/transacoes/${t.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-accent"
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

