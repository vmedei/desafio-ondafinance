import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function formatRangeLabel(range: DateRange | undefined) {
  if (!range?.from) return 'Todo o período'
  if (!range.to) return `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} — …`
  return `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} — ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`
}

export type DateRangePickerProps = {
  id?: string
  value: DateRange | undefined
  onChange: (next: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ id, value, onChange, className }: DateRangePickerProps) {
  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        Período
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="anim-sm h-11 w-full justify-start border-border/50 bg-secondary/50 px-3 font-normal hover:bg-secondary/60"
            aria-label="Filtrar por intervalo de datas"
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 truncate text-left text-sm">{formatRangeLabel(value)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar
            mode="range"
            locale={ptBR}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            defaultMonth={value?.from ?? value?.to ?? new Date()}
          />
          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="anim-sm text-muted-foreground"
              onClick={() => onChange(undefined)}
            >
              Limpar período
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
