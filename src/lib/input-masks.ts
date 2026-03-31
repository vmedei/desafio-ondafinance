/** Apenas dígitos (0–9). */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Formata CPF (11) ou CNPJ (14) com pontuação, conforme o usuário digita.
 * Máximo 14 dígitos.
 */
export function formatCpfCnpj(digits: string): string {
  const d = onlyDigits(digits).slice(0, 14)
  if (d.length === 0) return ''

  if (d.length <= 11) {
    const a = d.slice(0, 3)
    const b = d.slice(3, 6)
    const c = d.slice(6, 9)
    const e = d.slice(9, 11)
    if (d.length <= 3) return a
    if (d.length <= 6) return `${a}.${b}`
    if (d.length <= 9) return `${a}.${b}.${c}`
    return `${a}.${b}.${c}-${e}`
  }

  const a = d.slice(0, 2)
  const b = d.slice(2, 5)
  const c = d.slice(5, 8)
  const d1 = d.slice(8, 12)
  const e = d.slice(12, 14)
  if (d.length <= 2) return a
  if (d.length <= 5) return `${a}.${b}`
  if (d.length <= 8) return `${a}.${b}.${c}`
  if (d.length <= 12) return `${a}.${b}.${c}/${d1}`
  return `${a}.${b}.${c}/${d1}-${e}`
}

/**
 * Valor monetário a partir da sequência de dígitos (centavos).
 * Ex.: "12345" → 123,45 em reais.
 */
export function digitsToAmountReais(digits: string): number {
  const d = onlyDigits(digits)
  if (!d) return 0
  const n = Number.parseInt(d, 10)
  if (!Number.isFinite(n) || n < 0) return 0
  return n / 100
}

/**
 * Parte numérica formatada em pt-BR (sem símbolo), para exibir ao lado de "R$".
 */
export function formatReaisDisplayFromDigits(digits: string): string {
  const amount = digitsToAmountReais(digits)
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Converte valor em reais para string de dígitos (centavos), para o estado do input.
 */
export function amountReaisToDigits(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return ''
  const cents = Math.round(amount * 100)
  return String(cents)
}
