import { forwardRef, useEffect, useState, type ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  amountReaisToDigits,
  digitsToAmountReais,
  formatCpfCnpj,
  formatReaisDisplayFromDigits,
  onlyDigits,
} from '@/lib/input-masks'

type CpfCnpjInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
}

export const CpfCnpjInput = forwardRef<HTMLInputElement, CpfCnpjInputProps>(function CpfCnpjInput(
  { value, onChange, className, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      {...props}
      className={cn(className)}
      inputMode="numeric"
      autoComplete="off"
      value={formatCpfCnpj(value ?? '')}
      onChange={(e) => onChange(formatCpfCnpj(e.target.value))}
    />
  )
})

type MoneyInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> & {
  value: number
  onChange: (value: number) => void
  maxDigits?: number
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { value, onChange, className, maxDigits = 15, ...props },
  ref,
) {
  const [digits, setDigits] = useState(() => amountReaisToDigits(value))

  useEffect(() => {
    setDigits(amountReaisToDigits(value))
  }, [value])

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
        aria-hidden
      >
        R$
      </span>
      <Input
        ref={ref}
        {...props}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={cn('h-11 pl-10 tabular-nums', className)}
        value={formatReaisDisplayFromDigits(digits)}
        onChange={(e) => {
          const next = onlyDigits(e.target.value).slice(0, maxDigits)
          setDigits(next)
          onChange(digitsToAmountReais(next))
        }}
      />
    </div>
  )
})

CpfCnpjInput.displayName = 'CpfCnpjInput'
MoneyInput.displayName = 'MoneyInput'
