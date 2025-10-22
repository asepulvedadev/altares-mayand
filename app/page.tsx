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
  const altares = await getAltares()

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

      {/* Catalog */}
      <CatalogClient altares={altares} />
    </div>
  )
}
