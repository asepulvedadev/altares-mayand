# Getting Started Guide

This guide will help you set up the project and start developing with all best practices in place.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Install Dependencies](#install-dependencies)
3. [Configure Environment](#configure-environment)
4. [Set Up Core Services](#set-up-core-services)
5. [Install UI Components](#install-ui-components)
6. [Verify Setup](#verify-setup)
7. [Start Development](#start-development)

---

## Initial Setup

### Prerequisites

Ensure you have the following installed:

- [ ] **Node.js 20+** - [Download](https://nodejs.org/)
- [ ] **Bun** (optional, but recommended) - [Install](https://bun.sh/)
- [ ] **Git** - [Download](https://git-scm.com/)
- [ ] **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```bash
# Biome (linting and formatting)
code --install-extension biomejs.biome

# Tailwind CSS IntelliSense
code --install-extension bradlc.vscode-tailwindcss

# Pretty TypeScript Errors
code --install-extension yoavbls.pretty-ts-errors

# Error Lens
code --install-extension usernamehw.errorlens

# ES7+ React/Redux/React-Native snippets
code --install-extension dsznajder.es7-react-js-snippets

# Auto Rename Tag
code --install-extension formulahendry.auto-rename-tag

# GitLens
code --install-extension eamodio.gitlens
```

---

## Install Dependencies

```bash
# Using npm
npm install

# OR using Bun (faster)
bun install
```

**Verify installation:**

```bash
npm run lint
# Should complete without errors
```

---

## Configure Environment

### Step 1: Create Environment File

```bash
cp .env.example .env.local
```

### Step 2: Fill in Environment Variables

Open `.env.local` and configure the following:

#### Required (for basic functionality):

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Supabase (required for auth and database):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing
3. Go to Project Settings > API
4. Copy the values to `.env.local`

#### Redis (required for caching):

```env
REDIS_URL=redis://localhost:6379
```

**Options:**
- **Local Redis** (development): `redis://localhost:6379`
- **Upstash** (recommended for production): Sign up at [Upstash](https://upstash.com)

#### Analytics (optional):

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# OR Plausible (privacy-friendly)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourapp.com
```

---

## Set Up Core Services

### Supabase Setup

#### 1. Create Database Schema

Create tables in your Supabase project:

```sql
-- Example: Users table (if not using Supabase Auth default)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust based on your needs)
CREATE POLICY "Users can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

#### 2. Create Supabase Client Files

Create server-side client:

```bash
mkdir -p lib/supabase
touch lib/supabase/server.ts
touch lib/supabase/client.ts
```

**See `.claude/rules.md` Section 5 for complete implementation.**

#### 3. Create Middleware

```bash
touch middleware.ts
```

**See `.claude/rules.md` Section 5 for complete implementation.**

### Redis Setup

#### Option A: Local Redis (Development)

```bash
# macOS (with Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows (with WSL)
# Install Redis in WSL and run: redis-server
```

#### Option B: Upstash (Production/Cloud)

1. Sign up at [Upstash](https://console.upstash.com/)
2. Create a Redis database
3. Copy the connection URL to `.env.local`

#### Create Redis Client

```bash
mkdir -p lib/redis
touch lib/redis/index.ts
touch lib/redis/keys.ts
touch lib/redis/utils.ts
```

**See `.claude/rules.md` Section 6 for complete implementation.**

---

## Install UI Components

### Initialize shadcn/ui

```bash
npx shadcn@latest init
```

**Answer the prompts:**
- TypeScript: **Yes**
- Style: **Default**
- Base color: **Slate** (or your preference)
- CSS variables: **Yes**
- React Server Components: **Yes**
- Import alias: **@/**

### Install Common Components

```bash
# Install frequently used components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add toast
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
```

### Update Tailwind CSS with shadcn/ui Theme

Edit `app/globals.css` to include shadcn/ui color variables:

**See `.claude/rules.md` Section 9 for complete implementation.**

---

## Verify Setup

### Run Development Server

```bash
npm run dev
# OR
bun run dev
```

Visit `http://localhost:3000` - you should see the Next.js welcome page.

### Verify Linting

```bash
npm run lint
```

Should complete without errors.

### Verify Formatting

```bash
npm run format
```

Should format all files successfully.

### Test Build

```bash
npm run build
```

Should build without errors.

### Check TypeScript

```bash
npx tsc --noEmit
```

Should complete without type errors.

---

## Start Development

### Create Your First Feature

```bash
# 1. Create feature structure
mkdir -p features/example/{components,hooks,stores}
touch features/example/{types.ts,schemas.ts,api.ts}
```

### Feature Structure

```
features/example/
├── components/
│   └── example-component.tsx
├── hooks/
│   └── use-example.ts
├── stores/
│   └── use-example-store.ts
├── api.ts       # Server-side data fetching
├── types.ts     # TypeScript interfaces
└── schemas.ts   # Zod validation schemas
```

### Create Example Types

```typescript
// features/example/types.ts
export interface ExampleItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
}
```

### Create Example Schemas

```typescript
// features/example/schemas.ts
import { z } from 'zod';

export const exampleItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string(),
  created_at: z.string().datetime(),
});

export const createExampleItemSchema = exampleItemSchema.omit({
  id: true,
  created_at: true
});

export type ExampleItem = z.infer<typeof exampleItemSchema>;
export type CreateExampleItemInput = z.infer<typeof createExampleItemSchema>;
```

### Create Example API Functions

```typescript
// features/example/api.ts
import { createClient } from '@/lib/supabase/server';
import type { ExampleItem } from './types';

export async function getExampleItems(): Promise<ExampleItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('example_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
```

### Create Example Component

```typescript
// features/example/components/example-list.tsx
import type { ExampleItem } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExampleListProps {
  items: ExampleItem[];
}

export function ExampleList({ items }: ExampleListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Create Example Page

```typescript
// app/example/page.tsx
import type { Metadata } from 'next';
import { getExampleItems } from '@/features/example/api';
import { ExampleList } from '@/features/example/components/example-list';

export const metadata: Metadata = {
  title: 'Example',
  description: 'Example page demonstrating best practices',
};

export default async function ExamplePage() {
  const items = await getExampleItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Example Feature</h1>
      <ExampleList items={items} />
    </div>
  );
}
```

---

## Development Workflow

### Daily Development

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Make changes** following the patterns in `.claude/rules.md`

3. **Before committing:**
   ```bash
   npm run lint    # Check for issues
   npm run format  # Auto-format code
   ```

4. **Commit with conventional commits:**
   ```bash
   git add .
   git commit -m "feat: add example feature"
   git push
   ```

### Reference Documents

Keep these documents open while developing:

- **`.claude/rules.md`** - Comprehensive rules (PRIMARY REFERENCE)
- **`.claude/quick-reference.md`** - Quick lookups and templates
- **`.claude/architecture.md`** - Understanding the architecture

### Common Commands Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build

# Code Quality
npm run lint             # Lint and format check
npm run format           # Auto-format code

# shadcn/ui
npx shadcn@latest add [component]   # Add UI component

# Supabase (when installed locally)
npx supabase start       # Start local Supabase
npx supabase db reset    # Reset local database
npx supabase gen types typescript --local > types/database.ts
```

---

## Next Steps

### Phase 1: Core Setup (Required)
- [x] Install dependencies
- [x] Configure environment variables
- [ ] Set up Supabase (database + auth)
- [ ] Set up Redis (caching)
- [ ] Install shadcn/ui components
- [ ] Create base folder structure

### Phase 2: Features (As Needed)
- [ ] Implement authentication feature
- [ ] Create user management feature
- [ ] Add dashboard
- [ ] Implement core business features

### Phase 3: PWA & Production
- [ ] Configure PWA (manifest, service worker)
- [ ] Set up analytics
- [ ] Add SEO metadata
- [ ] Configure deployment (Vercel)
- [ ] Test on mobile devices

---

## Troubleshooting

### Issue: Tailwind classes not working

**Solution:**
1. Verify `app/globals.css` imports Tailwind:
   ```css
   @import "tailwindcss";
   ```
2. Check `postcss.config.mjs` exists:
   ```js
   export default {
     plugins: {
       '@tailwindcss/postcss': {}
     }
   }
   ```
3. Restart dev server: `npm run dev`

### Issue: Module not found errors

**Solution:**
1. Check import paths use `@/` alias
2. Verify `tsconfig.json` has correct paths config
3. Restart dev server

### Issue: TypeScript errors

**Solution:**
1. Check `.claude/rules.md` Section 2 for TypeScript conventions
2. Never use `any` type
3. Define explicit return types
4. Run `npx tsc --noEmit` to see all errors

### Issue: Supabase connection errors

**Solution:**
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is running
3. Verify correct client is used (server vs client)
4. Check middleware is set up correctly

### Issue: Redis connection errors

**Solution:**
1. Verify Redis is running: `redis-cli ping` (should return PONG)
2. Check `.env.local` has correct REDIS_URL
3. For Upstash, verify URL format is correct

---

## Getting Help

### Documentation
- **Rules** - `.claude/rules.md`
- **Quick Reference** - `.claude/quick-reference.md`
- **Architecture** - `.claude/architecture.md`

### External Resources
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Zod Docs](https://zod.dev)
- [Zustand Docs](https://docs.pmnd.rs/zustand)

### Community
- Next.js Discord: https://nextjs.org/discord
- Supabase Discord: https://discord.supabase.com

---

## Success Checklist

You're ready to start developing when:

- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build completes (`npm run build`)
- [ ] Environment variables are configured
- [ ] Supabase connection works
- [ ] Redis connection works (if using)
- [ ] shadcn/ui components installed
- [ ] You've read the relevant sections of `.claude/rules.md`

---

**Happy coding!** Remember to always follow the patterns in `.claude/rules.md` for consistency and best practices.
