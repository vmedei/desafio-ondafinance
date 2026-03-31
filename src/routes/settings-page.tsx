import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useLogout } from '@/features/banking/queries'
import { applyTheme, useUiStore } from '@/stores/ui-store'

export function SettingsPage() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const logout = useLogout()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">Preferências e sessão.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>Escolha como o app deve aparecer.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Label htmlFor="theme">Aparência</Label>
          <select
            id="theme"
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          >
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessão</CardTitle>
          <CardDescription>Encerrar sessão do mock.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending ? 'Saindo...' : 'Sair'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

