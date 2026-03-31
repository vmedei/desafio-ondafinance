import { describe, expect, it } from 'vitest'

import {
  amountReaisToDigits,
  digitsToAmountReais,
  formatCpfCnpj,
  formatReaisDisplayFromDigits,
  onlyDigits,
} from '@/lib/input-masks'

describe('formatCpfCnpj', () => {
  it('formata CPF', () => {
    expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01')
  })

  it('formata CNPJ', () => {
    expect(formatCpfCnpj('12345678000195')).toBe('12.345.678/0001-95')
  })
})

describe('money centavos', () => {
  it('converte dígitos para reais', () => {
    expect(digitsToAmountReais('12345')).toBe(123.45)
    expect(digitsToAmountReais('')).toBe(0)
  })

  it('formata exibição', () => {
    expect(formatReaisDisplayFromDigits('100')).toBe('1,00')
  })

  it('reais para dígitos', () => {
    expect(amountReaisToDigits(12.34)).toBe('1234')
  })
})

describe('onlyDigits', () => {
  it('remove não-dígitos', () => {
    expect(onlyDigits('12.a3')).toBe('123')
  })
})
