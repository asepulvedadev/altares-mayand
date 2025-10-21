# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15 PWA (Progressive Web App)** using:
- **React 19** - Latest React with improved performance
- **TypeScript (strict mode)** - Full type safety
- **Tailwind CSS 4.0** - CSS-based configuration (NO config file)
- **Biome** - Modern linting and formatting (replaces ESLint/Prettier)
- **Turbopack** - Fast development and build times
- **shadcn/ui** - Copy-paste component library
- **Supabase** - Database and authentication
- **Redis** - Caching layer
- **Zod** - Runtime validation
- **Zustand** - Lightweight state management

**Architecture:** Screaming Architecture (feature-based organization without complex domain layers)

**Design Focus:** Mobile-first, responsive design with SEO and analytics as fundamental requirements.

## CRITICAL: Read the Rules First

**Before making ANY changes, read the comprehensive rules:**

```bash
.claude/rules.md         # Comprehensive rules and best practices (PRIMARY REFERENCE)
.claude/quick-reference.md   # Quick reference and templates
```

These files contain critical information about:
- Tailwind 4.0 CSS-based configuration (LLMs often make mistakes here)
- Next.js 15 App Router patterns
- Server vs Client Components
- Supabase integration
- Redis caching strategies
- Zod validation patterns
- And much more...

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack (localhost:3000)
npm run build            # Production build with Turbopack
npm run start            # Run production server

# Code Quality
npm run lint             # Check for linting/formatting issues (Biome)
npm run format           # Auto-format code (Biome)
```

## Quick Start Checklist

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Install shadcn/ui (when needed):**
   ```bash
   npx shadcn@latest init
   # Add components as needed:
   npx shadcn@latest add button card dialog form input
   ```

4. **Set up Supabase (when needed):**
   - Create project at https://supabase.com
   - Copy URL and keys to `.env.local`
   - Create `lib/supabase/server.ts` and `lib/supabase/client.ts` (see rules.md)

5. **Set up Redis (when needed):**
   - Local: Install Redis and run `redis-server`
   - Cloud: Use Upstash (https://upstash.com)
   - Create `lib/redis.ts` (see rules.md)

### Before Starting Development

- [ ] Read `.claude/rules.md` sections relevant to your task
- [ ] Verify TypeScript strict mode is enabled
- [ ] Confirm Tailwind 4.0 is using CSS-based config (no .js/.ts config file)
- [ ] Run `npm run lint` to check current code quality

## Project Structure

```
app/
├── (auth)/              # Route group for auth pages
├── (dashboard)/         # Route group for dashboard
├── api/                 # API routes
├── features/            # Feature modules (MAIN LOCATION)
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── schemas.ts
│   ├── users/
│   └── ...
├── components/
│   ├── ui/              # shadcn/ui components
│   └── shared/          # Shared components
├── lib/
│   ├── supabase/
│   ├── redis/
│   ├── analytics/
│   └── utils.ts
├── hooks/               # Shared hooks
├── types/               # Shared types
├── globals.css
├── layout.tsx
└── page.tsx

public/
├── icons/               # PWA icons
├── screenshots/         # PWA screenshots
└── manifest.json        # PWA manifest
```

## Key Conventions

### TypeScript
- **Strict mode enabled** - Never use `any`, always define explicit types
- **Path alias** - Use `@/*` for imports (e.g., `@/features/users/api`)
- **Explicit return types** - Always define function return types

### Components
- **Server Components by default** - Only use `"use client"` when needed
- **Mobile-first** - Start with mobile styles, add breakpoints for larger screens
- **TypeScript props** - Always define interface for component props

### File Naming
- **Components** - PascalCase (`UserCard.tsx`)
- **Files** - kebab-case (`user-card.tsx`)
- **Features** - kebab-case (`user-profile/`)

### Code Organization
- **Features are self-contained** - Each feature has components, hooks, types, schemas, api
- **Screaming Architecture** - Folder structure reveals purpose
- **No deep nesting** - Keep folder depth reasonable

## Critical Rules Summary

### Tailwind CSS 4.0
- **NEVER create `tailwind.config.js` or `tailwind.config.ts`**
- Use CSS-based configuration in `app/globals.css` with `@theme inline`
- PostCSS config should only have `@tailwindcss/postcss` plugin

### Next.js 15 App Router
- **Await params in dynamic routes**: `const { id } = await params;`
- **Use Server Components for data fetching** - Better performance, smaller bundle
- **Define metadata** - Add `export const metadata` to all pages for SEO

### Supabase
- **Server Components/API routes**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **Always check auth** - Verify user before sensitive operations

### Validation
- **Always validate user input** with Zod schemas
- **Define schemas in `schemas.ts`** for each feature
- **Infer TypeScript types** from Zod schemas

### Caching
- **Use Redis for expensive operations** - Database queries, API calls
- **Set appropriate TTL** - Short (5min), Medium (30min), Long (1hr), Day (24hr)
- **Invalidate on updates** - Delete cache when data changes

### State Management
- **Prefer Server Components** - Avoid client-side state when possible
- **Use Zustand for client state** - When you need global client state
- **Don't store server data in Zustand** - Fetch in Server Components instead

## Common Tasks

### Create a New Feature

```bash
# 1. Create feature structure
mkdir -p features/my-feature/{components,hooks,stores}
touch features/my-feature/{types.ts,schemas.ts,api.ts}

# 2. Define types (types.ts)
# 3. Define Zod schemas (schemas.ts)
# 4. Create API functions (api.ts)
# 5. Build components (components/)
# 6. Add page route (app/features/my-feature/page.tsx)
```

### Add a New API Route

```bash
# 1. Create route file
mkdir -p app/api/my-endpoint
touch app/api/my-endpoint/route.ts

# 2. Implement GET/POST/PATCH/DELETE handlers
# 3. Add auth check
# 4. Validate input with Zod
# 5. Add Redis caching if needed
```

### Add shadcn/ui Component

```bash
npx shadcn@latest add [component-name]
# Example: npx shadcn@latest add button

# Components are added to components/ui/
# Customize as needed
```

## Code Quality Standards

Before committing:

```bash
# 1. Lint and format
npm run lint
npm run format

# 2. Check TypeScript
npm run build

# 3. Test locally
npm run dev
```

## Troubleshooting

### Common Issues

1. **Tailwind classes not working**
   - Verify `globals.css` is imported in root layout
   - Check `postcss.config.mjs` exists with correct plugin
   - NO `tailwind.config.js` file should exist

2. **"params is not awaitable" error**
   - Next.js 15 requires: `const { id } = await params;`
   - Old syntax: `const { id } = params;` (won't work)

3. **Supabase auth issues**
   - Check middleware is refreshing sessions
   - Use correct client (server vs client)
   - Verify environment variables are set

4. **Module not found errors**
   - Check path alias: `@/*` should work
   - Verify import paths are correct
   - Restart dev server after adding new files

## Resources

- **Rules** - `.claude/rules.md` (comprehensive guide)
- **Quick Reference** - `.claude/quick-reference.md` (templates and examples)
- **Environment** - `.env.example` (environment variable template)
- **Next.js 15** - https://nextjs.org/docs
- **Tailwind CSS 4** - https://tailwindcss.com/docs
- **shadcn/ui** - https://ui.shadcn.com
- **Supabase** - https://supabase.com/docs
- **Zod** - https://zod.dev

## Package Manager

This project uses **Bun** (evidenced by `bun.lock`), but npm scripts are configured for compatibility.

You can use either:
```bash
bun install    # or npm install
bun run dev    # or npm run dev
bun run build  # or npm run build
```

## Important Notes

- **Read the rules** - `.claude/rules.md` contains critical patterns and anti-patterns
- **Mobile-first** - Always start with mobile design
- **SEO matters** - Add proper metadata to all pages
- **Type everything** - No `any` types, strict mode is enabled
- **Server Components** - Default to Server Components, only use Client when needed
- **Validate input** - Always use Zod for user input validation
- **Cache strategically** - Use Redis for expensive operations
- **Test on mobile** - PWA is mobile-focused, test on real devices

---

For detailed rules and best practices, see: **`.claude/rules.md`**
