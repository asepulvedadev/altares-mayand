import { createClient } from '@/lib/supabase/server'
import { altarSchema, type Altar, type ModelType } from './schemas/altar.schema'
import type { Altar as AltarDB } from '@/lib/types/database.types'

/**
 * Fetch all active altars from database
 * @returns Array of active altars
 */
export async function getAltares(): Promise<Altar[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('altares')
    .select('*')
    .eq('activo', true)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching altares:', error)
    console.error('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.error('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    throw new Error('Failed to fetch altares')
  }

  // Validate and transform data
  return data.map((altar) => altarSchema.parse(altar))
}

/**
 * Fetch altars filtered by model type
 * @param tipo - Model type to filter by
 * @returns Array of filtered altars
 */
export async function getAltaresByType(tipo: ModelType): Promise<Altar[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('altares')
    .select('*')
    .eq('activo', true)
    .eq('modelo_tipo', tipo)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching altares by type ${tipo}:`, error)
    throw new Error(`Failed to fetch altares for type: ${tipo}`)
  }

  return data.map((altar) => altarSchema.parse(altar))
}

/**
 * Fetch a single altar by ID
 * @param id - Altar UUID
 * @returns Single altar or null
 */
export async function getAltarById(id: string): Promise<Altar | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('altares')
    .select('*')
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error(`Error fetching altar ${id}:`, error)
    throw new Error('Failed to fetch altar')
  }

  return data ? altarSchema.parse(data) : null
}

/**
 * Fetch a single altar by slug
 * @param slug - Altar slug
 * @returns Single altar or null
 */
export async function getAltarBySlug(slug: string): Promise<Altar | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('altares')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error(`Error fetching altar by slug ${slug}:`, error)
    throw new Error('Failed to fetch altar')
  }

  return data ? altarSchema.parse(data) : null
}
