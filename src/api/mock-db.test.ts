import { mockDb } from '@/api/mock-db'

describe('mockDb.transfer', () => {
  it('deve lançar erro se saldo insuficiente', () => {
    const acc = mockDb.listAccounts()[0]
    expect(() =>
      mockDb.transfer({
        fromAccountId: acc.id,
        amount: acc.balance + 1000,
        toName: 'Fulano',
        toDocument: '12345678901',
        toBank: 'Onda Bank',
      }),
    ).toThrow('Saldo insuficiente.')
  })

  it('deve debitar e criar transação', () => {
    const acc = mockDb.listAccounts()[0]
    const before = acc.balance

    const res = mockDb.transfer({
      fromAccountId: acc.id,
      amount: 10,
      toName: 'Fulano',
      toDocument: '123.456.789-01',
      toBank: 'Onda Bank',
      description: 'Teste',
    })

    expect(res.account.balance).toBeCloseTo(before - 10, 2)
    expect(res.transaction.amount).toBe(-10)
    expect(res.transaction.type).toBe('transfer')
  })
})

