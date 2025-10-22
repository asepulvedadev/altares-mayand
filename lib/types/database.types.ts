/**
 * Database TypeScript types
 * Generated based on Supabase schema
 * @see supabase/migrations/20250121000000_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_usuarios: {
        Row: {
          id: string
          nombre: string | null
          rol: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nombre?: string | null
          rol?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string | null
          rol?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_usuarios_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      altares: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          modelo_tipo: ModelType
          panes_incluidos: number
          vasos_incluidos: number
          calaveras_incluidas: number
          portaretratos_incluidos: number
          imagen_principal: string | null
          imagenes_galeria: string[] | null
          activo: boolean
          destacado: boolean
          slug: string
          meta_titulo: string | null
          meta_descripcion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          modelo_tipo: ModelType
          panes_incluidos?: number
          vasos_incluidos?: number
          calaveras_incluidas?: number
          portaretratos_incluidos?: number
          imagen_principal?: string | null
          imagenes_galeria?: string[] | null
          activo?: boolean
          destacado?: boolean
          slug: string
          meta_titulo?: string | null
          meta_descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          modelo_tipo?: ModelType
          panes_incluidos?: number
          vasos_incluidos?: number
          calaveras_incluidas?: number
          portaretratos_incluidos?: number
          imagen_principal?: string | null
          imagenes_galeria?: string[] | null
          activo?: boolean
          destacado?: boolean
          slug?: string
          meta_titulo?: string | null
          meta_descripcion?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuraciones: {
        Row: {
          id: string
          tipo: ConfigType
          valor: number
          unidad: string
          disponible: boolean
          orden: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: ConfigType
          valor: number
          unidad: string
          disponible?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: ConfigType
          valor?: number
          unidad?: string
          disponible?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      items_extra: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          imagen: string | null
          tipo: string
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio: number
          imagen?: string | null
          tipo: string
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          imagen?: string | null
          tipo?: string
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          cliente_nombre: string
          cliente_telefono: string
          cliente_email: string | null
          items: Json
          subtotal: number
          descuento: number
          total: number
          estado: OrderStatus
          whatsapp_enviado: boolean
          whatsapp_enviado_at: string | null
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_pedido?: string
          cliente_nombre: string
          cliente_telefono: string
          cliente_email?: string | null
          items: Json
          subtotal: number
          descuento?: number
          total: number
          estado?: OrderStatus
          whatsapp_enviado?: boolean
          whatsapp_enviado_at?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_pedido?: string
          cliente_nombre?: string
          cliente_telefono?: string
          cliente_email?: string | null
          items?: Json
          subtotal?: number
          descuento?: number
          total?: number
          estado?: OrderStatus
          whatsapp_enviado?: boolean
          whatsapp_enviado_at?: string | null
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reglas_descuento: {
        Row: {
          id: string
          cantidad_minima: number
          porcentaje_descuento: number
          descripcion: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cantidad_minima: number
          porcentaje_descuento: number
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cantidad_minima?: number
          porcentaje_descuento?: number
          descripcion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      reglas_precio: {
        Row: {
          id: string
          grosor_id: string | null
          altura_min: number | null
          altura_max: number | null
          anchura_min: number | null
          anchura_max: number | null
          precio_base: number
          precio_pintado: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          grosor_id?: string | null
          altura_min?: number | null
          altura_max?: number | null
          anchura_min?: number | null
          anchura_max?: number | null
          precio_base: number
          precio_pintado: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          grosor_id?: string | null
          altura_min?: number | null
          altura_max?: number | null
          anchura_min?: number | null
          anchura_max?: number | null
          precio_base?: number
          precio_pintado?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reglas_precio_grosor_id_fkey"
            columns: ["grosor_id"]
            isOneToOne: false
            referencedRelation: "configuraciones"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_numero_pedido: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      config_type: ConfigType
      model_type: ModelType
      order_status: OrderStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Enums
export type ModelType = 'seres_queridos' | 'bebes_no_nacidos' | 'mascotas'
export type ConfigType = 'grosor' | 'altura' | 'anchura'
export type OrderStatus = 'pendiente' | 'confirmado' | 'completado' | 'cancelado'

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// Specific table types
export type Altar = Tables<'altares'>
export type Configuracion = Tables<'configuraciones'>
export type ReglaPrecio = Tables<'reglas_precio'>
export type ItemExtra = Tables<'items_extra'>
export type ReglaDescuento = Tables<'reglas_descuento'>
export type Pedido = Tables<'pedidos'>
export type AdminUsuario = Tables<'admin_usuarios'>

// Insert types
export type AltarInsert = TablesInsert<'altares'>
export type ConfiguracionInsert = TablesInsert<'configuraciones'>
export type ReglaPrecioInsert = TablesInsert<'reglas_precio'>
export type ItemExtraInsert = TablesInsert<'items_extra'>
export type ReglaDescuentoInsert = TablesInsert<'reglas_descuento'>
export type PedidoInsert = TablesInsert<'pedidos'>

// Update types
export type AltarUpdate = TablesUpdate<'altares'>
export type ConfiguracionUpdate = TablesUpdate<'configuraciones'>
export type ReglaPrecioUpdate = TablesUpdate<'reglas_precio'>
export type ItemExtraUpdate = TablesUpdate<'items_extra'>
export type ReglaDescuentoUpdate = TablesUpdate<'reglas_descuento'>
export type PedidoUpdate = TablesUpdate<'pedidos'>
