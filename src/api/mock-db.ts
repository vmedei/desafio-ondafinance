import { type Account, type Transaction, type User } from '@/types/banking'

type Session = {
  token: string
  userId: string
}

const nowIso = () => new Date().toISOString()

const daysAgoIso = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

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
      createdAt: daysAgoIso(2),
    },
    {
      id: 'tx_2',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Supermercado',
      description: 'Cartão',
      amount: -326.4,
      createdAt: daysAgoIso(3),
    },
    {
      id: 'tx_3',
      accountId: 'acc_2',
      type: 'transfer',
      title: 'Transferência recebida',
      description: 'De Conta Corrente',
      amount: 500,
      createdAt: daysAgoIso(5),
    },
    {
      id: 'tx_4',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Netflix',
      description: 'Assinatura',
      amount: -55.9,
      createdAt: daysAgoIso(5),
    },
    {
      id: 'tx_5',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Uber',
      description: 'Mobilidade',
      amount: -42.3,
      createdAt: daysAgoIso(6),
    },
    {
      id: 'tx_6',
      accountId: 'acc_1',
      type: 'credit',
      title: 'PIX recebido',
      description: 'Maria S.',
      amount: 180,
      createdAt: daysAgoIso(7),
    },
    {
      id: 'tx_7',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Farmácia',
      description: 'Cartão',
      amount: -89.5,
      createdAt: daysAgoIso(8),
    },
    {
      id: 'tx_8',
      accountId: 'acc_1',
      type: 'transfer',
      title: 'Transferência enviada',
      description: 'João P. • Onda Bank',
      amount: -200,
      createdAt: daysAgoIso(9),
    },
    {
      id: 'tx_9',
      accountId: 'acc_1',
      type: 'debit',
      title: 'Energia elétrica',
      description: 'Débito automático',
      amount: -142.8,
      createdAt: daysAgoIso(12),
    },
    {
      id: 'tx_10',
      accountId: 'acc_2',
      type: 'credit',
      title: 'Rendimento',
      description: 'Resgate CDI',
      amount: 12.44,
      createdAt: daysAgoIso(1),
    },
    {
      id: 'tx_11',
      accountId: 'acc_2',
      type: 'debit',
      title: 'Academia',
      description: 'Mensalidade',
      amount: -99.9,
      createdAt: daysAgoIso(4),
    },
    {
      id: 'tx_12',
      accountId: 'acc_2',
      type: 'transfer',
      title: 'PIX enviado',
      description: 'Presente',
      amount: -150,
      createdAt: daysAgoIso(10),
    },
  ]

  let session: Session | null = null

  function login(email: string, password: string) {
    void password
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

  function startOfLocalDay(ymd: string) {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(y, m - 1, d, 0, 0, 0, 0).getTime()
  }

  function endOfLocalDay(ymd: string) {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(y, m - 1, d, 23, 59, 59, 999).getTime()
  }

  function listTransactions(
    accountId?: string,
    filters?: { fromDate?: string; toDate?: string },
  ) {
    let list = accountId ? transactions.filter((t) => t.accountId === accountId) : transactions.slice()
    if (filters?.fromDate) {
      const start = startOfLocalDay(filters.fromDate)
      list = list.filter((t) => new Date(t.createdAt).getTime() >= start)
    }
    if (filters?.toDate) {
      const end = endOfLocalDay(filters.toDate)
      list = list.filter((t) => new Date(t.createdAt).getTime() <= end)
    }
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

  const initialAccountsSnapshot = structuredClone(accounts)
  const initialTransactionsSnapshot = structuredClone(transactions)

  /** Restaura contas, transações e sessão do mock (uso em testes de integração / isolamento). */
  function resetMockDatabase() {
    session = null
    accounts.length = 0
    accounts.push(...structuredClone(initialAccountsSnapshot))
    transactions.length = 0
    transactions.push(...structuredClone(initialTransactionsSnapshot))
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
    resetMockDatabase,
  }
})()

