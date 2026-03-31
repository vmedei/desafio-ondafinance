import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl font-semibold tracking-tight">404</div>
        <p className="mt-2 text-sm text-muted-foreground">Página não encontrada.</p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/app">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

