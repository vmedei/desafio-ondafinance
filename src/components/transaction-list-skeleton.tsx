import { Skeleton } from '@/components/ui/skeleton'

/** Linha no formato da lista de transações (título + meta + valor). */
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 p-3">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-[min(280px,55%)]" />
        <Skeleton className="h-3 w-[min(360px,85%)]" />
      </div>
      <Skeleton className="h-7 w-[4.5rem] shrink-0 rounded-full" />
    </div>
  )
}

export function TransactionListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Carregando transações">
      {Array.from({ length: count }, (_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  )
}
