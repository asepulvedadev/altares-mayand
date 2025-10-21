# Claude Code Rules & Documentation

This directory contains comprehensive rules, guidelines, and best practices for developing this Next.js 15 PWA.

## Documentation Index

### Core Documentation

| File | Purpose | When to Use |
|------|---------|-------------|
| **[rules.md](./rules.md)** | Comprehensive rules and best practices | **PRIMARY REFERENCE** - Consult before implementing any feature |
| **[quick-reference.md](./quick-reference.md)** | Quick lookups, templates, and code snippets | When you need a quick example or command |
| **[architecture.md](./architecture.md)** | Visual architecture diagrams and data flows | Understanding system design and relationships |
| **[getting-started.md](./getting-started.md)** | Step-by-step setup guide | First-time project setup |

### File Overview

#### rules.md (85KB)
**The most important document** - Contains:
- Tailwind CSS 4.0 rules (CSS-based config, NO JS config)
- TypeScript strict mode conventions
- Next.js 15 App Router patterns (Server vs Client Components)
- API route organization and best practices
- Supabase integration (server/client patterns, auth, realtime)
- Redis caching strategies
- Zod validation patterns
- Zustand state management
- shadcn/ui component integration
- Screaming Architecture (feature-based organization)
- Mobile-first responsive design
- PWA configuration
- SEO optimization
- Analytics implementation
- Code quality standards

#### quick-reference.md (11KB)
Quick access to:
- Common commands (npm scripts, Supabase, Redis)
- File creation templates
- Code snippets for common patterns
- Tailwind CSS 4.0 quick reference
- Environment variable template
- Common error solutions
- Keyboard shortcuts
- Git workflow
- Performance tips
- Security checklist
- Deployment checklist

#### architecture.md (30KB)
Visual diagrams for:
- Technology stack overview
- Application layers
- Feature module structure
- Data flow (Server Component, Client Component)
- Authentication flow
- Caching strategy
- Mobile-first responsive design
- PWA architecture
- SEO implementation
- Analytics pipeline
- Deployment architecture
- Security layers

#### getting-started.md (14KB)
Step-by-step guide for:
- Initial setup and prerequisites
- Installing dependencies
- Configuring environment variables
- Setting up Supabase
- Setting up Redis
- Installing shadcn/ui
- Verifying setup
- Creating your first feature
- Development workflow
- Troubleshooting

## Quick Start

### For Claude Code (AI Assistant)

1. **Before ANY implementation** - Read relevant sections in `rules.md`
2. **For specific patterns** - Check `quick-reference.md`
3. **For system understanding** - Refer to `architecture.md`
4. **Critical rules to remember:**
   - NEVER create `tailwind.config.js` or `tailwind.config.ts` (Tailwind 4.0 uses CSS-based config)
   - ALWAYS await `params` in Next.js 15 dynamic routes
   - PREFER Server Components over Client Components
   - ALWAYS validate user input with Zod
   - ALWAYS check authentication in API routes

### For Developers

1. **First time setup** - Follow `getting-started.md`
2. **Daily development** - Keep `quick-reference.md` open
3. **Before implementing features** - Consult `rules.md`
4. **Understanding the system** - Review `architecture.md`

## Project Technology Stack

```
Frontend:
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4.0 (CSS-based config)
- shadcn/ui

Backend:
- Next.js API Routes
- Supabase (database + auth)
- Redis (caching)
- Zod (validation)

State & UI:
- Zustand (state management)
- Server Components (default)
- Client Components (when needed)

Tooling:
- Biome (linting + formatting)
- Turbopack (dev + build)
```

## Architecture Principles

### Screaming Architecture
- Feature-based organization
- Self-contained modules
- Folders reveal purpose

### Mobile-First
- Start with mobile design
- Progressive enhancement for larger screens
- Touch-friendly interfaces

### Performance
- Server Components by default
- Redis caching for expensive operations
- Code splitting and lazy loading

### Security
- Input validation with Zod
- Authentication checks
- Environment variable protection
- Row Level Security (Supabase)

### SEO & Analytics
- Metadata on all pages
- Sitemap generation
- Structured data
- Analytics tracking

## Common Patterns

### Feature Module Structure
```
features/[feature-name]/
├── components/      # Feature-specific components
├── hooks/           # Feature-specific hooks
├── stores/          # Zustand stores (if needed)
├── api.ts           # Server-side data fetching
├── types.ts         # TypeScript interfaces
└── schemas.ts       # Zod validation schemas
```

### Server Component (Data Fetching)
```typescript
// app/features/users/page.tsx
import { getUsers } from '@/features/users/api';

export default async function UsersPage() {
  const users = await getUsers(); // Server-side fetch
  return <UserList users={users} />;
}
```

### Client Component (Interactivity)
```typescript
// features/users/components/user-form.tsx
'use client';

export function UserForm() {
  const [data, setData] = useState();
  // Interactive logic here
}
```

### API Route
```typescript
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  // 1. Check auth
  // 2. Validate input
  // 3. Check cache (Redis)
  // 4. Query database (Supabase)
  // 5. Cache result
  // 6. Return response
}
```

## Critical Rules Summary

### NEVER Do This

- Create `tailwind.config.js` or `tailwind.config.ts`
- Use `any` type in TypeScript
- Skip input validation
- Forget to check authentication
- Use Client Components unnecessarily
- Commit `.env.local` to git
- Skip cache invalidation on updates

### ALWAYS Do This

- Use CSS-based Tailwind config (`@theme inline` in `globals.css`)
- Define explicit TypeScript types
- Validate with Zod schemas
- Check auth in API routes
- Prefer Server Components
- Use `@/` path alias
- Cache expensive operations
- Define page metadata for SEO
- Start with mobile design

## File Locations

```
Root level:
├── .claude/                     # This directory
│   ├── README.md                # This file
│   ├── rules.md                 # Comprehensive rules (PRIMARY)
│   ├── quick-reference.md       # Quick lookups
│   ├── architecture.md          # Visual diagrams
│   └── getting-started.md       # Setup guide
├── .env.example                 # Environment template
├── CLAUDE.md                    # Project overview
└── [project files...]

Feature structure:
features/
├── auth/
├── users/
└── [feature]/
    ├── components/
    ├── hooks/
    ├── stores/
    ├── api.ts
    ├── types.ts
    └── schemas.ts
```

## Development Workflow

1. **Read rules** - Check `rules.md` for relevant patterns
2. **Create feature** - Use structure in `quick-reference.md`
3. **Implement** - Follow patterns in `rules.md`
4. **Lint/Format** - Run `npm run lint` and `npm run format`
5. **Test** - Verify functionality
6. **Commit** - Use conventional commits

## Support Resources

### Internal Documentation
- [Comprehensive Rules](./rules.md)
- [Quick Reference](./quick-reference.md)
- [Architecture](./architecture.md)
- [Getting Started](./getting-started.md)

### External Documentation
- [Next.js 15](https://nextjs.org/docs)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com/docs)
- [Zod](https://zod.dev)
- [Zustand](https://docs.pmnd.rs/zustand)

## Updates & Maintenance

These rules are living documents. Update them when:
- New patterns emerge
- Technology versions update
- Best practices evolve
- Team conventions change

---

**Remember:** When in doubt, consult `rules.md`. It contains detailed explanations, examples, and anti-patterns for every aspect of this project.

**Priority Order:**
1. `rules.md` - Comprehensive guide (read first)
2. `quick-reference.md` - Quick lookups
3. `architecture.md` - System understanding
4. `getting-started.md` - Initial setup

Happy coding!
