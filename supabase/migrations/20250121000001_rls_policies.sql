-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Created: 2025-01-21
-- Description: Security policies for all tables

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_precio ENABLE ROW LEVEL SECURITY;
ALTER TABLE altares ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_extra ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_descuento ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_usuarios ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ ACCESS (for catalog data)
-- ============================================

-- Anyone can view active altars
CREATE POLICY "Public can view active altares"
  ON altares FOR SELECT
  USING (activo = true);

-- Anyone can view available configurations
CREATE POLICY "Public can view available configuraciones"
  ON configuraciones FOR SELECT
  USING (disponible = true);

-- Anyone can view active pricing rules
CREATE POLICY "Public can view active pricing rules"
  ON reglas_precio FOR SELECT
  USING (activo = true);

-- Anyone can view available extra items
CREATE POLICY "Public can view available extra items"
  ON items_extra FOR SELECT
  USING (disponible = true);

-- Anyone can view active discount rules
CREATE POLICY "Public can view active discount rules"
  ON reglas_descuento FOR SELECT
  USING (activo = true);

-- ============================================
-- ADMIN FULL ACCESS
-- ============================================
-- Admins have full CRUD access to all tables
-- Check if user exists in admin_usuarios table with activo = true

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_usuarios
    WHERE admin_usuarios.id = auth.uid()
    AND admin_usuarios.activo = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Altares admin policies
CREATE POLICY "Admins have full access to altares"
  ON altares FOR ALL
  USING (is_admin());

-- Configuraciones admin policies
CREATE POLICY "Admins have full access to configuraciones"
  ON configuraciones FOR ALL
  USING (is_admin());

-- Reglas precio admin policies
CREATE POLICY "Admins have full access to reglas_precio"
  ON reglas_precio FOR ALL
  USING (is_admin());

-- Items extra admin policies
CREATE POLICY "Admins have full access to items_extra"
  ON items_extra FOR ALL
  USING (is_admin());

-- Reglas descuento admin policies
CREATE POLICY "Admins have full access to reglas_descuento"
  ON reglas_descuento FOR ALL
  USING (is_admin());

-- Pedidos admin policies
CREATE POLICY "Admins can view all pedidos"
  ON pedidos FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update pedidos"
  ON pedidos FOR UPDATE
  USING (is_admin());

-- Admin usuarios policies
CREATE POLICY "Admins can view admin_usuarios"
  ON admin_usuarios FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update own profile"
  ON admin_usuarios FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- PUBLIC ORDER CREATION
-- ============================================
-- Anyone can create orders (for order tracking)

CREATE POLICY "Anyone can create pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (true);

-- ============================================
-- SECURITY CHECKS
-- ============================================

-- Prevent modification of core enums by non-superusers
-- This is enforced at the database level, not via RLS

COMMENT ON POLICY "Public can view active altares" ON altares
  IS 'Allows public to browse active altar products';

COMMENT ON POLICY "Admins have full access to altares" ON altares
  IS 'Admins can create, read, update, and delete any altar';

COMMENT ON FUNCTION is_admin()
  IS 'Helper function to check if current user is an active admin';
