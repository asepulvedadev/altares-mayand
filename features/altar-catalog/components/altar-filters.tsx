'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MODEL_TYPES } from '@/lib/constants/business-config'
import type { ModelType } from '../schemas/altar.schema'

interface AltarFiltersProps {
  selectedType: ModelType | 'all'
  onFilterChange: (type: ModelType | 'all') => void
  counts?: Record<ModelType | 'all', number>
}

export function AltarFilters({ selectedType, onFilterChange, counts }: AltarFiltersProps) {
  const filterOptions: Array<{ value: ModelType | 'all'; label: string; icon?: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'seres_queridos', label: MODEL_TYPES.seres_queridos.label, icon: MODEL_TYPES.seres_queridos.icon },
    { value: 'bebes_no_nacidos', label: MODEL_TYPES.bebes_no_nacidos.label, icon: MODEL_TYPES.bebes_no_nacidos.icon },
    { value: 'mascotas', label: MODEL_TYPES.mascotas.label, icon: MODEL_TYPES.mascotas.icon },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((option) => {
        const isSelected = selectedType === option.value
        const count = counts?.[option.value]

        return (
          <Button
            key={option.value}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className="relative"
          >
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
            {typeof count === 'number' && count > 0 && (
              <Badge
                variant={isSelected ? 'secondary' : 'default'}
                className="ml-2 h-5 min-w-[20px] rounded-full px-1.5 text-xs"
              >
                {count}
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}
