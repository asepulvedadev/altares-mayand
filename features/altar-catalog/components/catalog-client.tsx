'use client'

import { useState, useMemo } from 'react'
import { AltarGrid } from './altar-grid'
import { AltarFilters } from './altar-filters'
import type { Altar, ModelType } from '../schemas/altar.schema'

interface CatalogClientProps {
  altares: Altar[]
}

export function CatalogClient({ altares }: CatalogClientProps) {
  const [selectedType, setSelectedType] = useState<ModelType | 'all'>('all')

  // Filter altares based on selected type
  const filteredAltares = useMemo(() => {
    if (selectedType === 'all') {
      return altares
    }
    return altares.filter((altar) => altar.modelo_tipo === selectedType)
  }, [altares, selectedType])

  // Calculate counts for each type
  const counts = useMemo(() => {
    const result: Record<ModelType | 'all', number> = {
      all: altares.length,
      seres_queridos: 0,
      bebes_no_nacidos: 0,
      mascotas: 0,
    }

    altares.forEach((altar) => {
      result[altar.modelo_tipo]++
    })

    return result
  }, [altares])

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Nuestros Altares
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {filteredAltares.length} {filteredAltares.length === 1 ? 'altar disponible' : 'altares disponibles'}
          </p>
        </div>

        <AltarFilters
          selectedType={selectedType}
          onFilterChange={setSelectedType}
          counts={counts}
        />
      </div>

      {/* Grid */}
      <AltarGrid altares={filteredAltares} />
    </div>
  )
}
