import { type Account, type Transaction, type User } from '@/types/banking'

type Session = {
  token: string
  userId: string
}

const nowIso = () => new Date().toISOString()

export const mockDb = (() => {
  const users: User[] = [
    { id: 'u_1', name: 'Vinicius Medeiros', email: 'vinicius@onda.finance' },
  ]

  const accounts: Account[] = [
    { id: 'acc_1', name: 'Conta Corrente', currency: 'BRL', balance: 12500.35 },
    { id: 'acc_2', name: 'Reserva', currency: 'BRL', balance: 3200.0 },
  ]

  const transactions: Transaction[] = [
    {
      id: 'tx_1',
      accountId: 'acc_1',
      type: 'credit',
      title: 'Salário',
      description: 'Crédito em conta',
      amount: 8500,
      createdAt: nowIso(),
    },
    {
      id: 'tx_2',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Supermercado',
      description: 'Cartão',
      amount: -326.4,
      createdAt: nowIso(),
    },
    {
      id: 'tx_3',
      accountId: 'acc_2',
      type: 'transfer',
      title: 'Transferência recebida',
      description: 'De Conta Corrente',
      amount: 500,
      createdAt: nowIso(),
    },
  ]

  let session: Session | null = null

  function login(email: string, _password: string) {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? users[0]
    const token = `mock_${user.id}_${Date.now()}`
    session = { token, userId: user.id }
    return { token, user }
  }

  function logout() {
    session = null
  }

  function getSession() {
    return session
  }

  function getUser(userId: string) {
    return users.find((u) => u.id === userId) ?? null
  }

  function listAccounts() {
    return accounts.slice()
  }

  function listTransactions(accountId?: string) {
    const list = accountId ? transactions.filter((t) => t.accountId === accountId) : transactions
    return list
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  function getTransaction(id: string) {
    return transactions.find((t) => t.id === id) ?? null
  }

  function transfer(params: {
    fromAccountId: string
    amount: number
    toName: string
    toDocument: string
    toBank: string
    description?: string
  }) {
    const from = accounts.find((a) => a.id === params.fromAccountId)
    if (!from) throw new Error('Conta de origem não encontrada.')
    if (params.amount <= 0) throw new Error('Valor inválido.')
    if (from.balance < params.amount) throw new Error('Saldo insuficiente.')

    from.balance = Number((from.balance - params.amount).toFixed(2))

    const tx: Transaction = {
      id: `tx_${Math.random().toString(16).slice(2)}`,
      accountId: from.id,
      type: 'transfer',
      title: 'Transferência enviada',
      description:
        params.description ??
        `${params.toName} • ${params.toBank} • ${params.toDocument.replace(/\D/g, '')}`,
      amount: -params.amount,
      createdAt: nowIso(),
    }
    transactions.push(tx)
    return { transaction: tx, account: from }
  }

  return {
    login,
    logout,
    getSession,
    getUser,
    listAccounts,
    listTransactions,
    getTransaction,
    transfer,
  }
})()

