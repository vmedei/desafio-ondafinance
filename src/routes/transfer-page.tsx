import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import { BalanceDisplay } from '@/components/balance-display'
import { useAccounts, useTransfer } from '@/features/banking/queries'
import { CpfCnpjInput, MoneyInput } from '@/components/form/masked-inputs'
import { formatBRL } from '@/lib/format'
import { onlyDigits } from '@/lib/input-masks'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  fromAccountId: z.string().min(1, 'Selecione a conta de origem.'),
  toName: z.string().min(3, 'Nome do favorecido é obrigatório.'),
  toDocument: z
    .string()
    .min(1, 'Informe CPF ou CNPJ.')
    .transform((v) => onlyDigits(v))
    .refine((d) => d.length === 11 || d.length === 14, 'CPF ou CNPJ inválido.'),
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
      <div
        className="dashboard-enter flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ ['--dashboard-delay' as string]: '0ms' }}
      >
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            Transferir
          </h2>
          <p className="text-sm text-muted-foreground">
            Preencha os dados do favorecido e confirme o valor.
          </p>
        </div>

        {selected && (
          <BalanceDisplay currency={selected.currency} balance={selected.balance} />
        )}
      </div>

      <Card
        className="dashboard-enter relative overflow-hidden shadow-4"
        style={{ ['--dashboard-delay' as string]: '80ms' }}
      >
        <CardHeader>
          <CardTitle>Nova transferência</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit((values: FormValues) => {
              transfer.mutate(values, {
                onSuccess: () => {
                  toast({
                    variant: 'success',
                    title: 'Transferência concluída',
                    description: `${formatBRL(values.amount)} enviado para ${values.toName}. O extrato foi atualizado.`,
                    duration: 7000,
                  })
                  navigate('/app/transacoes', { replace: true })
                },
                onError: (error) => {
                  toast({
                    variant: 'destructive',
                    title: 'Transferência não realizada',
                    description:
                      error instanceof Error
                        ? error.message
                        : 'Não foi possível concluir a operação. Tente novamente.',
                    duration: 9000,
                  })
                },
              })
            })}
          >
            <div
              className="dashboard-row-enter grid gap-2 md:col-span-2"
              style={{ ['--dashboard-row-delay' as string]: '0ms' }}
            >
              <Label htmlFor="fromAccountId">Conta de origem</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="anim-sm h-11 w-full justify-between border-border/50 bg-secondary/50 px-3 font-normal hover:bg-secondary/60"
                    aria-label="Selecionar conta de origem"
                  >
                    <span className="min-w-0 truncate text-left text-sm">
                      {selected
                        ? `${selected.name} (${formatBRL(selected.balance)})`
                        : 'Selecione...'}
                    </span>
                    <span className="ml-3 text-xs text-muted-foreground">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                  <DropdownMenuRadioGroup
                    value={form.watch('fromAccountId')}
                    onValueChange={(v) => form.setValue('fromAccountId', v, { shouldValidate: true })}
                  >
                    {accounts.map((a) => (
                      <DropdownMenuRadioItem key={a.id} value={a.id}>
                        <div className="flex w-full items-center justify-between gap-3">
                          <span className="truncate">{a.name}</span>
                          <span className="tabular-nums text-xs text-muted-foreground">
                            {formatBRL(a.balance)}
                          </span>
                        </div>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {form.formState.errors.fromAccountId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.fromAccountId.message}
                </p>
              )}
            </div>

            <div
              className="dashboard-row-enter grid gap-2"
              style={{ ['--dashboard-row-delay' as string]: '45ms' }}
            >
              <Label htmlFor="toName" className="text-sm text-muted-foreground">
                Favorecido
              </Label>
              <Input
                id="toName"
                placeholder="Nome completo"
                className="h-11 border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                {...form.register('toName')}
              />
              {form.formState.errors.toName && (
                <p className="text-sm text-destructive">{form.formState.errors.toName.message}</p>
              )}
            </div>

            <div
              className="dashboard-row-enter grid gap-2"
              style={{ ['--dashboard-row-delay' as string]: '90ms' }}
            >
              <Label htmlFor="toDocument" className="text-sm text-muted-foreground">
                CPF/CNPJ
              </Label>
              <Controller
                name="toDocument"
                control={form.control}
                render={({ field }) => (
                  <CpfCnpjInput
                    id="toDocument"
                    placeholder="000.000.000-00"
                    className="h-11 border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                    {...field}
                  />
                )}
              />
              {form.formState.errors.toDocument && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.toDocument.message}
                </p>
              )}
            </div>

            <div
              className="dashboard-row-enter grid gap-2"
              style={{ ['--dashboard-row-delay' as string]: '135ms' }}
            >
              <Label htmlFor="toBank" className="text-sm text-muted-foreground">
                Banco
              </Label>
              <Input
                id="toBank"
                placeholder="Ex: Onda Bank"
                className="h-11 border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                {...form.register('toBank')}
              />
              {form.formState.errors.toBank && (
                <p className="text-sm text-destructive">{form.formState.errors.toBank.message}</p>
              )}
            </div>

            <div
              className="dashboard-row-enter grid gap-2"
              style={{ ['--dashboard-row-delay' as string]: '180ms' }}
            >
              <Label htmlFor="amount" className="text-sm text-muted-foreground">
                Valor
              </Label>
              <Controller
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <MoneyInput
                    id="amount"
                    placeholder="0,00"
                    className="border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                    value={field.value ?? 0}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
              )}
            </div>

            <div
              className="dashboard-row-enter grid gap-2 md:col-span-2"
              style={{ ['--dashboard-row-delay' as string]: '225ms' }}
            >
              <Label htmlFor="description" className="text-sm text-muted-foreground">
                Descrição (opcional)
              </Label>
              <Input
                id="description"
                placeholder="Ex: Aluguel, ajuda, etc."
                className="h-11 border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div
              className="dashboard-row-enter md:col-span-2 flex flex-col-reverse items-stretch justify-end gap-2 pt-2 sm:flex-row sm:items-center"
              style={{ ['--dashboard-row-delay' as string]: '270ms' }}
            >
              <Button
                type="button"
                variant="outline"
                className="anim-sm"
                onClick={() => navigate('/app')}
              >
                Cancelar
              </Button>
              <Button type="submit" className="group anim-sm gap-2" disabled={transfer.isPending}>
                {transfer.isPending ? 'Enviando...' : 'Confirmar transferência'}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
