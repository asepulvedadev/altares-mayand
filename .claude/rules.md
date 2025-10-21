# Next.js PWA Development Rules & Best Practices

## Project Context

This is a small Progressive Web App (PWA) built with:
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4.0 (CSS-based configuration, NO config file)
- shadcn/ui components
- Supabase (database and auth)
- Redis (caching)
- Zod (validation)
- Zustand (state management)
- Biome (linting and formatting)

**Architecture Style:** Screaming Architecture (feature-based organization without complex domain layers)

**Design Focus:** Mobile-first, responsive design with SEO and analytics as fundamental requirements.

---

## 1. CRITICAL: Tailwind CSS 4.0 Rules

### Why These Rules Matter
Tailwind 4.0 introduced a paradigm shift from JavaScript configuration to CSS-based configuration. LLMs trained on earlier versions often generate incorrect config files. This section prevents that common mistake.

### Mandatory Rules

**NEVER create or suggest creating:**
- `tailwind.config.js`
- `tailwind.config.ts`
- `tailwind.config.mjs`

**ALWAYS use CSS-based configuration in `app/globals.css`:**

```css
@import "tailwindcss";

/* Define custom CSS variables */
:root {
  --background: #ffffff;
  --foreground: #171717;
}

/* Use @theme inline for Tailwind theme customization */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* Add custom colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  /* Add custom spacing if needed */
  --spacing-xs: 0.25rem;
}
```

### PostCSS Configuration

**Keep `postcss.config.mjs` minimal:**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### Anti-Patterns to Avoid

- Trying to use `extend` object in CSS (doesn't exist in v4)
- Importing config from a JS file
- Using old plugin syntax
- Attempting to use `darkMode` config option (use CSS `@media` instead)

### Dark Mode Pattern

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

---

## 2. TypeScript Strict Mode Conventions

### Why Strict Mode Matters
Strict TypeScript prevents runtime errors, improves code quality, and ensures better IDE support. It forces explicit typing and catches potential issues early.

### Mandatory Rules

**Never use `any` type:**
```typescript
// BAD
const data: any = fetchData();

// GOOD
const data: UserData | null = await fetchData();

// GOOD - use unknown for truly unknown types
const data: unknown = parseJson(input);
if (isUserData(data)) {
  // Type guard narrows to UserData
}
```

**Always define explicit return types for functions:**
```typescript
// BAD
async function fetchUser(id: string) {
  return await db.from('users').select('*').eq('id', id).single();
}

// GOOD
async function fetchUser(id: string): Promise<User | null> {
  const { data, error } = await db
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}
```

**Use strict null checks:**
```typescript
// BAD
function greet(name: string) {
  return `Hello ${name.toUpperCase()}`; // Could crash if name is undefined
}

// GOOD
function greet(name: string | undefined): string {
  if (!name) return 'Hello Guest';
  return `Hello ${name.toUpperCase()}`;
}
```

**Interface vs Type:**
```typescript
// Use interface for object shapes (can be extended)
interface User {
  id: string;
  email: string;
  name: string;
}

// Use type for unions, intersections, primitives
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };
```

**Path Alias Usage:**
```typescript
// ALWAYS use @/ alias for imports
import { Button } from '@/components/ui/button';
import { fetchUser } from '@/features/users/api';
import type { User } from '@/features/users/types';

// NEVER use relative paths for cross-feature imports
// BAD: import { Button } from '../../../components/ui/button';
```

---

## 3. Next.js 15 App Router Best Practices

### Why These Patterns Matter
Next.js 15 App Router brings server-first architecture, improved performance, and better developer experience. Understanding Server vs Client Components is crucial for optimal performance.

### Server Components (Default)

**Use Server Components for:**
- Data fetching
- Database queries
- Server-side logic
- SEO-critical content
- Static content rendering

```typescript
// app/features/users/page.tsx
// This is a Server Component by default (no "use client")

import { createClient } from '@/lib/supabase/server';
import { UserList } from './components/user-list';

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1>Users</h1>
      <UserList users={users ?? []} />
    </div>
  );
}
```

### Client Components

**Use Client Components for:**
- Interactive UI (onClick, onChange, etc.)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window, document)
- Event listeners
- Zustand stores

```typescript
// app/features/users/components/user-list.tsx
'use client';

import { useState } from 'react';
import type { User } from '@/features/users/types';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [filter, setFilter] = useState('');

  const filtered = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter users..."
      />
      <ul>
        {filtered.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Component Composition Pattern

**Push "use client" boundary down:**
```typescript
// app/features/dashboard/page.tsx - Server Component
import { DashboardStats } from './components/dashboard-stats';
import { InteractiveChart } from './components/interactive-chart'; // Client Component

export default async function DashboardPage() {
  const stats = await fetchStats(); // Server-side data fetching

  return (
    <div>
      <DashboardStats stats={stats} /> {/* Server Component */}
      <InteractiveChart data={stats.chartData} /> {/* Client Component */}
    </div>
  );
}
```

### Metadata for SEO

**Always define metadata for pages:**
```typescript
// app/features/users/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users | App Name',
  description: 'Manage and view all users in the system',
  openGraph: {
    title: 'Users | App Name',
    description: 'Manage and view all users in the system',
    images: ['/og-image-users.png'],
  },
};

export default function UsersPage() {
  // ...
}
```

**Dynamic metadata:**
```typescript
// app/features/users/[id]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await fetchUser(id);

  return {
    title: `${user.name} | App Name`,
    description: `Profile page for ${user.name}`,
  };
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  // ...
}
```

### Loading and Error States

```typescript
// app/features/users/loading.tsx
export default function Loading() {
  return <div>Loading users...</div>;
}

// app/features/users/error.tsx
'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 4. API Routes Organization & Patterns

### Why This Structure Matters
API routes in Next.js 15 use the new Route Handlers with improved TypeScript support and better streaming capabilities. Proper organization ensures maintainability as the app scales.

### File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   ├── logout/
│   │   │   └── route.ts
│   │   └── register/
│   │       └── route.ts
│   ├── users/
│   │   ├── route.ts              # GET /api/users, POST /api/users
│   │   └── [id]/
│   │       └── route.ts          # GET /api/users/:id, PATCH /api/users/:id
│   ├── cache/
│   │   └── invalidate/
│   │       └── route.ts
│   └── webhooks/
│       └── supabase/
│           └── route.ts
```

### Route Handler Pattern

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserSchema } from '@/features/users/schemas';
import { redis } from '@/lib/redis';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try cache first
    const cacheKey = `users:list:${user.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Fetch from database
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(users));

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validation = getUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.format() },
        { status: 400 }
      );
    }

    // Insert into database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert(validation.data)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Invalidate cache
    await redis.del(`users:list:${user.id}`);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Handler

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`GET /api/users/${(await params).id} error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### CORS Headers for API Routes

```typescript
// app/api/public/route.ts
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: 'public' });

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

## 5. Supabase Integration Patterns

### Why These Patterns Matter
Supabase provides both server and client SDKs. Using the wrong one can cause authentication issues, performance problems, and security vulnerabilities. Server-side queries are more secure and performant.

### Client Setup

**Server-side Supabase client (use in Server Components and API routes):**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

**Client-side Supabase client (use in Client Components):**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Middleware for Auth

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();

  // Protect routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Authentication Patterns

**Server-side auth check (Server Components):**

```typescript
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
    </div>
  );
}
```

**Client-side auth (Client Components):**

```typescript
// app/features/auth/components/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh(); // Refresh Server Components
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Database Query Patterns

**Type-safe queries:**

```typescript
// features/users/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string;
  website: string | null;
}

// features/users/api.ts
import { createClient } from '@/lib/supabase/server';
import type { User, Profile } from './types';

export async function getUser(id: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getUserWithProfile(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}
```

### Realtime Subscriptions

```typescript
// features/chat/components/message-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Message } from '@/features/chat/types';

interface MessageListProps {
  initialMessages: Message[];
  channelId: string;
}

export function MessageList({ initialMessages, channelId }: MessageListProps) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.content}</div>
      ))}
    </div>
  );
}
```

---

## 6. Redis Caching Strategies

### Why Caching Matters
Redis provides fast in-memory caching to reduce database load, improve response times, and handle high traffic. Proper cache patterns prevent stale data and memory bloat.

### Client Setup

```typescript
// lib/redis.ts
import { Redis } from 'ioredis';

const getRedisUrl = (): string => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error('REDIS_URL environment variable is not set');
};

export const redis = new Redis(getRedisUrl(), {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: false,
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});
```

### Cache Key Naming Convention

```typescript
// lib/redis/keys.ts
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  userProfile: (id: string) => `user:${id}:profile`,
  usersList: (page: number = 1) => `users:list:page:${page}`,
  post: (id: string) => `post:${id}`,
  postComments: (postId: string) => `post:${postId}:comments`,
  session: (token: string) => `session:${token}`,
} as const;
```

### Caching Patterns

**Cache-Aside (Lazy Loading):**

```typescript
// features/users/api.ts
import { redis } from '@/lib/redis';
import { cacheKeys } from '@/lib/redis/keys';
import { createClient } from '@/lib/supabase/server';
import type { User } from './types';

export async function getUser(id: string): Promise<User | null> {
  const cacheKey = cacheKeys.user(id);

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as User;
  }

  // Cache miss - fetch from database
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  // Store in cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(data));

  return data;
}
```

**Write-Through Cache:**

```typescript
// features/users/api.ts
export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User | null> {
  const supabase = await createClient();

  // Update database
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;

  // Update cache
  const cacheKey = cacheKeys.user(id);
  await redis.setex(cacheKey, 3600, JSON.stringify(data));

  // Invalidate related caches
  await redis.del(cacheKeys.usersList());

  return data;
}
```

**Cache Invalidation:**

```typescript
// features/users/api.ts
export async function deleteUser(id: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) return false;

  // Invalidate all related caches
  const cacheKey = cacheKeys.user(id);
  await redis.del(
    cacheKey,
    cacheKeys.userProfile(id),
    cacheKeys.usersList()
  );

  return true;
}
```

**Time-based Cache Expiration:**

```typescript
// lib/redis/utils.ts
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes
  MEDIUM: 1800,    // 30 minutes
  LONG: 3600,      // 1 hour
  DAY: 86400,      // 24 hours
} as const;

// Usage
await redis.setex(cacheKey, CACHE_TTL.MEDIUM, JSON.stringify(data));
```

**Cache Warming (for frequently accessed data):**

```typescript
// lib/redis/warming.ts
import { redis } from '@/lib/redis';
import { cacheKeys } from '@/lib/redis/keys';
import { CACHE_TTL } from '@/lib/redis/utils';

export async function warmPopularUsersCache(): Promise<void> {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .order('views', { ascending: false })
    .limit(100);

  if (!users) return;

  const pipeline = redis.pipeline();

  for (const user of users) {
    pipeline.setex(
      cacheKeys.user(user.id),
      CACHE_TTL.LONG,
      JSON.stringify(user)
    );
  }

  await pipeline.exec();
}
```

---

## 7. Zod Validation Patterns

### Why Zod Matters
Zod provides runtime type checking, automatic TypeScript inference, and detailed error messages. It's essential for validating user input, API responses, and form data.

### Schema Definition

```typescript
// features/users/schemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  created_at: true
});

export const updateUserSchema = userSchema
  .omit({ id: true, created_at: true })
  .partial();

export const getUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.enum(['name', 'email', 'created_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Infer TypeScript types from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserQuery = z.infer<typeof getUserQuerySchema>;
```

### API Route Validation

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/features/users/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    // validation.data is now typed and validated
    const { email, name, avatar_url } = validation.data;

    // Proceed with database operation
    // ...

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
```

### Search Params Validation

```typescript
// app/features/users/page.tsx
import { getUserQuerySchema } from '@/features/users/schemas';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Validate and parse search params
  const query = getUserQuerySchema.parse({
    page: params.page,
    limit: params.limit,
    search: params.search,
    sort: params.sort,
    order: params.order,
  });

  // query is now typed and validated with defaults applied
  const users = await getUsers(query);

  return <div>...</div>;
}
```

### Form Validation (Client-Side)

```typescript
// features/users/components/user-form.tsx
'use client';

import { useState } from 'react';
import { createUserSchema } from '@/features/users/schemas';
import type { CreateUserInput } from '@/features/users/schemas';

export function UserForm() {
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    name: '',
    avatar_url: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = createUserSchema.safeParse(formData);

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    // Submit validated data
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    // Handle response...
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <span className="text-red-500">{errors.name}</span>}
      </div>

      <button type="submit">Create User</button>
    </form>
  );
}
```

### Complex Schema Patterns

```typescript
// features/posts/schemas.ts
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200),
  content: z.string().min(10),
  status: z.enum(['draft', 'published', 'archived']),
  author_id: z.string().uuid(),
  tags: z.array(z.string()).max(10),
  metadata: z.object({
    views: z.number().int().min(0),
    likes: z.number().int().min(0),
    featured: z.boolean(),
  }),
  published_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})
  .refine(
    (data) => {
      // Custom validation: published posts must have published_at
      if (data.status === 'published' && !data.published_at) {
        return false;
      }
      return true;
    },
    {
      message: 'Published posts must have a publication date',
      path: ['published_at'],
    }
  );
```

---

## 8. Zustand State Management

### Why Zustand Matters
Zustand provides lightweight, flexible state management without boilerplate. It works seamlessly with React Server Components by keeping state on the client where needed.

### Store Definition

```typescript
// features/ui/stores/use-sidebar-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'sidebar-storage', // localStorage key
    }
  )
);
```

### Async State Management

```typescript
// features/users/stores/use-user-store.ts
import { create } from 'zustand';
import type { User } from '@/features/users/types';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  addUser: (user) => set((state) => ({
    users: [...state.users, user]
  })),

  removeUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
}));
```

### Using Stores in Components

```typescript
// features/ui/components/sidebar.tsx
'use client';

import { useSidebarStore } from '@/features/ui/stores/use-sidebar-store';

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside className={isOpen ? 'w-64' : 'w-0'}>
      <button onClick={toggle}>Toggle</button>
      {/* Sidebar content */}
    </aside>
  );
}
```

### Selector Pattern (Performance)

```typescript
// Only re-render when specific state changes
export function UserCount() {
  const count = useUserStore((state) => state.users.length);
  return <div>Total users: {count}</div>;
}

export function UserError() {
  const error = useUserStore((state) => state.error);
  if (!error) return null;
  return <div className="text-red-500">{error}</div>;
}
```

### Immer Middleware (Complex State Updates)

```typescript
// features/cart/stores/use-cart-store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  immer((set) => ({
    items: [],

    addItem: (item) => set((state) => {
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    }),

    removeItem: (id) => set((state) => {
      state.items = state.items.filter(i => i.id !== id);
    }),

    updateQuantity: (id, quantity) => set((state) => {
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }),

    clear: () => set((state) => {
      state.items = [];
    }),
  }))
);
```

---

## 9. shadcn/ui Component Integration

### Why shadcn/ui Matters
shadcn/ui provides copy-paste components that you own and can customize. It's not a dependency - components live in your codebase, giving you full control.

### Initial Setup

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Answer prompts:
# - TypeScript: yes
# - Style: Default
# - Base color: Slate
# - CSS variables: yes
# - React Server Components: yes
# - Import alias: @/
```

### Component Installation

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add toast
```

### Directory Structure

```
components/
├── ui/                    # shadcn/ui components (auto-generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   └── ...
└── shared/                # Custom shared components
    ├── header.tsx
    ├── footer.tsx
    └── ...
```

### Tailwind CSS Configuration for shadcn/ui

**Update `app/globals.css` with shadcn/ui theme variables:**

```css
@import "tailwindcss";

@theme inline {
  /* shadcn/ui color system */
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 222.2 84% 4.9%;
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96.1%;
  --color-secondary-foreground: 222.2 47.4% 11.2%;
  --color-muted: 210 40% 96.1%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  --color-accent: 210 40% 96.1%;
  --color-accent-foreground: 222.2 47.4% 11.2%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme inline {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    --color-card: 222.2 84% 4.9%;
    --color-card-foreground: 210 40% 98%;
    --color-popover: 222.2 84% 4.9%;
    --color-popover-foreground: 210 40% 98%;
    --color-primary: 210 40% 98%;
    --color-primary-foreground: 222.2 47.4% 11.2%;
    --color-secondary: 217.2 32.6% 17.5%;
    --color-secondary-foreground: 210 40% 98%;
    --color-muted: 217.2 32.6% 17.5%;
    --color-muted-foreground: 215 20.2% 65.1%;
    --color-accent: 217.2 32.6% 17.5%;
    --color-accent-foreground: 210 40% 98%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 210 40% 98%;
    --color-border: 217.2 32.6% 17.5%;
    --color-input: 217.2 32.6% 17.5%;
    --color-ring: 212.7 26.8% 83.9%;
  }
}
```

### Using shadcn/ui Components

```typescript
// features/auth/components/login-form.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Form Integration with Zod

```bash
# Install required dependencies
npm install react-hook-form @hookform/resolvers
```

```typescript
// features/users/components/create-user-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserInput } from '@/features/users/schemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export function CreateUserForm() {
  const { toast } = useToast();
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      name: '',
      avatar_url: null,
    },
  });

  async function onSubmit(values: CreateUserInput) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to create user');

      toast({
        title: 'Success',
        description: 'User created successfully',
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>User's email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}
```

### Customizing Components

```typescript
// components/ui/button.tsx (example of customization)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## 10. Screaming Architecture (Feature-Based Organization)

### Why Screaming Architecture Matters
Screaming Architecture makes the purpose of the application immediately clear from the folder structure. Features are self-contained, making the codebase easier to navigate and scale.

### Project Structure

```
app/
├── (auth)/                    # Route group (doesn't affect URL)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
│
├── (dashboard)/               # Route group with shared layout
│   ├── dashboard/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── layout.tsx
│
├── api/                       # API routes
│   ├── auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   └── users/
│       ├── route.ts
│       └── [id]/route.ts
│
├── features/                  # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── auth-provider.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── use-session.ts
│   │   ├── stores/
│   │   │   └── use-auth-store.ts
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── schemas.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   │   ├── user-list.tsx
│   │   │   ├── user-card.tsx
│   │   │   └── user-form.tsx
│   │   ├── hooks/
│   │   │   └── use-users.ts
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── schemas.ts
│   │
│   ├── posts/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── schemas.ts
│   │
│   └── ui/                    # UI-specific features (sidebar, theme, etc.)
│       ├── components/
│       │   ├── sidebar.tsx
│       │   └── theme-toggle.tsx
│       └── stores/
│           └── use-sidebar-store.ts
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── shared/                # Shared components across features
│       ├── header.tsx
│       ├── footer.tsx
│       └── loading-spinner.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   ├── redis/
│   │   ├── index.ts
│   │   ├── keys.ts
│   │   └── utils.ts
│   ├── analytics/
│   │   └── index.ts
│   └── utils.ts               # General utilities (cn, formatDate, etc.)
│
├── hooks/                     # Shared hooks
│   ├── use-toast.ts
│   ├── use-media-query.ts
│   └── use-debounce.ts
│
├── types/                     # Shared types
│   ├── database.ts            # Supabase generated types
│   └── common.ts
│
├── globals.css
├── layout.tsx
└── page.tsx

public/
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-icon.png
├── screenshots/
│   ├── mobile-1.png
│   └── mobile-2.png
├── manifest.json
└── sw.js                      # Service worker

.env.local                     # Environment variables
next.config.ts
middleware.ts
tsconfig.json
package.json
```

### Feature Module Pattern

**Each feature should be self-contained:**

```
features/users/
├── components/          # Feature-specific components
│   ├── user-list.tsx
│   ├── user-card.tsx
│   └── user-form.tsx
├── hooks/               # Feature-specific hooks
│   └── use-users.ts
├── stores/              # Feature-specific Zustand stores (if needed)
│   └── use-user-store.ts
├── api.ts               # Server-side data fetching functions
├── types.ts             # TypeScript types for this feature
└── schemas.ts           # Zod schemas for validation
```

### Example Feature Module

```typescript
// features/users/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

// features/users/schemas.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2),
  avatar_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
});

export const createUserSchema = userSchema.omit({ id: true, created_at: true });

// features/users/api.ts
import { createClient } from '@/lib/supabase/server';
import type { User } from './types';

export async function getUsers(): Promise<User[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getUser(id: string): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// features/users/components/user-list.tsx
import type { User } from '../types';
import { UserCard } from './user-card';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// app/features/users/page.tsx (consuming the feature)
import { getUsers } from '@/features/users/api';
import { UserList } from '@/features/users/components/user-list';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <UserList users={users} />
    </div>
  );
}
```

### Route Groups

**Use route groups for shared layouts without affecting URLs:**

```typescript
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/features/ui/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

// app/(dashboard)/dashboard/page.tsx
// URL: /dashboard (not /dashboard/dashboard)

// app/(dashboard)/settings/page.tsx
// URL: /settings (not /dashboard/settings)
```

---

## 11. Mobile-First Responsive Design

### Why Mobile-First Matters
With 60%+ of web traffic from mobile devices, starting with mobile ensures the best experience for the majority. Progressive enhancement adds features for larger screens.

### Breakpoint System (Tailwind 4.0)

```
Tailwind Breakpoints:
- default (no prefix): 0px - 639px     (mobile)
- sm: 640px+                            (large mobile/small tablet)
- md: 768px+                            (tablet)
- lg: 1024px+                           (desktop)
- xl: 1280px+                           (large desktop)
- 2xl: 1536px+                          (extra large desktop)
```

### Mobile-First CSS Pattern

```tsx
// Always start with mobile styles, then add larger breakpoints
<div className="
  px-4           {/* Mobile: 16px padding */}
  sm:px-6        {/* Tablet: 24px padding */}
  lg:px-8        {/* Desktop: 32px padding */}

  grid           {/* Mobile: 1 column grid */}
  sm:grid-cols-2 {/* Tablet: 2 columns */}
  lg:grid-cols-3 {/* Desktop: 3 columns */}

  text-sm        {/* Mobile: small text */}
  md:text-base   {/* Tablet+: regular text */}
">
  Content
</div>
```

### Component Responsive Patterns

```typescript
// features/posts/components/post-grid.tsx
import type { Post } from '@/features/posts/types';
import { PostCard } from './post-card';

interface PostGridProps {
  posts: Post[];
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="
      grid gap-4
      grid-cols-1          {/* Mobile: 1 column */}
      sm:grid-cols-2       {/* Small tablet: 2 columns */}
      lg:grid-cols-3       {/* Desktop: 3 columns */}
      xl:grid-cols-4       {/* Large desktop: 4 columns */}
      p-4 sm:p-6 lg:p-8
    ">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Responsive Navigation

```typescript
// components/shared/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            App Name
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/users">Users</Link>
            <Link href="/settings">Settings</Link>
            <Button>Login</Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/users" onClick={() => setMobileMenuOpen(false)}>
              Users
            </Link>
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
              Settings
            </Link>
            <Button className="w-full">Login</Button>
          </nav>
        )}
      </div>
    </header>
  );
}
```

### Use Media Query Hook

```typescript
// hooks/use-media-query.ts
'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Usage in components
export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### Touch-Friendly Sizing

```tsx
// Ensure interactive elements are at least 44x44px (Apple HIG) or 48x48px (Material)
<button className="
  min-h-[44px] min-w-[44px]  {/* Minimum touch target */}
  px-4 py-2                   {/* Comfortable padding */}
  text-base                   {/* Readable text size */}
  active:scale-95             {/* Touch feedback */}
  transition-transform
">
  Tap me
</button>
```

### Viewport Meta Tag (Required for Mobile)

```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  // ... other metadata
};
```

---

## 12. PWA Configuration

### Why PWA Matters
PWAs provide app-like experiences on mobile devices: offline support, home screen installation, push notifications, and faster loading. Essential for mobile-first applications.

### Web App Manifest

```json
// public/manifest.json
{
  "name": "App Name",
  "short_name": "App",
  "description": "Your app description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/maskable-icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/mobile-2.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "categories": ["productivity", "business"],
  "shortcuts": [
    {
      "name": "Dashboard",
      "short_name": "Dashboard",
      "description": "Go to dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/icons/dashboard.png", "sizes": "192x192" }]
    }
  ]
}
```

### Link Manifest in Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  // ... other metadata
};
```

### Service Worker Setup

**Install next-pwa:**

```bash
npm install @ducanh2912/next-pwa
```

**Configure Next.js:**

```typescript
// next.config.ts
import type { NextConfig } from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  // Your existing config
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\..*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
})(nextConfig);
```

### Offline Fallback Page

```typescript
// app/offline/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-muted-foreground mb-6">
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
```

### Install Prompt Component

```typescript
// features/pwa/components/install-prompt.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">Install App</h3>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Install this app on your device for a better experience.
      </p>
      <div className="flex gap-2">
        <Button onClick={handleInstall} className="flex-1">
          Install
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowPrompt(false)}
          className="flex-1"
        >
          Not now
        </Button>
      </div>
    </div>
  );
}
```

---

## 13. SEO Optimization

### Why SEO Matters
Proper SEO ensures your app is discoverable, ranks well in search engines, and provides good social media previews. Next.js 15 makes SEO implementation straightforward.

### Root Layout Metadata

```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

const APP_NAME = 'Your App Name';
const APP_DESCRIPTION = 'Your app description goes here';
const APP_URL = 'https://yourapp.com';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/twitter-image.png`],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};
```

### Page-Level Metadata

```typescript
// app/features/users/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Browse and manage users in the system',
  openGraph: {
    title: 'Users',
    description: 'Browse and manage users in the system',
    images: ['/og-images/users.png'],
  },
};

export default function UsersPage() {
  // ...
}
```

### Dynamic Metadata

```typescript
// app/features/users/[id]/page.tsx
import type { Metadata } from 'next';
import { getUser } from '@/features/users/api';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: user.name,
    description: `Profile page for ${user.name}`,
    openGraph: {
      title: user.name,
      description: `Profile page for ${user.name}`,
      images: user.avatar_url ? [user.avatar_url] : [],
    },
  };
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);
  // ...
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getUsers } from '@/features/users/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourapp.com';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/users`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic routes (users)
  const users = await getUsers();
  const userRoutes: MetadataRoute.Sitemap = users.map(user => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: new Date(user.updated_at || user.created_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...userRoutes];
}
```

### Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://yourapp.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Structured Data (JSON-LD)

```typescript
// components/shared/structured-data.tsx
interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage in a page
// app/page.tsx
import { StructuredData } from '@/components/shared/structured-data';

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Your App Name',
    'description': 'Your app description',
    'url': 'https://yourapp.com',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web',
  };

  return (
    <>
      <StructuredData data={structuredData} />
      {/* Page content */}
    </>
  );
}
```

---

## 14. Analytics Implementation

### Why Analytics Matters
Analytics help you understand user behavior, track conversions, identify issues, and make data-driven decisions. Essential for product iteration and growth.

### Analytics Client Setup

```typescript
// lib/analytics/index.ts
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}

class Analytics {
  private userId: string | null = null;

  init(userId?: string) {
    if (userId) {
      this.userId = userId;
    }

    // Initialize analytics providers
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (process.env.NEXT_PUBLIC_GA_ID) {
        this.initGoogleAnalytics();
      }

      // Plausible Analytics (privacy-friendly alternative)
      if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
        this.initPlausible();
      }
    }
  }

  private initGoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (!gaId) return;

    // Load GA script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize GA
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  }

  private initPlausible() {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) return;

    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = domain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  identify(userId: string, traits?: Record<string, unknown>) {
    this.userId = userId;

    // Send to analytics providers
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...traits,
      });
    }
  }

  track(event: string, properties?: Record<string, unknown>) {
    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        user_id: this.userId,
        timestamp: new Date().toISOString(),
      },
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event, eventData.properties);
    }

    // Plausible (custom events)
    if (window.plausible) {
      window.plausible(event, { props: eventData.properties });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventData);
    }
  }

  page(path: string, properties?: Record<string, unknown>) {
    this.track('page_view', {
      path,
      ...properties,
    });
  }
}

export const analytics = new Analytics();

// Type augmentation for window
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    plausible: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}
```

### Analytics Provider Component

```typescript
// components/providers/analytics-provider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize analytics
    analytics.init();
  }, []);

  useEffect(() => {
    // Track page views on route change
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    analytics.page(url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

### Add to Root Layout

```typescript
// app/layout.tsx
import { AnalyticsProvider } from '@/components/providers/analytics-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

### Usage in Components

```typescript
// features/users/components/user-card.tsx
'use client';

import { analytics } from '@/lib/analytics';
import type { User } from '@/features/users/types';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const handleClick = () => {
    // Track user interactions
    analytics.track('user_card_clicked', {
      user_id: user.id,
      user_name: user.name,
    });
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

### Common Events to Track

```typescript
// lib/analytics/events.ts
import { analytics } from './index';

export const trackUserSignUp = (userId: string, method: string) => {
  analytics.track('user_signed_up', {
    user_id: userId,
    method, // 'email', 'google', 'github'
  });
};

export const trackUserLogin = (userId: string, method: string) => {
  analytics.track('user_logged_in', {
    user_id: userId,
    method,
  });
};

export const trackFeatureUsed = (featureName: string) => {
  analytics.track('feature_used', {
    feature_name: featureName,
  });
};

export const trackFormSubmitted = (formName: string, success: boolean) => {
  analytics.track('form_submitted', {
    form_name: formName,
    success,
  });
};

export const trackError = (errorType: string, errorMessage: string) => {
  analytics.track('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
  });
};

export const trackButtonClicked = (buttonName: string, location: string) => {
  analytics.track('button_clicked', {
    button_name: buttonName,
    location,
  });
};
```

### Server-Side Analytics (API Routes)

```typescript
// app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Store analytics event in database
    await supabase.from('analytics_events').insert({
      event,
      properties: {
        ...properties,
        user_id: user?.id,
        user_agent: request.headers.get('user-agent'),
        ip: request.ip,
      },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
```

---

## 15. Code Quality & Best Practices

### Why Code Quality Matters
Consistent, clean code reduces bugs, improves maintainability, facilitates collaboration, and makes onboarding easier. These practices ensure long-term project health.

### Biome Configuration

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      ".next",
      "node_modules",
      "dist",
      "build",
      ".env*"
    ]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "warn",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "useImportType": "error",
        "useNodejsImportProtocol": "error",
        "noNonNullAssertion": "warn"
      },
      "suspicious": {
        "noExplicitAny": "error",
        "noArrayIndexKey": "warn"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  }
}
```

### Naming Conventions

```typescript
// ✅ GOOD - Clear, descriptive names

// Components: PascalCase
export function UserProfileCard() {}
export function DashboardLayout() {}

// Functions: camelCase, verb-based
export function fetchUserData() {}
export function validateEmail() {}
export function handleFormSubmit() {}

// Types/Interfaces: PascalCase
export interface User {}
export type UserRole = 'admin' | 'user';

// Constants: SCREAMING_SNAKE_CASE
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
export const API_BASE_URL = 'https://api.example.com';

// Files: kebab-case
// user-profile-card.tsx
// fetch-user-data.ts
// use-auth-store.ts

// Feature folders: kebab-case
// features/user-profile/
// features/auth-management/

// ❌ BAD - Unclear, inconsistent names
function get() {} // Too vague
const d = new Date(); // Single letter
interface data {} // Not descriptive
const maxsize = 5000; // Inconsistent casing
```

### Component Organization

```typescript
// features/users/components/user-card.tsx

// 1. Imports - grouped and organized
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import type { User } from '@/features/users/types';

// 2. Types/Interfaces
interface UserCardProps {
  user: User;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

// 3. Component
export function UserCard({
  user,
  onDelete,
  showActions = true
}: UserCardProps) {
  // 4. Hooks (at top of component)
  const [isDeleting, setIsDeleting] = useState(false);

  // 5. Derived state
  const fullName = `${user.first_name} ${user.last_name}`;

  // 6. Event handlers
  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    analytics.track('user_deleted', { user_id: user.id });

    try {
      await onDelete(user.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // 7. Render
  return (
    <Card>
      <CardHeader>
        <h3>{fullName}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardHeader>

      {showActions && (
        <CardContent>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/users/${user.id}`}>View</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
```

### Error Handling Patterns

```typescript
// features/users/api.ts
import { createClient } from '@/lib/supabase/server';
import type { User } from './types';

// Define custom error types
export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class UserFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserFetchError';
  }
}

// Use explicit error handling
export async function getUser(id: string): Promise<User> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new UserFetchError(error.message);
    }

    if (!data) {
      throw new UserNotFoundError(id);
    }

    return data;
  } catch (error) {
    // Re-throw known errors
    if (error instanceof UserNotFoundError || error instanceof UserFetchError) {
      throw error;
    }

    // Wrap unknown errors
    throw new UserFetchError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

// Component error handling
// app/features/users/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getUser, UserNotFoundError } from '@/features/users/api';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser(id);

    return <div>{user.name}</div>;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      notFound(); // Renders 404 page
    }

    throw error; // Let error boundary handle other errors
  }
}
```

### Comments & Documentation

```typescript
// ✅ GOOD - Comments explain WHY, not WHAT

/**
 * Fetches user data with caching to reduce database load.
 * Uses Redis for 5-minute cache to balance freshness and performance.
 */
export async function getCachedUser(id: string): Promise<User | null> {
  // Try cache first to minimize database queries during high traffic
  const cached = await redis.get(cacheKeys.user(id));
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const user = await getUser(id);

  // Cache for 5 minutes (300s) - short TTL because user data changes frequently
  await redis.setex(cacheKeys.user(id), 300, JSON.stringify(user));

  return user;
}

// ❌ BAD - Comments state the obvious

// Get the cached value
const cached = await redis.get(key);

// Check if cached value exists
if (cached) {
  // Parse the JSON
  return JSON.parse(cached);
}
```

### Environment Variables

```bash
# .env.local
# Never commit this file to version control!

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Redis
REDIS_URL=redis://localhost:6379

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourapp.com

# App Config
NEXT_PUBLIC_APP_URL=https://yourapp.com
NODE_ENV=development
```

```typescript
// lib/env.ts - Validate environment variables at startup
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  REDIS_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

---

## 16. Testing Strategy (Future Implementation)

### Why Testing Matters
While not implemented yet, having a testing strategy ensures reliability, prevents regressions, and enables confident refactoring. Plan for testing from the start.

### Recommended Testing Stack

```json
// Future dependencies
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "vitest": "^1.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "playwright": "^1.40.0"
  }
}
```

### Test File Structure

```
features/users/
├── api.ts
├── api.test.ts
├── components/
│   ├── user-card.tsx
│   └── user-card.test.tsx
├── hooks/
│   ├── use-users.ts
│   └── use-users.test.ts
└── schemas.ts
    └── schemas.test.ts
```

---

## Summary: Quick Reference Checklist

### Before Starting Development

- [ ] Verify TypeScript strict mode is enabled
- [ ] Confirm Tailwind 4.0 is using CSS-based config (no .js config file)
- [ ] Set up Supabase server and client helpers
- [ ] Configure Redis client
- [ ] Install and configure shadcn/ui
- [ ] Set up Biome for linting/formatting
- [ ] Create initial feature folders following screaming architecture

### For Every New Feature

- [ ] Create feature folder in `features/`
- [ ] Define types in `types.ts`
- [ ] Define Zod schemas in `schemas.ts`
- [ ] Create API functions in `api.ts`
- [ ] Build components in `components/`
- [ ] Add Zustand store if needed in `stores/`
- [ ] Implement Redis caching for expensive operations
- [ ] Add proper error handling
- [ ] Track analytics events

### For Every Component

- [ ] Use Server Component by default
- [ ] Add "use client" only when needed (interactivity, hooks, browser APIs)
- [ ] Implement mobile-first responsive design
- [ ] Use shadcn/ui components when applicable
- [ ] Add proper TypeScript types for all props
- [ ] Handle loading and error states

### For Every API Route

- [ ] Validate request with Zod schemas
- [ ] Check authentication with Supabase
- [ ] Implement proper error handling
- [ ] Add Redis caching where appropriate
- [ ] Return proper HTTP status codes
- [ ] Log errors for debugging

### Before Deploying

- [ ] Run `npm run lint` and fix all issues
- [ ] Run `npm run format` to format code
- [ ] Verify all environment variables are set
- [ ] Test PWA installation flow
- [ ] Verify SEO metadata on all pages
- [ ] Check mobile responsiveness on real devices
- [ ] Test offline functionality
- [ ] Verify analytics tracking works

---

## Common Pitfalls to Avoid

### Tailwind CSS 4.0

- Creating `tailwind.config.js` or `tailwind.config.ts` files
- Using old plugin syntax from Tailwind v3 documentation
- Forgetting to use `@theme inline` for customization

### Next.js App Router

- Using "use client" when Server Component would work
- Not awaiting `params` in dynamic routes (Next.js 15 requirement)
- Fetching data in Client Components instead of Server Components
- Not handling loading and error states

### TypeScript

- Using `any` type instead of proper types or `unknown`
- Not defining explicit return types for functions
- Skipping Zod validation for user input

### Supabase

- Using client-side Supabase in Server Components
- Not refreshing sessions in middleware
- Exposing service role key in client-side code

### Redis

- Not setting TTL on cached data (causes memory bloat)
- Forgetting to invalidate cache on updates
- Not handling Redis connection errors

### State Management

- Using Zustand for server-side data (use Server Components instead)
- Creating too many stores (prefer component state when possible)

### Mobile Design

- Not testing on real mobile devices
- Using fixed pixel values instead of responsive units
- Creating touch targets smaller than 44x44px

---

This comprehensive ruleset ensures consistency, quality, and best practices throughout the development process. Refer to specific sections as needed during development.
