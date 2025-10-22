import { AltarCard } from './altar-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Altar } from '../schemas/altar.schema'

interface AltarGridProps {
  altares: Altar[]
  isLoading?: boolean
}

export function AltarGrid({ altares, isLoading = false }: AltarGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <AltarCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (altares.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 p-8 text-center">
        <div className="text-6xl">🏛️</div>
        <h3 className="mt-4 text-lg font-semibold text-neutral-900">
          No se encontraron altares
        </h3>
        <p className="mt-2 text-sm text-neutral-600">
          No hay altares disponibles en este momento. Vuelve pronto.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {altares.map((altar) => (
        <AltarCard key={altar.id} altar={altar} />
      ))}
    </div>
  )
}

function AltarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/2" />
        <Skeleton className="mt-3 h-10 w-full" />
      </div>
    </div>
  )
}
