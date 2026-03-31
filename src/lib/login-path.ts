/** Caminho absoluto da rota de login (alinhado ao `base` do Vite, ex. GitHub Pages). */
export function getLoginPath(): string {
  const base = import.meta.env.BASE_URL
  if (base === '/') return '/login'
  return `${base.replace(/\/+$/, '')}/login`
}
