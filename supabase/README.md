# Supabase Database Migrations

## 📋 Overview

This directory contains the database schema and migrations for the Mayand Altares e-commerce PWA.

## 🗄️ Database Schema

The schema includes the following tables:

1. **altares** - Main products table (altar catalog)
2. **configuraciones** - Configuration options (grosor, altura, anchura)
3. **reglas_precio** - Pricing rules based on dimensions and thickness
4. **items_extra** - Additional items that can be added to orders
5. **reglas_descuento** - Discount rules (e.g., 10% for 5+ altars)
6. **pedidos** - Order history and tracking
7. **admin_usuarios** - Admin user profiles

## 🚀 How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for First Time)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/hgxyoybimaruiyqhnijl

2. Navigate to **SQL Editor** (left sidebar)

3. Execute the migrations in order:

   **Step 1: Create Schema**
   - Copy contents of `migrations/20250121000000_initial_schema.sql`
   - Paste into SQL Editor
   - Click "Run" button

   **Step 2: Add RLS Policies**
   - Copy contents of `migrations/20250121000001_rls_policies.sql`
   - Paste into SQL Editor
   - Click "Run" button

   **Step 3: Seed Data** (Optional - for testing)
   - Copy contents of `migrations/20250121000002_seed_data.sql`
   - Paste into SQL Editor
   - Click "Run" button

4. Verify the tables were created:
   - Navigate to **Table Editor** (left sidebar)
   - You should see all 7 tables listed

### Option 2: Using Supabase CLI (For Advanced Users)

1. Login to Supabase CLI:
   ```bash
   npx supabase login
   ```

2. Link to your remote project:
   ```bash
   npx supabase link --project-ref hgxyoybimaruiyqhnijl
   ```

3. Push migrations to remote:
   ```bash
   npx supabase db push
   ```

### Option 3: Using psql (Direct Database Connection)

1. Get your database connection string from Supabase dashboard:
   - Settings → Database → Connection string

2. Connect using psql:
   ```bash
   psql "YOUR_CONNECTION_STRING"
   ```

3. Execute migrations:
   ```sql
   \i supabase/migrations/20250121000000_initial_schema.sql
   \i supabase/migrations/20250121000001_rls_policies.sql
   \i supabase/migrations/20250121000002_seed_data.sql
   ```

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Public Access:
- **Read** access to active altars, available configurations, pricing rules, extra items, and discount rules
- **Create** access to pedidos (orders) for customer checkout

### Admin Access:
- **Full CRUD** access to all tables (requires `admin_usuarios` entry)
- Checked via `is_admin()` function

## 🧪 Seed Data

The seed data includes:

- **Configuraciones**: 4 grosor options (3mm, 5mm, 6mm, 9mm), 6 altura options (30-80cm), 7 anchura options (20-50cm)
- **Reglas Precio**: 12 pricing rules covering different size/thickness combinations
- **Reglas Descuento**: 2 discount rules (5+ altars: 10%, 10+ altars: 15%)
- **Items Extra**: 6 additional decorative items
- **Altares**: 3 sample products (one for each model type)

## 📝 TypeScript Types

TypeScript types are auto-generated in `lib/types/database.types.ts` based on the schema.

To regenerate types (after schema changes):

```bash
npx supabase gen types typescript --project-id hgxyoybimaruiyqhnijl > lib/types/database.types.ts
```

## 🔄 Making Changes

When you need to make schema changes:

1. Create a new migration file:
   ```bash
   npx supabase migration new your_migration_name
   ```

2. Edit the generated file in `supabase/migrations/`

3. Apply locally (if using local Supabase):
   ```bash
   npx supabase db reset
   ```

4. Push to remote:
   ```bash
   npx supabase db push
   ```

5. Regenerate TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id hgxyoybimaruiyqhnijl > lib/types/database.types.ts
   ```

## ⚠️ Important Notes

- **Always backup** before running migrations on production
- **Test migrations** in a development/staging environment first
- **Version control** all migration files
- **Never edit** applied migration files - create new ones for changes
- **Keep migrations** sequential and atomic

## 🆘 Troubleshooting

### Migrations fail with "permission denied"
- Ensure you're logged into Supabase CLI
- Check your access token: `npx supabase login`

### Tables already exist
- If tables exist, you may need to drop them first (BE CAREFUL - this deletes data):
  ```sql
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
  ```

### RLS policies block operations
- Check if `is_admin()` function is working
- Verify admin user exists in `admin_usuarios` table
- Check RLS policies with: `SELECT * FROM pg_policies;`

## 📚 Resources

- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/managing-environments)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
