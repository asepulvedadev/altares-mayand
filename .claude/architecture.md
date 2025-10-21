# Project Architecture

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 PWA                          │
│                  (App Router + React 19)                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Frontend   │  │   Backend    │  │  Services    │
│              │  │              │  │              │
│ - React 19   │  │ - API Routes │  │ - Supabase   │
│ - TypeScript │  │ - Server     │  │ - Redis      │
│ - Tailwind 4 │  │   Components │  │ - Analytics  │
│ - shadcn/ui  │  │ - Middleware │  │              │
│ - Zustand    │  │ - Zod        │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Application Layers

```
┌────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages (app/) - Server Components (default)                │  │
│  │ • SEO-optimized with metadata                             │  │
│  │ • Data fetching from Backend Layer                        │  │
│  │ • Render UI components                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Client Components - Interactive UI                        │  │
│  │ • Forms, buttons, modals                                  │  │
│  │ • Event handlers                                          │  │
│  │ • Client-side state (Zustand)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Features (features/) - Feature Modules                    │  │
│  │ • Self-contained business logic                           │  │
│  │ • Components, hooks, stores                               │  │
│  │ • Types, schemas, API functions                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Routes (app/api/) - Backend endpoints                 │  │
│  │ • RESTful API                                             │  │
│  │ • Authentication checks                                   │  │
│  │ • Input validation (Zod)                                  │  │
│  │ • Business logic execution                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Supabase - Primary Database                               │  │
│  │ • PostgreSQL database                                     │  │
│  │ • Real-time subscriptions                                 │  │
│  │ • Authentication & authorization                          │  │
│  │ • Storage (files, images)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Redis - Caching Layer                                     │  │
│  │ • Query result caching                                    │  │
│  │ • Session storage                                         │  │
│  │ • Rate limiting                                           │  │
│  │ • Temporary data storage                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Feature Module Structure (Screaming Architecture)

```
features/
│
├── auth/                           # Authentication feature
│   ├── components/
│   │   ├── login-form.tsx          # Login form component
│   │   ├── register-form.tsx       # Registration form
│   │   └── auth-provider.tsx       # Auth context provider
│   ├── hooks/
│   │   ├── use-auth.ts             # Auth hook
│   │   └── use-session.ts          # Session management
│   ├── stores/
│   │   └── use-auth-store.ts       # Auth state (Zustand)
│   ├── api.ts                      # Server-side auth functions
│   ├── types.ts                    # TypeScript interfaces
│   └── schemas.ts                  # Zod validation schemas
│
├── users/                          # User management feature
│   ├── components/
│   │   ├── user-list.tsx
│   │   ├── user-card.tsx
│   │   └── user-form.tsx
│   ├── hooks/
│   │   └── use-users.ts
│   ├── api.ts
│   ├── types.ts
│   └── schemas.ts
│
└── ui/                             # UI-specific features
    ├── components/
    │   ├── sidebar.tsx
    │   ├── header.tsx
    │   └── theme-toggle.tsx
    └── stores/
        └── use-sidebar-store.ts
```

## Data Flow Architecture

### Server Component Data Flow (Recommended)

```
┌─────────────┐
│   Browser   │
└─────┬───────┘
      │ 1. Request page
      ▼
┌─────────────────────┐
│  Server Component   │ (app/features/users/page.tsx)
│  (Next.js Server)   │
└─────┬───────────────┘
      │ 2. Fetch data
      ▼
┌─────────────────────┐
│  Feature API        │ (features/users/api.ts)
│  (Server-side)      │
└─────┬───────────────┘
      │ 3. Check cache
      ▼
┌─────────────────────┐    Cache hit
│      Redis          │────────────┐
└─────┬───────────────┘            │
      │ Cache miss                 │
      │ 4. Query database          │
      ▼                            │
┌─────────────────────┐            │
│     Supabase        │            │
└─────┬───────────────┘            │
      │ 5. Return data             │
      └────────────────────────────┘
      │ 6. Cache result
      ▼
┌─────────────────────┐
│      Redis          │
└─────┬───────────────┘
      │ 7. Return to component
      ▼
┌─────────────────────┐
│  Server Component   │
│  (Renders HTML)     │
└─────┬───────────────┘
      │ 8. Send HTML
      ▼
┌─────────────────────┐
│     Browser         │
│  (Hydrates React)   │
└─────────────────────┘
```

### Client Component Data Flow (When interactivity needed)

```
┌─────────────┐
│   Browser   │
└─────┬───────┘
      │ 1. User interaction (click, input, etc.)
      ▼
┌─────────────────────┐
│  Client Component   │ (features/users/components/user-form.tsx)
│  (Browser)          │
└─────┬───────────────┘
      │ 2. Validate with Zod
      ▼
┌─────────────────────┐
│   Zod Schema        │
└─────┬───────────────┘
      │ 3. Send to API
      ▼
┌─────────────────────┐
│   API Route         │ (app/api/users/route.ts)
│  (Next.js Server)   │
└─────┬───────────────┘
      │ 4. Authenticate
      ▼
┌─────────────────────┐
│    Supabase Auth    │
└─────┬───────────────┘
      │ 5. Validate input
      ▼
┌─────────────────────┐
│    Zod Schema       │
└─────┬───────────────┘
      │ 6. Execute operation
      ▼
┌─────────────────────┐
│   Supabase DB       │
└─────┬───────────────┘
      │ 7. Invalidate cache
      ▼
┌─────────────────────┐
│      Redis          │
└─────┬───────────────┘
      │ 8. Return response
      ▼
┌─────────────────────┐
│  Client Component   │
│  (Update UI)        │
└─────┬───────────────┘
      │ 9. Track analytics
      ▼
┌─────────────────────┐
│    Analytics        │
└─────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. User visits protected route
   │
   ▼
2. Middleware intercepts request
   │
   ├──> Check Supabase session
   │    │
   │    ├──> Session valid ──> Allow request ──> Continue to page
   │    │
   │    └──> Session invalid ──> Redirect to /login
   │
   ▼
3. User logs in (login form)
   │
   ▼
4. Submit credentials to Supabase
   │
   ├──> Success ──> Set session cookie ──> Redirect to dashboard
   │
   └──> Failure ──> Show error ──> Stay on login page

Protected Pages:
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Middleware  │ ───> │   Supabase   │ ───> │  Page/Route  │
│  (Session    │      │  (Validate)  │      │  (Render)    │
│   Check)     │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                       CACHING LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

Request Flow:
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  Next.js Cache       │ (Build-time static generation)
│  • Static pages      │
│  • ISR pages         │
└──────┬───────────────┘
       │ Cache miss
       ▼
┌──────────────────────┐
│  Redis Cache         │ (Runtime caching)
│  • API responses     │
│  • DB queries        │
│  • Session data      │
│  TTL: 5min - 24hrs   │
└──────┬───────────────┘
       │ Cache miss
       ▼
┌──────────────────────┐
│  Supabase Database   │ (Source of truth)
│  • PostgreSQL        │
└──────────────────────┘

Cache Invalidation:
┌──────────────────────┐
│  Data Update         │
│  (POST/PATCH/DELETE) │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Update Database     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Invalidate Redis    │
│  • Delete key(s)     │
│  • Clear pattern     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Next request        │
│  rebuilds cache      │
└──────────────────────┘
```

## Mobile-First Responsive Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     RESPONSIVE BREAKPOINTS                       │
└─────────────────────────────────────────────────────────────────┘

Mobile First Approach:

┌──────────────┐
│   Mobile     │  Default (0px+)
│  320-639px   │  • Single column layouts
│              │  • Stacked navigation
│              │  • Full-width cards
│              │  • Large touch targets (44px min)
└──────┬───────┘
       │ @media sm (640px+)
       ▼
┌──────────────┐
│   Tablet     │  sm: (640px+)
│  640-1023px  │  • Two column layouts
│              │  • Collapsible sidebar
│              │  • Grid layouts (2 cols)
└──────┬───────┘
       │ @media lg (1024px+)
       ▼
┌──────────────┐
│   Desktop    │  lg: (1024px+)
│  1024-1279px │  • Three column layouts
│              │  • Persistent sidebar
│              │  • Grid layouts (3-4 cols)
└──────┬───────┘
       │ @media xl (1280px+)
       ▼
┌──────────────┐
│ Large Screen │  xl: (1280px+)
│   1280px+    │  • Four+ column layouts
│              │  • Maximum width containers
│              │  • Enhanced spacing
└──────────────┘

Tailwind Implementation:
<div className="
  px-4 sm:px-6 lg:px-8           {/* Responsive padding */}
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  {/* Responsive grid */}
  text-sm md:text-base           {/* Responsive text */}
">
```

## PWA Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PWA COMPONENTS                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   manifest.json      │  • App metadata
│                      │  • Icons (72px-512px)
│                      │  • Display mode: standalone
│                      │  • Theme colors
│                      │  • Shortcuts
└──────────────────────┘

┌──────────────────────┐
│  Service Worker      │  • Offline support
│  (next-pwa)          │  • Cache strategies
│                      │  • Background sync
│                      │  • Push notifications
└──────────────────────┘

┌──────────────────────┐
│  Install Prompt      │  • beforeinstallprompt event
│                      │  • Custom install UI
│                      │  • User choice tracking
└──────────────────────┘

Cache Strategies:
┌────────────────┬──────────────────────────────────┐
│ Resource Type  │ Strategy                         │
├────────────────┼──────────────────────────────────┤
│ App Shell      │ Cache First (Pre-cache)          │
│ API Calls      │ Network First (24hr fallback)    │
│ Images         │ Cache First (30 day expiration)  │
│ Static Assets  │ Cache First (Immutable)          │
│ User Data      │ Network First (Cache fallback)   │
└────────────────┴──────────────────────────────────┘
```

## SEO Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       SEO IMPLEMENTATION                         │
└─────────────────────────────────────────────────────────────────┘

Static Metadata (Root Layout):
┌──────────────────────┐
│  app/layout.tsx      │
│  • Application name  │
│  • Default title     │
│  • Description       │
│  • Open Graph        │
│  • Twitter Card      │
│  • Icons             │
│  • Manifest link     │
└──────────────────────┘

Dynamic Metadata (Pages):
┌──────────────────────┐
│  app/*/page.tsx      │
│  • Page-specific     │
│    title             │
│  • Description       │
│  • OG images         │
│  • Keywords          │
└──────────────────────┘

Generated Files:
┌──────────────────────┐
│  app/sitemap.ts      │  • URL list
│                      │  • Change frequency
│                      │  • Priority
└──────────────────────┘

┌──────────────────────┐
│  app/robots.ts       │  • Crawl rules
│                      │  • Sitemap location
└──────────────────────┘

Structured Data:
┌──────────────────────┐
│  JSON-LD Schema      │  • Organization
│                      │  • WebApplication
│                      │  • BreadcrumbList
│                      │  • Article (posts)
└──────────────────────┘
```

## Analytics Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ANALYTICS PIPELINE                          │
└─────────────────────────────────────────────────────────────────┘

Client-Side Tracking:
┌──────────────┐
│ User Action  │ (Click, form submit, page view, etc.)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Analytics Library    │
│ (lib/analytics)      │
└──────┬───────────────┘
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│ Google Analytics │    │  Plausible.io    │
│  (if enabled)    │    │  (if enabled)    │
└──────────────────┘    └──────────────────┘

Server-Side Tracking:
┌──────────────┐
│  API Route   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ POST /api/analytics  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Store in Supabase    │
│ analytics_events     │
└──────────────────────┘

Events Tracked:
• Page views (automatic)
• User authentication (login, signup, logout)
• Feature usage
• Form submissions
• Button clicks
• Errors
• Performance metrics
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                           │
└─────────────────────────────────────────────────────────────────┘

Development:
┌──────────────┐
│ Local Dev    │
│ npm run dev  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Git Commit   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ GitHub Push  │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Vercel (Recommended)   │
│ • Auto-deploy          │
│ • Preview deployments  │
│ • Edge network         │
│ • Automatic HTTPS      │
└────────────────────────┘

Environment Setup:
┌────────────────────────┐
│ Vercel Dashboard       │
│ • Set env variables    │
│ • Configure domains    │
│ • Enable analytics     │
└────────────────────────┘

External Services:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Supabase    │  │    Redis     │  │  Analytics   │
│  (Managed)   │  │   (Upstash)  │  │  (3rd party) │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

1. Input Validation (Zod)
   ├─> All user input validated
   ├─> Type safety enforced
   └─> Injection prevention

2. Authentication (Supabase)
   ├─> JWT-based sessions
   ├─> Secure cookie storage
   ├─> Middleware protection
   └─> Row Level Security

3. Authorization
   ├─> Role-based access (Supabase RLS)
   ├─> API route guards
   └─> Client-side route protection

4. Data Protection
   ├─> Environment variables (.env.local)
   ├─> Server-side secrets (never exposed)
   ├─> HTTPS in production
   └─> CSP headers

5. Rate Limiting (Redis)
   ├─> API endpoint throttling
   ├─> Login attempt limits
   └─> DDoS prevention
```

---

This architecture is designed to be:
- **Scalable** - Feature-based organization grows with your app
- **Performant** - Multi-layer caching and Server Components
- **Secure** - Multiple security layers and best practices
- **Maintainable** - Clear separation of concerns
- **Mobile-first** - Optimized for mobile devices
- **SEO-friendly** - Metadata and structured data
