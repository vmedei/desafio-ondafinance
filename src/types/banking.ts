export type Currency = 'BRL'

export type User = {
  id: string
  name: string
  email: string
}

export type Account = {
  id: string
  name: string
  currency: Currency
  balance: number
}

export type TransactionType = 'credit' | 'debit' | 'transfer'

export type Transaction = {
  id: string
  accountId: string
  type: TransactionType
  title: string
  description?: string
  amount: number
  createdAt: string
}

export type TransferInput = {
  fromAccountId: string
  toName: string
  toDocument: string
  toBank: string
  amount: number
  description?: string
}

