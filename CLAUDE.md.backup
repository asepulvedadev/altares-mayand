# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using React 19, TypeScript, and Tailwind CSS 4. The project uses Biome for linting and formatting instead of ESLint/Prettier. It's configured with Turbopack for faster development and build times.

## Development Commands

**Development server:**
```bash
npm run dev
# Uses Next.js with Turbopack for fast refresh
# Opens at http://localhost:3000
```

**Build:**
```bash
npm run build
# Production build with Turbopack
```

**Production server:**
```bash
npm run start
# Runs the production build locally
```

**Linting:**
```bash
npm run lint
# Runs Biome check (linting and formatting check)
```

**Formatting:**
```bash
npm run format
# Auto-formats code with Biome
```

## Code Quality & Tooling

**Biome Configuration:**
- Uses Biome (not ESLint/Prettier) for linting and formatting
- Configured with Next.js and React domains enabled
- 2-space indentation
- Auto-organizes imports on save
- Run `npm run lint` before commits to catch issues
- Run `npm run format` to auto-fix formatting

**TypeScript:**
- Strict mode enabled
- Path alias: `@/*` maps to project root (e.g., `@/app/page.tsx`)
- Target: ES2017
- Module resolution: bundler

## Project Structure

**App Router (Next.js 15):**
- `app/` directory contains all routes and pages
- `app/layout.tsx` - Root layout with Geist fonts (Sans & Mono)
- `app/page.tsx` - Homepage component
- `app/globals.css` - Global styles with Tailwind directives
- `public/` - Static assets (SVGs, images)

**Fonts:**
- Uses Geist Sans and Geist Mono via `next/font/google`
- Font variables: `--font-geist-sans` and `--font-geist-mono`

## Key Architecture Notes

**Next.js App Router:**
- All components are Server Components by default
- Add `"use client"` directive for client-side interactivity
- File-based routing: files in `app/` create routes automatically
- Special files: `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`

**Tailwind CSS:**
- Tailwind 4 with PostCSS plugin
- Configured in `postcss.config.mjs`
- Custom styles in `app/globals.css`
- Uses CSS variables for theming (background, foreground, etc.)

**Package Manager:**
- Project uses Bun (evidenced by `bun.lock`)
- However, npm scripts are configured for compatibility
