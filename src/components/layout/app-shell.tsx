import { Link, NavLink, Outlet } from 'react-router-dom'
import { CreditCard, Home, LogOut, Send, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuthStore } from '@/stores/auth-store'

function NavItem({
  to,
  icon,
  label,
}: {
  to: string
  icon: ReactNode
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent',
        ].join(' ')
      }
      end
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

export function AppShell() {
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r md:block">
          <div className="flex h-full flex-col p-4">
            <Link to="/app" className="flex items-center gap-2 px-2 py-2">
              <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <CreditCard className="size-4" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Onda Finance</div>
                <div className="text-xs text-muted-foreground">Banco digital</div>
              </div>
            </Link>

            <Separator className="my-4" />

            <nav className="grid gap-1">
              <NavItem to="/app" icon={<Home className="size-4" />} label="Início" />
              <NavItem
                to="/app/transferir"
                icon={<Send className="size-4" />}
                label="Transferir"
              />
              <NavItem
                to="/app/transacoes"
                icon={<CreditCard className="size-4" />}
                label="Transações"
              />
              <NavItem
                to="/app/configuracoes"
                icon={<Settings className="size-4" />}
                label="Configurações"
              />
            </nav>

            <div className="mt-auto grid gap-2">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium">{user?.name ?? 'Usuário'}</div>
                <div className="text-xs text-muted-foreground">{user?.email ?? ''}</div>
              </div>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => clearSession()}
              >
                <LogOut className="mr-2 size-4" />
                Sair
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
              <div className="md:hidden">
                <Link to="/app" className="text-sm font-semibold">
                  Onda Finance
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

