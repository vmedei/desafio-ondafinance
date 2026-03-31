import type { DateRange } from 'react-day-picker'

import { DateRangePicker } from '@/components/date-range-picker'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { accountFilterLabel } from '@/lib/account-filter-label'
import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Account } from '@/types/banking'

export type TransactionsFiltersProps = {
  accounts: Account[]
  accountId: string
  onAccountIdChange: (accountId: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function TransactionsFilters({
  accounts,
  accountId,
  onAccountIdChange,
  dateRange,
  onDateRangeChange,
  className,
}: TransactionsFiltersProps) {
  const label = accountFilterLabel(accountId, accounts)

  return (
    <div
      className={cn('grid w-full gap-4 sm:grid-cols-2 sm:gap-3 lg:min-w-[460px]', className)}
    >
      <div className="grid w-full gap-2">
        <Label htmlFor="account-filter" className="text-xs text-muted-foreground">
          Conta
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="account-filter"
              type="button"
              variant="outline"
              className="anim-sm h-11 w-full justify-between border-border/50 bg-secondary/50 px-3 font-normal hover:bg-secondary/60"
              aria-label="Filtrar por conta"
            >
              <span className="min-w-0 truncate text-left text-sm">{label}</span>
              <span className="ml-3 text-xs text-muted-foreground">▼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
            <DropdownMenuRadioGroup value={accountId} onValueChange={onAccountIdChange}>
              <DropdownMenuRadioItem value="all">Todas as contas</DropdownMenuRadioItem>
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
      </div>
      <DateRangePicker id="tx-date-range" value={dateRange} onChange={onDateRangeChange} />
    </div>
  )
}
