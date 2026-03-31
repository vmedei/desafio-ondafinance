import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, Send } from 'lucide-react'

import { useAccounts, useTransactions } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function AmountPill({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        positive ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      ].join(' ')}
    >
      {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {formatBRL(value)}
    </span>
  )
}

export function DashboardPage() {
  const accountsQ = useAccounts()
  const accounts = accountsQ.data?.accounts ?? []
  const [accountId, setAccountId] = useState<string | undefined>(undefined)

  const selectedId = useMemo(() => accountId ?? accounts[0]?.id, [accountId, accounts])
  const txQ = useTransactions(selectedId)
  const txs = txQ.data?.transactions ?? []

  const selectedAccount = accounts.find((a) => a.id === selectedId)

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Início</h2>
          <p className="text-sm text-muted-foreground">Visão rápida das suas contas e transações.</p>
        </div>
        <Button asChild>
          <Link to="/app/transferir">
            <Send className="mr-2 size-4" />
            Transferir
          </Link>
        </Button>
      </div>

      <Tabs value={selectedId ?? ''} onValueChange={(v) => setAccountId(v)}>
        <TabsList className="w-full justify-start">
          {accounts.map((a) => (
            <TabsTrigger key={a.id} value={a.id}>
              {a.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((a) => (
          <TabsContent key={a.id} value={a.id}>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Saldo</CardTitle>
                  <CardDescription>{a.currency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{formatBRL(a.balance)}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Conta selecionada: <span className="font-medium text-foreground">{a.name}</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Transações recentes</CardTitle>
                  <CardDescription>Últimas movimentações desta conta.</CardDescription>
                </CardHeader>
                <CardContent>
                  {txQ.isLoading ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : txs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem transações.</p>
                  ) : (
                    <div className="grid gap-2">
                      {txs.slice(0, 6).map((t) => (
                        <Link
                          key={t.id}
                          to={`/app/transacoes/${t.id}`}
                          className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
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
                </CardContent>
              </Card>
            </div>
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

