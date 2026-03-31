import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { isAxiosError } from 'axios'

import { createTransfer, login } from '@/api/banking'
import { initMockApi } from '@/api/mock-adapter'
import { mockDb } from '@/api/mock-db'
import { useAuthStore } from '@/stores/auth-store'

beforeAll(() => {
  initMockApi()
})

describe('mock adapter /transfer', () => {
  beforeEach(async () => {
    mockDb.resetMockDatabase()
    useAuthStore.getState().clearSession()
    const session = await login({ email: 'vinicius@onda.finance', password: '1234' })
    useAuthStore.getState().setSession({ token: session.token, user: session.user })
  })

  it('rejeita transferência acima do saldo com mensagem de saldo insuficiente', async () => {
    const acc = mockDb.listAccounts()[0]
    const over = acc.balance + 1

    try {
      await createTransfer({
        fromAccountId: acc.id,
        amount: over,
        toName: 'Fulano Teste',
        toDocument: '12345678901',
        toBank: 'Onda Bank',
      })
      expect.fail('deveria rejeitar')
    } catch (error) {
      expect(isAxiosError(error)).toBe(true)
      expect((error as { response?: { data?: { message?: string } } }).response?.data?.message).toBe(
        'Saldo insuficiente.',
      )
    }
  })
})
