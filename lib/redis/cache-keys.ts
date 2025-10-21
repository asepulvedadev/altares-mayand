/**
 * Cache key constants and TTL values for Redis
 * Following naming convention: entity:operation:identifier
 */

// Cache key generators
export const CACHE_KEYS = {
  // Altares (products)
  ALTARES_ALL: 'altares:all',
  ALTARES_BY_TYPE: (tipo: string) => `altares:tipo:${tipo}`,
  ALTAR_DETAIL: (id: string) => `altar:${id}`,
  ALTAR_BY_SLUG: (slug: string) => `altar:slug:${slug}`,

  // Configuraciones (dimensions, thickness)
  CONFIGURACIONES_ALL: 'configuraciones:all',
  CONFIGURACIONES_BY_TYPE: (tipo: string) => `configuraciones:tipo:${tipo}`,
  GROSOR_OPTIONS: 'configuraciones:grosor',
  ALTURA_OPTIONS: 'configuraciones:altura',
  ANCHURA_OPTIONS: 'configuraciones:anchura',

  // Pricing rules
  REGLAS_PRECIO: 'reglas_precio:all',
  PRECIO_CALCULATION: (hash: string) => `precio:calc:${hash}`,

  // Extra items
  ITEMS_EXTRA: 'items_extra:all',
  ITEMS_EXTRA_BY_TYPE: (tipo: string) => `items_extra:tipo:${tipo}`,

  // Discount rules
  REGLAS_DESCUENTO: 'reglas_descuento:all',

  // Patterns for bulk invalidation
  PATTERNS: {
    ALL_ALTARES: 'altares:*',
    ALL_CONFIGURACIONES: 'configuraciones:*',
    ALL_PRICING: 'precio:*',
    ALL_EXTRAS: 'items_extra:*',
  },
} as const

// Time-To-Live values in seconds
export const CACHE_TTL = {
  // Long TTL - Rarely changing data (1 hour)
  LONG: 3600,

  // Medium TTL - Moderately changing data (30 minutes)
  MEDIUM: 1800,

  // Short TTL - Frequently changing data (5 minutes)
  SHORT: 300,

  // Very Short TTL - Near real-time data (1 minute)
  VERY_SHORT: 60,

  // Product catalog (1 hour - products don't change often)
  CATALOG: 3600,

  // Configuration options (1 hour - admin changes infrequently)
  CONFIG: 3600,

  // Pricing calculations (30 minutes)
  PRICING: 1800,

  // Price calculation results (10 minutes - can be invalidated on admin changes)
  CALCULATION: 600,

  // Extra items (1 hour)
  EXTRAS: 3600,

  // Discount rules (1 hour)
  DISCOUNTS: 3600,
} as const

// Helper to generate cache hash for price calculations
export function generatePriceCalcHash(params: {
  grosorId: string
  alturaId: string
  anchuraId: string
  pintado: boolean
  extras?: Array<{ itemId: string; cantidad: number }>
}): string {
  const extrasStr = params.extras
    ? params.extras
        .sort((a, b) => a.itemId.localeCompare(b.itemId))
        .map((e) => `${e.itemId}:${e.cantidad}`)
        .join(',')
    : ''

  return `${params.grosorId}-${params.alturaId}-${params.anchuraId}-${params.pintado ? '1' : '0'}-${extrasStr}`
}
