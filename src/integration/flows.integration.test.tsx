import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import {
  ensureMockApi,
  renderIntegrationApp,
  resetClientAndMockState,
  seedAuthenticatedSession,
} from '@/test/integration-utils'

beforeAll(() => {
  ensureMockApi()
})

describe('integração: login', () => {
  beforeEach(() => {
    resetClientAndMockState()
  })

  it('autentica com o mock e exibe o dashboard', async () => {
    const user = userEvent.setup()
    renderIntegrationApp('/login')

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(
      await screen.findByRole('heading', { name: /olá/i }, { timeout: 10_000 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/visão rápida das suas contas/i)).toBeInTheDocument()
  })
})

describe('integração: transferência', () => {
  beforeEach(async () => {
    resetClientAndMockState()
    await seedAuthenticatedSession()
  })

  it('submete transferência válida e navega para o extrato', async () => {
    const user = userEvent.setup()
    renderIntegrationApp('/app/transferir')

    await screen.findByRole('heading', { name: /transferir/i }, { timeout: 10_000 })
    await screen.findByLabelText(/selecionar conta de origem/i)

    await user.type(screen.getByLabelText(/favorecido/i), 'Maria Silva')
    await user.type(screen.getByLabelText(/cpf\/cnpj/i), '52998224725')
    await user.type(screen.getByLabelText(/banco/i), 'Onda Bank')

    const valorInput = screen.getByLabelText(/valor/i)
    await user.clear(valorInput)
    await user.type(valorInput, '1000')

    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    expect(
      await screen.findByRole('heading', { name: /^transações$/i }, { timeout: 10_000 }),
    ).toBeInTheDocument()
  })

  it('valida o formulário e exibe erros ao enviar sem dados obrigatórios', async () => {
    const user = userEvent.setup()
    renderIntegrationApp('/app/transferir')

    await screen.findByRole('heading', { name: /transferir/i }, { timeout: 10_000 })

    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    expect(await screen.findByText(/informe cpf ou cnpj/i)).toBeInTheDocument()
    expect(screen.getByText(/informe um valor maior que zero/i)).toBeInTheDocument()
  })
})

describe('integração: extrato', () => {
  beforeEach(async () => {
    resetClientAndMockState()
    await seedAuthenticatedSession()
  })

  it('carrega movimentações do mock na lista', async () => {
    renderIntegrationApp('/app/transacoes')

    expect(await screen.findByText(/salário/i, {}, { timeout: 10_000 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^transações$/i })).toBeInTheDocument()
  })
})
