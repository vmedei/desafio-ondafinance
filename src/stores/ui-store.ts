import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

type UiState = {
  theme: Theme
  setTheme: (t: Theme) => void
  /** Quando `true`, o saldo é exibido como oculto (***). Persistido entre páginas/sessões. */
  balanceHidden: boolean
  setBalanceHidden: (hidden: boolean) => void
  toggleBalanceHidden: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      balanceHidden: false,
      setBalanceHidden: (balanceHidden) => set({ balanceHidden }),
      toggleBalanceHidden: () => set((s) => ({ balanceHidden: !s.balanceHidden })),
    }),
    { name: 'onda-ui' },
  ),
)

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', Boolean(isDark))
}

