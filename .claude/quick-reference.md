# Quick Reference Guide

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Run production server

# Code Quality
npm run lint             # Check for linting issues
npm run format           # Auto-format code with Biome

# Supabase (when installed)
npx supabase start       # Start local Supabase
npx supabase stop        # Stop local Supabase
npx supabase db reset    # Reset local database
npx supabase gen types typescript --local > types/database.ts

# shadcn/ui
npx shadcn@latest add [component]  # Add UI component
npx shadcn@latest add button card dialog form input
```

## File Creation Templates

### New Feature Module

```bash
# Create feature structure
mkdir -p features/[feature-name]/{components,hooks,stores}
touch features/[feature-name]/{types.ts,schemas.ts,api.ts}
```

### Server Component Page

```typescript
// app/features/[feature]/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default async function FeaturePage() {
  // Server-side data fetching
  const data = await fetchData();

  return (
    <div>
      <h1>Feature Page</h1>
      {/* Content */}
    </div>
  );
}
```

### Client Component

```typescript
// features/[feature]/components/component-name.tsx
'use client';

import { useState } from 'react';

interface ComponentNameProps {
  // Define props
}

export function ComponentName({ }: ComponentNameProps) {
  const [state, setState] = useState();

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

### API Route

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { schema } from '@/features/[feature]/schemas';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Logic here

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Zod Schema

```typescript
// features/[feature]/schemas.ts
import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  created_at: z.string().datetime(),
});

export const createItemSchema = itemSchema.omit({ id: true, created_at: true });
export const updateItemSchema = itemSchema.partial().required({ id: true });

export type Item = z.infer<typeof itemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
```

### Zustand Store

```typescript
// features/[feature]/stores/use-[feature]-store.ts
import { create } from 'zustand';

interface FeatureState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useFeatureStore = create<FeatureState>((set) => ({
  data: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/endpoint');
      const data = await response.json();
      set({ data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },
}));
```

## Tailwind CSS 4.0 Quick Reference

### Adding Custom Colors

```css
/* app/globals.css */
@theme inline {
  --color-brand: #3b82f6;
  --color-brand-light: #60a5fa;
  --color-brand-dark: #2563eb;
}
```

```tsx
/* Usage in components */
<div className="bg-brand text-white">
  Branded content
</div>
```

### Common Responsive Patterns

```tsx
{/* Mobile-first grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

{/* Responsive padding */}
<div className="px-4 sm:px-6 lg:px-8">

{/* Hide/show at breakpoints */}
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>

{/* Responsive text */}
<h1 className="text-2xl md:text-4xl lg:text-6xl">

{/* Responsive flex direction */}
<div className="flex flex-col md:flex-row">
```

## Supabase Quick Reference

### Server-Side Client

```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();

// Query
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value);

// Insert
const { data, error } = await supabase
  .from('table')
  .insert({ column: value })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from('table')
  .update({ column: value })
  .eq('id', id)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id);

// Auth
const { data: { user }, error } = await supabase.auth.getUser();
```

### Client-Side Client

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Sign in
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

## Redis Quick Reference

```typescript
import { redis } from '@/lib/redis';

// Set with expiration (seconds)
await redis.setex('key', 3600, JSON.stringify(data));

// Get
const value = await redis.get('key');
const parsed = value ? JSON.parse(value) : null;

// Delete
await redis.del('key');

// Delete multiple
await redis.del('key1', 'key2', 'key3');

// Check exists
const exists = await redis.exists('key');

// Increment
await redis.incr('counter');

// Set if not exists
await redis.setnx('key', 'value');
```

## Analytics Quick Reference

```typescript
import { analytics } from '@/lib/analytics';

// Initialize
analytics.init(userId);

// Identify user
analytics.identify(userId, { name, email });

// Track event
analytics.track('event_name', {
  property1: 'value1',
  property2: 'value2',
});

// Track page view
analytics.page('/path');
```

## Environment Variables Template

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redis
REDIS_URL=redis://localhost:6379
# or for Redis Cloud/Upstash
REDIS_URL=redis://default:password@region.upstash.io:6379

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourapp.com
```

## Common Error Solutions

### "params is not awaitable" Error
```typescript
// ❌ Old Next.js 14 syntax
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // Error in Next.js 15
}

// ✅ Next.js 15 syntax
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### Tailwind Classes Not Working
```typescript
// ✅ Make sure globals.css is imported in root layout
// app/layout.tsx
import './globals.css';

// ✅ Verify PostCSS config exists
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### "use client" Confusion
```typescript
// ❌ Don't use "use client" for everything
'use client'; // Unnecessary if no interactivity

export function StaticComponent() {
  return <div>Static content</div>;
}

// ✅ Only use "use client" when needed
'use client'; // Necessary for interactivity

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Supabase Auth Not Working
```typescript
// ✅ Make sure middleware is set up
// middleware.ts must refresh session

// ✅ Use correct client
// Server Components/API Routes: createClient from '@/lib/supabase/server'
// Client Components: createClient from '@/lib/supabase/client'
```

## Keyboard Shortcuts (VS Code)

```
Cmd/Ctrl + Shift + P   - Command Palette
Cmd/Ctrl + P           - Quick Open File
Cmd/Ctrl + `           - Toggle Terminal
Cmd/Ctrl + B           - Toggle Sidebar
Cmd/Ctrl + /           - Toggle Comment
Cmd/Ctrl + D           - Select Next Occurrence
Cmd/Ctrl + Shift + F   - Find in Files
F2                     - Rename Symbol
Cmd/Ctrl + .           - Quick Fix
```

## Useful VS Code Extensions

- **Biome** - Linting and formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **ES7+ React/Redux/React-Native snippets** - React snippets
- **Pretty TypeScript Errors** - Better TS error messages
- **Error Lens** - Inline error highlighting
- **Auto Rename Tag** - Rename paired HTML/JSX tags
- **GitLens** - Git supercharged
- **Thunder Client** - API testing (REST client)

## Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat: add feature description"
git push origin feature/feature-name
# Create PR on GitHub

# Commit message prefixes
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation
style:    # Formatting, missing semi-colons, etc.
refactor: # Code change that neither fixes a bug nor adds a feature
test:     # Adding tests
chore:    # Updating build tasks, package manager configs, etc.
```

## Performance Tips

1. **Use Server Components by default** - Smaller bundle, faster initial load
2. **Implement Redis caching** - Reduce database load
3. **Optimize images** - Use Next.js `<Image>` component
4. **Code splitting** - Use dynamic imports for large components
5. **Lazy load below-the-fold content** - Improve initial load time
6. **Use Suspense boundaries** - Better loading states
7. **Minimize client-side JavaScript** - Push "use client" down the tree

## Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Use environment variables for all secrets
- [ ] Validate all user input with Zod
- [ ] Use server-side Supabase for sensitive operations
- [ ] Implement proper authentication checks in API routes
- [ ] Use CSRF tokens for sensitive operations
- [ ] Sanitize user-generated content before rendering
- [ ] Use Content Security Policy headers
- [ ] Keep dependencies updated (npm audit)
- [ ] Use HTTPS in production

## Deployment Checklist (Vercel)

- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Set environment variables in Vercel dashboard
- [ ] Configure build command: `npm run build`
- [ ] Configure output directory: `.next`
- [ ] Set Node.js version: 20.x
- [ ] Enable Edge Runtime for API routes (optional)
- [ ] Configure custom domain
- [ ] Set up Vercel Analytics (optional)
- [ ] Test deployment in preview environment
- [ ] Deploy to production
