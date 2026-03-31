import { isAxiosError } from 'axios'

/** Extrai mensagem legível do corpo `{ message }` do mock/API ou cai no `Error.message`. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
    ) {
      return (data as { message: string }).message
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
