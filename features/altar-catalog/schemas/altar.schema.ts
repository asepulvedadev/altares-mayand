import { z } from 'zod'

/**
 * Model types for altars
 */
export const ModelTypeEnum = z.enum(['seres_queridos', 'bebes_no_nacidos', 'mascotas'])
export type ModelType = z.infer<typeof ModelTypeEnum>

/**
 * Altar schema for validation
 */
export const altarSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(1, 'Nombre requerido').max(255),
  descripcion: z.string().nullable(),
  modelo_tipo: ModelTypeEnum,
  panes_incluidos: z.number().int().min(0).default(2),
  vasos_incluidos: z.number().int().min(0).default(1),
  calaveras_incluidas: z.number().int().min(0).default(1),
  portaretratos_incluidos: z.number().int().min(0).default(1),
  imagen_principal: z.string().url().nullable(),
  imagenes_galeria: z.array(z.string().url()).nullable(),
  activo: z.boolean().default(true),
  destacado: z.boolean().default(false),
  slug: z.string().min(1).max(255),
  meta_titulo: z.string().max(255).nullable(),
  meta_descripcion: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Altar = z.infer<typeof altarSchema>

/**
 * Schema for creating a new altar (admin)
 */
export const altarCreateSchema = altarSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export type AltarCreate = z.infer<typeof altarCreateSchema>

/**
 * Schema for updating an altar (admin)
 */
export const altarUpdateSchema = altarCreateSchema.partial()

export type AltarUpdate = z.infer<typeof altarUpdateSchema>

/**
 * Schema for catalog display (minimal fields)
 */
export const altarCatalogSchema = altarSchema.pick({
  id: true,
  nombre: true,
  modelo_tipo: true,
  imagen_principal: true,
  slug: true,
  destacado: true,
})

export type AltarCatalog = z.infer<typeof altarCatalogSchema>
