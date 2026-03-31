import { useMemo, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowDownRight, ArrowLeft, ArrowUpRight } from 'lucide-react'

import { useAccounts, useTransaction } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { TransactionType } from '@/types/banking'

function transactionTypeLabel(type: TransactionType) {
  switch (type) {
    case 'credit':
      return 'Crédito'
    case 'debit':
      return 'Débito'
    case 'transfer':
      return 'Transferência'
    default:
      return type
  }
}

function TransactionAmount({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <div
      className={
        positive ? 'text-primary' : 'text-destructive'
      }
    >
      <div className="flex items-center gap-2">
        {positive ? <ArrowUpRight className="size-8 shrink-0 sm:size-9" /> : <ArrowDownRight className="size-8 shrink-0 sm:size-9" />}
        <span className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
          {formatBRL(value)}
        </span>
      </div>
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

export function TransactionDetailsPage() {
  const { id } = useParams()
  const txId = id ?? ''
  const txQ = useTransaction(txId)
  const tx = txQ.data?.transaction

  const accountsQ = useAccounts()
  const accounts = accountsQ.data?.accounts ?? []

  const accountName = useMemo(() => {
    if (!tx) return undefined
    return accounts.find((a) => a.id === tx.accountId)?.name
  }, [tx, accounts])

  if (!txId) {
    return (
      <div className="grid gap-6">
        <p className="text-sm text-muted-foreground">Transação inválida.</p>
        <Button variant="outline" className="anim-sm w-fit rounded-full" asChild>
          <Link to="/app/transacoes">
            <ArrowLeft className="mr-2 size-4" />
            Voltar às transações
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div
        className="dashboard-enter flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ ['--dashboard-delay' as string]: '0ms' }}
      >
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">Detalhe da transação</h2>
          <p className="text-sm text-muted-foreground">Valores, tipo e conta vinculada.</p>
        </div>
        <Button variant="outline" className="anim-sm h-11 shrink-0 rounded-full border-border/50" asChild>
          <Link to="/app/transacoes">
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card
        className="dashboard-enter overflow-hidden shadow-4"
        style={{ ['--dashboard-delay' as string]: '80ms' }}
      >
        {(txQ.isLoading || tx) && (
          <CardHeader className="pb-0">
            {txQ.isLoading ? (
              <>
                <div className="h-8 w-48 max-w-full animate-pulse rounded-md bg-muted" />
                <div className="mt-2 h-4 w-36 animate-pulse rounded-md bg-muted/80" />
              </>
            ) : (
              tx && (
                <>
                  <TransactionAmount value={tx.amount} />
                  <div className="mt-4 space-y-1">
                    <p className="text-base font-medium leading-snug text-foreground">{tx.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(tx.createdAt)}</p>
                  </div>
                </>
              )
            )}
          </CardHeader>
        )}

        <CardContent className="pt-6">
          {txQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando detalhes…</p>
          ) : txQ.isError ? (
            <p className="text-sm text-destructive">
              {txQ.error instanceof Error ? txQ.error.message : 'Erro ao carregar.'}
            </p>
          ) : !tx ? (
            <p className="text-sm text-muted-foreground">Transação não encontrada.</p>
          ) : (
            <div className="space-y-6">
              <Separator />
              <div className="grid gap-6 sm:grid-cols-2">
                <DetailRow label="Descrição">{tx.description ?? '—'}</DetailRow>
                <DetailRow label="Tipo">{transactionTypeLabel(tx.type)}</DetailRow>
                <DetailRow label="Conta">
                  {accountName ? (
                    <>
                      <span>{accountName}</span>
                      <span className="mt-1 block font-mono text-xs text-muted-foreground">
                        {tx.accountId}
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-xs">{tx.accountId}</span>
                  )}
                </DetailRow>
                <DetailRow label="Identificador">
                  <span className="font-mono text-xs text-muted-foreground">{tx.id}</span>
                </DetailRow>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
