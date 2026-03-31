import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { CreditCard, Home, LogOut, Menu, Send, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { logoUrl } from '@/lib/public-assets'
import { useAuthStore } from '@/stores/auth-store'

function NavItem({
  to,
  icon,
  label,
  onNavigate,
}: {
  to: string
  icon: ReactNode
  label: string
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors anim-sm',
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

function SidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const user = useAuthStore((s) => s.user)
  const clearSession = useAuthStore((s) => s.clearSession)

  return (
    <div className={className}>
      <Link
        to="/app"
        onClick={() => onNavigate?.()}
        className="flex items-center gap-3 px-2 py-2 anim-sm hover:opacity-90"
      >
        <img
          src={logoUrl}
          alt=""
          className="h-10 w-auto max-w-[104px] shrink-0 object-contain object-left"
          width={104}
          height={40}
        />
        <div className="min-w-0 leading-tight">
          <div className="text-sm font-semibold">Onda Finance</div>
          <div className="text-xs text-muted-foreground">Banco digital</div>
        </div>
      </Link>

      <Separator className="my-4" />

      <nav className="grid gap-1">
        <NavItem to="/app" icon={<Home className="size-4" />} label="Início" onNavigate={onNavigate} />
        <NavItem
          to="/app/transferir"
          icon={<Send className="size-4" />}
          label="Transferir"
          onNavigate={onNavigate}
        />
        <NavItem
          to="/app/transacoes"
          icon={<CreditCard className="size-4" />}
          label="Transações"
          onNavigate={onNavigate}
        />
        <NavItem
          to="/app/configuracoes"
          icon={<Settings className="size-4" />}
          label="Configurações"
          onNavigate={onNavigate}
        />
      </nav>

      <div className="mt-auto grid gap-2 pt-6">
        <div className="rounded-lg border border-border p-3">
          <div className="text-sm font-medium">{user?.name ?? 'Usuário'}</div>
          <div className="text-xs text-muted-foreground">{user?.email ?? ''}</div>
        </div>
        <Button
          variant="outline"
          className="justify-start"
          onClick={() => {
            clearSession()
            onNavigate?.()
          }}
        >
          <LogOut className="mr-2 size-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}

export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="h-dvh overflow-hidden bg-background">
      <div className="fixed right-4 top-4 z-50 md:right-6 md:top-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex h-full max-w-6xl">
        <aside className="hidden h-full w-[260px] shrink-0 border-r md:flex md:flex-col">
          <SidebarNav className="scrollbar-onda flex h-full min-h-0 flex-col overflow-y-auto p-4" />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <header className="z-40 shrink-0 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <SheetTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="anim-sm shrink-0 rounded-full border-border/50"
                      aria-label="Abrir menu de navegação"
                    >
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <SidebarNav
                      className="scrollbar-onda flex h-full flex-col overflow-y-auto p-4 pb-8"
                      onNavigate={closeMobileNav}
                    />
                  </SheetContent>
                </Sheet>
                <Link
                  to="/app"
                  className="anim-sm flex min-w-0 items-center hover:opacity-90"
                  onClick={closeMobileNav}
                >
                  <img
                    src={logoUrl}
                    alt="Onda Finance"
                    className="h-9 w-auto max-w-[min(120px,40vw)] object-contain object-left"
                    width={120}
                    height={36}
                  />
                </Link>
              </div>
            </div>
          </header>

          <main className="scrollbar-onda mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
