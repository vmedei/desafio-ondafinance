import { useEffect } from 'react'
import { LogOut, Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { useLogout } from '@/features/banking/queries'
import { applyTheme, useUiStore } from '@/stores/ui-store'

type Theme = 'light' | 'dark' | 'system'

function themeLabel(t: Theme) {
  switch (t) {
    case 'light':
      return 'Claro'
    case 'dark':
      return 'Escuro'
    case 'system':
      return 'Sistema'
    default:
      return t
  }
}

function ThemeIcon({ theme }: { theme: Theme }) {
  switch (theme) {
    case 'light':
      return <Sun className="size-4 shrink-0 text-muted-foreground" />
    case 'dark':
      return <Moon className="size-4 shrink-0 text-muted-foreground" />
    case 'system':
      return <Monitor className="size-4 shrink-0 text-muted-foreground" />
    default:
      return null
  }
}

export function SettingsPage() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const logout = useLogout()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function chooseTheme(next: Theme) {
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="grid gap-6">
      <div
        className="dashboard-enter"
        style={{ ['--dashboard-delay' as string]: '0ms' }}
      >
        <h2 className="text-2xl font-semibold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Aparência e sessão da sua conta.</p>
      </div>

      <Card
        className="dashboard-enter shadow-4"
        style={{ ['--dashboard-delay' as string]: '80ms' }}
      >
        <CardHeader className="pb-2">
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Defina como o app deve ser exibido neste dispositivo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="theme-appearance" className="text-xs text-muted-foreground">
              Tema
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  id="theme-appearance"
                  type="button"
                  variant="outline"
                  className="anim-sm h-11 w-full max-w-md justify-between border-border/50 bg-secondary/50 px-3 font-normal hover:bg-secondary/60 sm:max-w-sm"
                  aria-label="Escolher tema"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ThemeIcon theme={theme} />
                    <span className="truncate text-left text-sm">{themeLabel(theme)}</span>
                  </span>
                  <span className="ml-3 text-xs text-muted-foreground">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] max-w-md">
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(v) => chooseTheme(v as Theme)}
                >
                  <DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Sistema</span> segue o tema do seu
            dispositivo (claro ou escuro).
          </p>
        </CardContent>
      </Card>

      <Card
        className="dashboard-enter shadow-4"
        style={{ ['--dashboard-delay' as string]: '140ms' }}
      >
        <CardHeader className="pb-2">
          <CardTitle>Sessão</CardTitle>
          <CardDescription>Encerrar acesso à conta neste navegador.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Ao sair, será necessário entrar novamente com seu e-mail e senha.
            </p>
            <Button
              variant="destructive"
              className="anim-sm shrink-0"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="mr-2 size-4" />
              {logout.isPending ? 'Saindo…' : 'Sair'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
