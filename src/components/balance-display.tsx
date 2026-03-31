import { Eye, EyeOff } from 'lucide-react'

import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/stores/ui-store'

export type BalanceDisplayProps = {
  currency: string
  balance: number
  className?: string
}

export function BalanceDisplay({ currency, balance, className }: BalanceDisplayProps) {
  const hidden = useUiStore((s) => Boolean(s.balanceHidden))
  const toggleBalanceHidden = useUiStore((s) => s.toggleBalanceHidden)

  return (
    <div
      className={cn('flex shrink-0 flex-col items-stretch gap-1 sm:items-end', className)}
    >
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Saldo · {currency}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="anim-sm size-8 shrink-0"
          onClick={() => toggleBalanceHidden()}
          aria-label={hidden ? 'Mostrar saldo' : 'Ocultar saldo'}
        >
          <span key={hidden ? 'hidden' : 'visible'} className="balance-icon inline-flex">
            {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </span>
        </Button>
      </div>
      <p
        key={hidden ? 'hidden' : 'visible'}
        className="balance-swap text-right text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl"
      >
        {hidden ? 'R$ ***' : formatBRL(balance)}
      </p>
    </div>
  )
}
