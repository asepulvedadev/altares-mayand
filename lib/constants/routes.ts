/**
 * Application route constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCT_DETAIL: (slug: string) => `/producto/${slug}`,

  // Auth routes
  AUTH_LOGIN: '/auth/login',
  AUTH_CALLBACK: '/auth/callback',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_ALTARES: '/admin/altares',
  ADMIN_ALTAR_NEW: '/admin/altares/nuevo',
  ADMIN_ALTAR_EDIT: (id: string) => `/admin/altares/${id}/editar`,
  ADMIN_CONFIGURACIONES: '/admin/configuraciones',
  ADMIN_EXTRAS: '/admin/extras',
  ADMIN_PEDIDOS: '/admin/pedidos',

  // API routes
  API_ALTARES: '/api/altares',
  API_ALTAR_BY_ID: (id: string) => `/api/altares/${id}`,
  API_CONFIGURACIONES: '/api/configuraciones',
  API_ITEMS_EXTRA: '/api/items-extra',
  API_CALCULAR_PRECIO: '/api/calcular-precio',
  API_PEDIDOS: '/api/pedidos',
} as const

export const ADMIN_NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Altares',
    href: ROUTES.ADMIN_ALTARES,
    icon: 'Package',
  },
  {
    label: 'Configuraciones',
    href: ROUTES.ADMIN_CONFIGURACIONES,
    icon: 'Settings',
  },
  {
    label: 'Items Extra',
    href: ROUTES.ADMIN_EXTRAS,
    icon: 'Plus',
  },
  {
    label: 'Pedidos',
    href: ROUTES.ADMIN_PEDIDOS,
    icon: 'ShoppingCart',
  },
] as const
