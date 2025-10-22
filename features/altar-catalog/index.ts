// Components
export { AltarCard } from './components/altar-card'
export { AltarGrid } from './components/altar-grid'
export { AltarFilters } from './components/altar-filters'
export { CatalogClient } from './components/catalog-client'

// API
export {
  getAltares,
  getAltaresByType,
  getAltarById,
  getAltarBySlug,
} from './api'

// Schemas
export {
  altarSchema,
  altarCreateSchema,
  altarUpdateSchema,
  altarCatalogSchema,
  ModelTypeEnum,
  type Altar,
  type AltarCreate,
  type AltarUpdate,
  type AltarCatalog,
  type ModelType,
} from './schemas/altar.schema'
