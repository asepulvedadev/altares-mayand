import type { Metadata } from 'next'
import { getAltares } from '@/features/altar-catalog'
import { CatalogClient } from '@/features/altar-catalog/components/catalog-client'
import { BUSINESS_CONFIG } from '@/lib/constants/business-config'

export const metadata: Metadata = {
  title: `${BUSINESS_CONFIG.name} - Altares de Día de Muertos en MDF`,
  description: BUSINESS_CONFIG.description,
}

export default async function Home() {
  // Fetch altares from database (with Redis cache)
  let altares
  let error = null

  try {
    altares = await getAltares()
  } catch (e) {
    console.error('Failed to load altares:', e)
    error = e instanceof Error ? e.message : 'Error desconocido'
    altares = []
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
          {BUSINESS_CONFIG.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
          {BUSINESS_CONFIG.tagline}
        </p>
        <p className="mx-auto mt-2 max-w-3xl text-neutral-600">
          {BUSINESS_CONFIG.description}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">
            Base de datos no configurada
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Las tablas de la base de datos aún no han sido creadas. Por favor, aplica las migraciones en Supabase:
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-amber-800">
            <li>supabase/migrations/20250121000000_initial_schema.sql</li>
            <li>supabase/migrations/20250121000001_rls_policies.sql</li>
            <li>supabase/migrations/20250121000002_seed_data.sql</li>
          </ul>
        </div>
      )}

      {/* Catalog */}
      <CatalogClient altares={altares} />
    </div>
  )
}
