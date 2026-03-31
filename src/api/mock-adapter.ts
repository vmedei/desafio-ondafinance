import type { AxiosAdapter, AxiosResponse } from 'axios'

import { api } from '@/api/client'
import { mockDb } from '@/api/mock-db'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// AxiosResponse espera InternalAxiosRequestConfig (interno) em `config`.
// Aqui é mock local; manter tipagem simples evita incompatibilidades entre versões.
function jsonResponse<T>(config: unknown, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: {},
    config: config as never,
  }
}

function errorResponse(config: unknown, message: string, status = 400) {
  return jsonResponse(config, { message }, status)
}

function parseBody(config: unknown) {
  const raw = (config as { data?: unknown } | null)?.data
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as unknown
    } catch {
      return null
    }
  }
  return raw as unknown
}

export function createMockAdapter(): AxiosAdapter {
  return async (config) => {
    await sleep(250)

    const url = config.url ?? ''
    const method = (config.method ?? 'get').toLowerCase()
    const auth = config.headers?.Authorization ?? config.headers?.authorization
    const session = mockDb.getSession()
    const isAuthed = Boolean(session && auth === `Bearer ${session.token}`)

    try {
      if (method === 'post' && url === '/auth/login') {
        const body = (parseBody(config) ?? {}) as { email?: string; password?: string }
        const email = body.email?.trim() ?? ''
        const password = body.password ?? ''
        if (!email) return errorResponse(config, 'E-mail é obrigatório.', 422)
        const { token, user } = mockDb.login(email, password)
        return jsonResponse(config, { token, user })
      }

      if (!isAuthed) {
        return errorResponse(config, 'Não autenticado.', 401)
      }

      if (method === 'post' && url === '/auth/logout') {
        mockDb.logout()
        return jsonResponse(config, { ok: true })
      }

      if (method === 'get' && url === '/me') {
        const user = mockDb.getUser(session!.userId)
        return jsonResponse(config, { user })
      }

      if (method === 'get' && url === '/accounts') {
        return jsonResponse(config, { accounts: mockDb.listAccounts() })
      }

      if (method === 'get' && url.startsWith('/transactions')) {
        const qIndex = url.indexOf('?')
        const qs = qIndex >= 0 ? url.slice(qIndex + 1) : ''
        const params = new URLSearchParams(qs)
        const accountId = params.get('accountId') ?? undefined
        const fromDate = params.get('fromDate') ?? undefined
        const toDate = params.get('toDate') ?? undefined
        const filters =
          fromDate || toDate
            ? { ...(fromDate ? { fromDate } : {}), ...(toDate ? { toDate } : {}) }
            : undefined
        return jsonResponse(config, { transactions: mockDb.listTransactions(accountId, filters) })
      }

      if (method === 'get' && url.startsWith('/transaction/')) {
        const id = url.replace('/transaction/', '')
        const tx = mockDb.getTransaction(id)
        if (!tx) return errorResponse(config, 'Transação não encontrada.', 404)
        return jsonResponse(config, { transaction: tx })
      }

      if (method === 'post' && url === '/transfer') {
        const body = (parseBody(config) ?? {}) as {
          fromAccountId?: string
          amount?: number
          toName?: string
          toDocument?: string
          toBank?: string
          description?: string
        }
        const result = mockDb.transfer({
          fromAccountId: body.fromAccountId ?? '',
          amount: Number(body.amount ?? 0),
          toName: body.toName ?? '',
          toDocument: body.toDocument ?? '',
          toBank: body.toBank ?? '',
          description: body.description,
        })
        return jsonResponse(config, result, 201)
      }

      return errorResponse(config, 'Rota não implementada no mock.', 404)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro inesperado.'
      return errorResponse(config, message, 400)
    }
  }
}

let mockApiInitialized = false

export function initMockApi() {
  if (mockApiInitialized) return
  mockApiInitialized = true
  api.defaults.adapter = createMockAdapter()
}

