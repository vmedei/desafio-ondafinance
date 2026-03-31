import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { applyTheme, useUiStore } from '@/stores/ui-store'

type ThemeChoice = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const setTheme = useUiStore((s) => s.setTheme)

  function choose(t: ThemeChoice) {
    setTheme(t)
    applyTheme(t)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Trocar tema">
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => choose('light')}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => choose('dark')}>Escuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => choose('system')}>Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

