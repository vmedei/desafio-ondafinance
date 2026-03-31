import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, Send } from 'lucide-react'

import { BalanceDisplay } from '@/components/balance-display'
import { useAccounts, useTransactions } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth-store'

function firstName(fullName: string | undefined) {
  const n = fullName?.trim()
  if (!n) return 'Usuário'
  return n.split(/\s+/)[0] ?? 'Usuário'
}

function AmountPill({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        positive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive',
      ].join(' ')}
    >
      {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {formatBRL(value)}
    </span>
  )
}

/** Uma instância por conta: `useTransactions(accountId)` precisa do id da própria aba, não da aba selecionada. */
function AccountTransactionsPanel({
  accountId,
  accountName,
}: {
  accountId: string
  accountName: string
}) {
  const txQ = useTransactions(accountId)
  const txs = txQ.data?.transactions ?? []

  return (
    <Card
      className="dashboard-enter relative overflow-hidden"
      style={{ ['--dashboard-delay' as string]: '120ms' }}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>Transações recentes</CardTitle>
            <CardDescription>
              {accountName} · Últimas movimentações desta conta.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pb-20 sm:pb-24">
        {txQ.isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : txs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem transações.</p>
        ) : (
          <div className="grid gap-2">
            {txs.slice(0, 8).map((t, i) => (
              <Link
                key={t.id}
                to={`/app/transacoes/${t.id}`}
                className="dashboard-row-enter anim-sm flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:border-primary/30 hover:bg-accent"
                style={{ ['--dashboard-row-delay' as string]: `${40 + i * 45}ms` }}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.description ?? '—'} • {formatDateTime(t.createdAt)}
                  </div>
                </div>
                <AmountPill value={t.amount} />
              </Link>
            ))}
          </div>
        )}

        <Button
          asChild
          className="anim-sm absolute bottom-4 right-4 z-10 gap-2 rounded-full shadow-4"
          size="lg"
        >
          <Link to="/app/transferir">
            <Send className="size-4" />
            <span>Transferir</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const greeting = useMemo(() => firstName(user?.name), [user?.name])

  const accountsQ = useAccounts()
  const accounts = accountsQ.data?.accounts ?? []
  const [accountId, setAccountId] = useState<string | undefined>(undefined)

  const selectedId = useMemo(() => accountId ?? accounts[0]?.id, [accountId, accounts])

  const selectedAccount = accounts.find((a) => a.id === selectedId)

  return (
    <div className="grid gap-6">
      <div
        className="dashboard-enter flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ ['--dashboard-delay' as string]: '0ms' }}
      >
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            Olá, <span className="text-primary">{greeting}</span>
          </h2>
          <p className="text-sm text-muted-foreground">Visão rápida das suas contas e transações.</p>
        </div>

        {selectedAccount && (
          <BalanceDisplay currency={selectedAccount.currency} balance={selectedAccount.balance} />
        )}
      </div>

      <Tabs
        value={selectedId ?? ''}
        onValueChange={(v) => setAccountId(v)}
        className="dashboard-enter"
        style={{ ['--dashboard-delay' as string]: '80ms' }}
      >
        <TabsList className="w-full justify-start">
          {accounts.map((a) => (
            <TabsTrigger key={a.id} value={a.id}>
              {a.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((a) => (
          <TabsContent key={a.id} value={a.id}>
            <AccountTransactionsPanel accountId={a.id} accountName={a.name} />
          </TabsContent>
        ))}
      </Tabs>

      {accountsQ.isError && (
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
            <CardDescription>Não foi possível carregar suas contas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              {accountsQ.error instanceof Error ? accountsQ.error.message : 'Erro desconhecido.'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Dica: faça login novamente se necessário.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedAccount == null && accountsQ.isSuccess && (
        <p className="text-sm text-muted-foreground">Nenhuma conta disponível.</p>
      )}
    </div>
  )
}

