-- ============================================
-- INITIAL SCHEMA: Día de Muertos Altares E-Commerce
-- ============================================
-- Created: 2025-01-21
-- Description: Complete database schema for altar e-commerce PWA

-- ============================================
-- EXTENSIONS
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

-- Model types for altars
CREATE TYPE model_type AS ENUM (
  'seres_queridos',      -- For loved ones
  'bebes_no_nacidos',    -- For unborn/premature babies
  'mascotas'             -- For pets
);

-- Configuration types
CREATE TYPE config_type AS ENUM (
  'grosor',              -- Material thickness
  'altura',              -- Height
  'anchura'              -- Width
);

-- Order status
CREATE TYPE order_status AS ENUM (
  'pendiente',           -- Pending
  'confirmado',          -- Confirmed
  'completado',          -- Completed
  'cancelado'            -- Cancelled
);

-- ============================================
-- MAIN TABLES
-- ============================================

-- Configuration options (thickness, height, width)
CREATE TABLE configuraciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tipo config_type NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,          -- e.g., 3mm, 50cm, 30cm
  unidad VARCHAR(10) NOT NULL,            -- 'mm', 'cm'
  disponible BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,                 -- Display order
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_config_value UNIQUE (tipo, valor, unidad)
);

-- Pricing rules based on configurations
CREATE TABLE reglas_precio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grosor_id UUID REFERENCES configuraciones(id) ON DELETE CASCADE,
  altura_min DECIMAL(10, 2),
  altura_max DECIMAL(10, 2),
  anchura_min DECIMAL(10, 2),
  anchura_max DECIMAL(10, 2),
  precio_base DECIMAL(10, 2) NOT NULL,    -- Base price for unpainted
  precio_pintado DECIMAL(10, 2) NOT NULL, -- Price for painted version
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_altura_range CHECK (altura_max >= altura_min),
  CONSTRAINT check_anchura_range CHECK (anchura_max >= anchura_min),
  CONSTRAINT check_positive_prices CHECK (precio_base > 0 AND precio_pintado > 0)
);

-- Main altars/products table
CREATE TABLE altares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  modelo_tipo model_type NOT NULL,

  -- Default included objects (can be overridden per altar if needed)
  panes_incluidos INTEGER DEFAULT 2,
  vasos_incluidos INTEGER DEFAULT 1,
  calaveras_incluidas INTEGER DEFAULT 1,
  portaretratos_incluidos INTEGER DEFAULT 1,

  -- Images
  imagen_principal TEXT,                   -- Main product image URL
  imagenes_galeria TEXT[],                 -- Array of gallery image URLs

  -- Availability
  activo BOOLEAN DEFAULT true,
  destacado BOOLEAN DEFAULT false,         -- Featured product

  -- SEO
  slug VARCHAR(255) UNIQUE NOT NULL,
  meta_titulo VARCHAR(255),
  meta_descripcion TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_included_items CHECK (
    panes_incluidos >= 0 AND
    vasos_incluidos >= 0 AND
    calaveras_incluidas >= 0 AND
    portaretratos_incluidos >= 0
  )
);

-- Extra items (additional objects, photo frames)
CREATE TABLE items_extra (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,            -- e.g., "Portaretrato adicional", "Calavera extra"
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen TEXT,
  tipo VARCHAR(50) NOT NULL,               -- 'portaretrato', 'calavera', 'vaso', 'pan', 'other'
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_positive_price CHECK (precio > 0)
);

-- Discount rules
CREATE TABLE reglas_descuento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cantidad_minima INTEGER NOT NULL,        -- e.g., 5 for "5+ altars"
  porcentaje_descuento DECIMAL(5, 2) NOT NULL, -- e.g., 10.00 for 10%
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_min_quantity CHECK (cantidad_minima > 0),
  CONSTRAINT check_discount_percentage CHECK (porcentaje_descuento >= 0 AND porcentaje_descuento <= 100)
);

-- Order tracking (optional, for admin history)
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_pedido VARCHAR(50) UNIQUE NOT NULL,

  -- Customer info
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(20) NOT NULL,
  cliente_email VARCHAR(255),

  -- Order details (stored as JSONB for flexibility)
  items JSONB NOT NULL,                    -- Array of configured altars

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  -- Status
  estado order_status DEFAULT 'pendiente',

  -- WhatsApp
  whatsapp_enviado BOOLEAN DEFAULT false,
  whatsapp_enviado_at TIMESTAMPTZ,

  -- Notes
  notas TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Constraints
  CONSTRAINT check_positive_amounts CHECK (subtotal >= 0 AND total >= 0 AND descuento >= 0),
  CONSTRAINT check_total_calculation CHECK (total = subtotal - descuento)
);

-- Admin users (using Supabase Auth, this is supplementary data)
CREATE TABLE admin_usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(255),
  rol VARCHAR(50) DEFAULT 'admin',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Altares indexes
CREATE INDEX idx_altares_modelo_tipo ON altares(modelo_tipo);
CREATE INDEX idx_altares_activo ON altares(activo);
CREATE INDEX idx_altares_slug ON altares(slug);
CREATE INDEX idx_altares_destacado ON altares(destacado) WHERE destacado = true;

-- Configuraciones indexes
CREATE INDEX idx_configuraciones_tipo ON configuraciones(tipo);
CREATE INDEX idx_configuraciones_disponible ON configuraciones(disponible) WHERE disponible = true;

-- Reglas precio indexes
CREATE INDEX idx_reglas_precio_grosor ON reglas_precio(grosor_id);
CREATE INDEX idx_reglas_precio_activo ON reglas_precio(activo) WHERE activo = true;

-- Items extra indexes
CREATE INDEX idx_items_extra_tipo ON items_extra(tipo);
CREATE INDEX idx_items_extra_disponible ON items_extra(disponible) WHERE disponible = true;

-- Pedidos indexes
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX idx_pedidos_cliente_telefono ON pedidos(cliente_telefono);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate order number
CREATE SEQUENCE pedidos_seq START 1;

CREATE OR REPLACE FUNCTION generate_numero_pedido()
RETURNS TEXT AS $$
DECLARE
  nuevo_numero TEXT;
BEGIN
  nuevo_numero := 'ALT-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('pedidos_seq')::TEXT, 4, '0');
  RETURN nuevo_numero;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_altares_updated_at
  BEFORE UPDATE ON altares
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuraciones_updated_at
  BEFORE UPDATE ON configuraciones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reglas_precio_updated_at
  BEFORE UPDATE ON reglas_precio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_extra_updated_at
  BEFORE UPDATE ON items_extra
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reglas_descuento_updated_at
  BEFORE UPDATE ON reglas_descuento
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_usuarios_updated_at
  BEFORE UPDATE ON admin_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number on insert
CREATE OR REPLACE FUNCTION set_numero_pedido()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_pedido IS NULL OR NEW.numero_pedido = '' THEN
    NEW.numero_pedido := generate_numero_pedido();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pedido_numero
  BEFORE INSERT ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION set_numero_pedido();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE altares IS 'Main products table - Día de Muertos altars';
COMMENT ON TABLE configuraciones IS 'Configuration options for dimensions and thickness';
COMMENT ON TABLE reglas_precio IS 'Pricing rules based on altar configurations';
COMMENT ON TABLE items_extra IS 'Additional items that can be added to orders';
COMMENT ON TABLE reglas_descuento IS 'Discount rules based on quantity';
COMMENT ON TABLE pedidos IS 'Order history and tracking';
COMMENT ON TABLE admin_usuarios IS 'Admin user profiles';

COMMENT ON COLUMN altares.slug IS 'URL-friendly identifier for SEO';
COMMENT ON COLUMN altares.imagenes_galeria IS 'Array of image URLs for product gallery';
COMMENT ON COLUMN pedidos.items IS 'JSONB array of configured altar items in the order';
COMMENT ON COLUMN pedidos.numero_pedido IS 'Auto-generated order number (ALT-YYYYMMDD-0001)';
