import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { useAccounts, useTransfer } from '@/features/banking/queries'
import { formatBRL } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  fromAccountId: z.string().min(1, 'Selecione a conta de origem.'),
  toName: z.string().min(3, 'Nome do favorecido é obrigatório.'),
  toDocument: z
    .string()
    .min(11, 'Documento inválido.')
    .transform((v) => v.replace(/\D/g, '')),
  toBank: z.string().min(2, 'Banco é obrigatório.'),
  amount: z.number().positive('Informe um valor maior que zero.'),
  description: z.string().max(140, 'Máximo de 140 caracteres.').optional(),
})

type FormValues = z.infer<typeof schema>

export function TransferPage() {
  const navigate = useNavigate()
  const accountsQ = useAccounts()
  const accounts = accountsQ.data?.accounts ?? []
  const transfer = useTransfer()

  const defaultFrom = useMemo(() => accounts[0]?.id ?? '', [accounts])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromAccountId: '',
      toName: '',
      toDocument: '',
      toBank: '',
      amount: 0,
      description: '',
    },
  })

  useEffect(() => {
    if (!defaultFrom) return
    if (form.getValues('fromAccountId')) return
    form.setValue('fromAccountId', defaultFrom, { shouldValidate: true })
  }, [defaultFrom, form])

  const selected = accounts.find((a) => a.id === form.watch('fromAccountId'))

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Transferir</h2>
        <p className="text-sm text-muted-foreground">Simulação de transferência com validação.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova transferência</CardTitle>
          <CardDescription>
            Conta origem: <span className="font-medium text-foreground">{selected?.name ?? '—'}</span>
            {selected ? ` • Saldo: ${formatBRL(selected.balance)}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((values: FormValues) => {
              transfer.mutate(values, {
                onSuccess: () => navigate('/app/transacoes', { replace: true }),
              })
            })}
          >
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="fromAccountId">Conta de origem</Label>
              <select
                id="fromAccountId"
                className="h-10 rounded-md border bg-background px-3 text-sm"
                {...form.register('fromAccountId')}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatBRL(a.balance)})
                  </option>
                ))}
              </select>
              {form.formState.errors.fromAccountId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.fromAccountId.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="toName">Favorecido</Label>
              <Input id="toName" placeholder="Nome completo" {...form.register('toName')} />
              {form.formState.errors.toName && (
                <p className="text-sm text-destructive">{form.formState.errors.toName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="toDocument">CPF/CNPJ</Label>
              <Input id="toDocument" placeholder="Somente números" {...form.register('toDocument')} />
              {form.formState.errors.toDocument && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.toDocument.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="toBank">Banco</Label>
              <Input id="toBank" placeholder="Ex: Onda Bank" {...form.register('toBank')} />
              {form.formState.errors.toBank && (
                <p className="text-sm text-destructive">{form.formState.errors.toBank.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Ex: Aluguel, ajuda, etc."
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {transfer.isError && (
              <div className="md:col-span-2">
                <p className="text-sm text-destructive">
                  {transfer.error instanceof Error
                    ? transfer.error.message
                    : 'Falha ao transferir.'}
                </p>
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/app')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={transfer.isPending}>
                {transfer.isPending ? 'Enviando...' : 'Confirmar transferência'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

