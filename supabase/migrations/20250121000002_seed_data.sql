-- ============================================
-- SEED DATA
-- ============================================
-- Created: 2025-01-21
-- Description: Initial test data for development

-- ============================================
-- CONFIGURACIONES (Thickness, Height, Width)
-- ============================================

-- Grosor (Thickness) options in mm
INSERT INTO configuraciones (tipo, valor, unidad, orden) VALUES
  ('grosor', 3, 'mm', 1),
  ('grosor', 5, 'mm', 2),
  ('grosor', 6, 'mm', 3),
  ('grosor', 9, 'mm', 4);

-- Altura (Height) options in cm
INSERT INTO configuraciones (tipo, valor, unidad, orden) VALUES
  ('altura', 30, 'cm', 1),
  ('altura', 40, 'cm', 2),
  ('altura', 50, 'cm', 3),
  ('altura', 60, 'cm', 4),
  ('altura', 70, 'cm', 5),
  ('altura', 80, 'cm', 6);

-- Anchura (Width) options in cm
INSERT INTO configuraciones (tipo, valor, unidad, orden) VALUES
  ('anchura', 20, 'cm', 1),
  ('anchura', 25, 'cm', 2),
  ('anchura', 30, 'cm', 3),
  ('anchura', 35, 'cm', 4),
  ('anchura', 40, 'cm', 5),
  ('anchura', 45, 'cm', 6),
  ('anchura', 50, 'cm', 7);

-- ============================================
-- REGLAS DE PRECIO
-- ============================================
-- Pricing based on dimensions and thickness
-- These are example prices - adjust as needed

-- Get grosor IDs
DO $$
DECLARE
  grosor_3mm UUID;
  grosor_5mm UUID;
  grosor_6mm UUID;
  grosor_9mm UUID;
BEGIN
  SELECT id INTO grosor_3mm FROM configuraciones WHERE tipo = 'grosor' AND valor = 3;
  SELECT id INTO grosor_5mm FROM configuraciones WHERE tipo = 'grosor' AND valor = 5;
  SELECT id INTO grosor_6mm FROM configuraciones WHERE tipo = 'grosor' AND valor = 6;
  SELECT id INTO grosor_9mm FROM configuraciones WHERE tipo = 'grosor' AND valor = 9;

  -- Pricing for 3mm thickness
  -- Small sizes (30-50cm height, 20-35cm width)
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_3mm, 30, 50, 20, 35, 250.00, 350.00);

  -- Medium sizes (30-50cm height, 40-50cm width)
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_3mm, 30, 50, 40, 50, 300.00, 420.00);

  -- Large sizes (60-80cm height, 20-50cm width)
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_3mm, 60, 80, 20, 50, 400.00, 560.00);

  -- Pricing for 5mm thickness (higher prices)
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_5mm, 30, 50, 20, 35, 300.00, 420.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_5mm, 30, 50, 40, 50, 360.00, 504.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_5mm, 60, 80, 20, 50, 480.00, 672.00);

  -- Pricing for 6mm thickness
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_6mm, 30, 50, 20, 35, 350.00, 490.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_6mm, 30, 50, 40, 50, 420.00, 588.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_6mm, 60, 80, 20, 50, 560.00, 784.00);

  -- Pricing for 9mm thickness (premium)
  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_9mm, 30, 50, 20, 35, 450.00, 630.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_9mm, 30, 50, 40, 50, 540.00, 756.00);

  INSERT INTO reglas_precio (grosor_id, altura_min, altura_max, anchura_min, anchura_max, precio_base, precio_pintado)
  VALUES (grosor_9mm, 60, 80, 20, 50, 720.00, 1008.00);
END $$;

-- ============================================
-- REGLAS DE DESCUENTO
-- ============================================

INSERT INTO reglas_descuento (cantidad_minima, porcentaje_descuento, descripcion) VALUES
  (5, 10.00, '10% de descuento en pedidos de 5 o más altares'),
  (10, 15.00, '15% de descuento en pedidos de 10 o más altares');

-- ============================================
-- ITEMS EXTRA
-- ============================================

INSERT INTO items_extra (nombre, descripcion, precio, tipo) VALUES
  ('Portaretrato Adicional', 'Portaretrato extra en MDF', 50.00, 'portaretrato'),
  ('Calavera Decorativa', 'Calavera adicional tallada en MDF', 40.00, 'calavera'),
  ('Vaso Decorativo', 'Vaso en MDF para decoración', 30.00, 'vaso'),
  ('Pan de Muerto MDF', 'Pan de muerto decorativo en MDF', 35.00, 'pan'),
  ('Vela Decorativa', 'Vela tallada en MDF', 45.00, 'other'),
  ('Cruz Decorativa', 'Cruz pequeña en MDF', 40.00, 'other');

-- ============================================
-- ALTARES DE EJEMPLO
-- ============================================

-- Altar para Seres Queridos
INSERT INTO altares (
  nombre,
  descripcion,
  modelo_tipo,
  slug,
  meta_titulo,
  meta_descripcion,
  panes_incluidos,
  vasos_incluidos,
  calaveras_incluidas,
  portaretratos_incluidos,
  activo,
  destacado
) VALUES (
  'Altar Tradicional para Seres Queridos',
  'Altar de Día de Muertos tradicional en MDF cortado con láser CNC. Incluye diseños detallados de flores, calaveras y elementos tradicionales mexicanos. Perfecto para honrar a tus seres queridos.',
  'seres_queridos',
  'altar-tradicional-seres-queridos',
  'Altar Tradicional Día de Muertos - Mayand Altares',
  'Altar de Día de Muertos en MDF con diseños tradicionales mexicanos. Personalizable en dimensiones y pintado. Incluye portaretrato, calaveras y decoraciones.',
  2, 1, 1, 1,
  true,
  true
);

-- Altar para Bebés
INSERT INTO altares (
  nombre,
  descripcion,
  modelo_tipo,
  slug,
  meta_titulo,
  meta_descripcion,
  panes_incluidos,
  vasos_incluidos,
  calaveras_incluidas,
  portaretratos_incluidos,
  activo,
  destacado
) VALUES (
  'Altar Especial para Angelitos',
  'Altar delicado diseñado específicamente para recordar a bebés no nacidos o prematuros. Diseños suaves con ángeles, nubes y elementos celestiales. Hecho en MDF con corte láser de precisión.',
  'bebes_no_nacidos',
  'altar-angelitos-bebes',
  'Altar para Angelitos - Bebés Día de Muertos',
  'Altar especial para bebés con diseños de ángeles y elementos celestiales. MDF cortado con láser CNC. Personalizable y pintable.',
  2, 1, 0, 1,
  true,
  true
);

-- Altar para Mascotas
INSERT INTO altares (
  nombre,
  descripcion,
  modelo_tipo,
  slug,
  meta_titulo,
  meta_descripcion,
  panes_incluidos,
  vasos_incluidos,
  calaveras_incluidas,
  portaretratos_incluidos,
  activo,
  destacado
) VALUES (
  'Altar para Mascotas',
  'Altar dedicado para recordar a tus mascotas queridas. Incluye diseños de huellas, corazones y elementos especiales para conmemorar a tu compañero de vida. MDF cortado con láser.',
  'mascotas',
  'altar-mascotas-dia-muertos',
  'Altar para Mascotas - Día de Muertos',
  'Altar especial para mascotas con diseños de huellas y corazones. MDF de alta calidad cortado con láser CNC. Totalmente personalizable.',
  1, 1, 1, 1,
  true,
  false
);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN configuraciones.orden IS 'Used to control display order in UI dropdowns';
COMMENT ON TABLE reglas_precio IS 'Pricing matrix based on material thickness and dimensions';
COMMENT ON TABLE items_extra IS 'Additional decorative items that can be added to orders for extra cost';
