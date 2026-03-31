import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { useTransaction } from '@/features/banking/queries'
import { formatBRL, formatDateTime } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function TransactionDetailsPage() {
  const { id } = useParams()
  const txQ = useTransaction(id ?? '')
  const tx = txQ.data?.transaction

  const positive = (tx?.amount ?? 0) >= 0

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Detalhe</h2>
          <p className="text-sm text-muted-foreground">Informações da transação.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/app/transacoes">
            <ArrowLeft className="mr-2 size-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tx ? tx.title : 'Carregando...'}</CardTitle>
          <CardDescription>{tx ? formatDateTime(tx.createdAt) : '—'}</CardDescription>
        </CardHeader>
        <CardContent>
          {txQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : txQ.isError ? (
            <p className="text-sm text-destructive">
              {txQ.error instanceof Error ? txQ.error.message : 'Erro ao carregar.'}
            </p>
          ) : !tx ? (
            <p className="text-sm text-muted-foreground">Transação não encontrada.</p>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Valor</div>
                <div
                  className={[
                    'flex items-center gap-1 text-lg font-semibold',
                    positive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400',
                  ].join(' ')}
                >
                  {positive ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />}
                  {formatBRL(tx.amount)}
                </div>
              </div>

              <div className="grid gap-1">
                <div className="text-sm font-medium">Descrição</div>
                <div className="text-sm text-muted-foreground">{tx.description ?? '—'}</div>
              </div>

              <div className="grid gap-1">
                <div className="text-sm font-medium">Tipo</div>
                <div className="text-sm text-muted-foreground">{tx.type}</div>
              </div>

              <div className="grid gap-1">
                <div className="text-sm font-medium">ID</div>
                <div className="font-mono text-xs text-muted-foreground">{tx.id}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

