import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

import { login } from '@/api/banking'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { AnimatedBackground } from '@/features/auth/components/animated-background'
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
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="relative min-h-dvh">
      <AnimatedBackground />

      <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <main className="relative z-10 grid min-h-dvh place-items-center px-4 py-10">
        <div className="w-full max-w-md anim-lg">
          <div
            className="auth-glass rounded-2xl border p-8 shadow-4 md:p-10"
          >
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex items-center justify-center">
                <img src="/odafinance.svg" alt="Onda Finance" className="h-10 w-auto" />
              </div>


              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Bem-vindo de volta
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Entre com suas credenciais para continuar
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  {...form.register('email')}
                  className="h-11 border-border/50 bg-secondary/50 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">
                    Senha
                  </Label>
                  <button
                    type="button"
                    className="anim-sm text-xs text-primary hover:text-primary/80"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...form.register('password')}
                    className="h-11 border-border/50 bg-secondary/50 pr-10 placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="anim-sm absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              {mutation.isError && (
                <p className="text-sm text-destructive">
                  {mutation.error instanceof Error ? mutation.error.message : 'Falha ao entrar.'}
                </p>
              )}

              <Button
                type="submit"
                className="group h-11 w-full font-medium"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Entrando...' : 'Entrar'}
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-border/50 bg-secondary/30 text-foreground hover:bg-secondary/60"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

