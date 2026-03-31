import { formatBRL } from '@/lib/format'

describe('formatBRL', () => {
  it('formata em pt-BR', () => {
    const out = formatBRL(1234.56)
    expect(out).toContain('R$')
  })
})

