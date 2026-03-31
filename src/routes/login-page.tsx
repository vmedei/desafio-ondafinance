import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { login } from '@/api/banking'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(4, 'Mínimo de 4 caracteres.'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null
    return state?.from ?? '/app'
  }, [location.state])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'vinicius@onda.finance',
      password: '1234',
    },
    mode: 'onSubmit',
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => login(values),
    onSuccess: (data) => {
      setSession({ token: data.token, user: data.user })
      navigate(from, { replace: true })
    },
  })

  return (
    <div className="min-h-dvh bg-background">
      <div className="grid min-h-dvh grid-cols-1 md:grid-cols-2">
        <aside className="hidden md:flex flex-col justify-between bg-black p-10 text-white">
          <div className="flex items-center gap-3">
            <img
              src="/odafinance.svg"
              alt="Onda Finance"
              className="h-10 w-auto"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">
              Controle suas finanças com simplicidade.
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Uma experiência rápida, consistente e segura — do acesso ao envio de transferências.
            </p>
          </div>

          <div className="text-xs text-white/50">© {new Date().getFullYear()} Onda Finance</div>
        </aside>

        <main className="grid items-center px-4 py-10 md:px-10">
          <Card className="mx-auto w-full max-w-md shadow-3">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  {mutation.error instanceof Error ? mutation.error.message : 'Falha ao entrar.'}
                </p>
              )}

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  )
}

