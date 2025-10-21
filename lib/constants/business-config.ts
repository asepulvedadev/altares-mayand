/**
 * Business configuration constants
 */

export const BUSINESS_CONFIG = {
  // Business information
  name: 'Mayand Altares',
  tagline: 'Altares de Día de Muertos en MDF',
  description: 'Altares personalizados de Día de Muertos hechos en MDF cortado con láser CNC',

  // Contact information
  email: 'contacto@mayand-altares.com',
  phone: process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '',

  // Social media (add your actual links)
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '',
  },

  // Business hours
  hours: {
    weekdays: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Cerrado',
  },

  // Shipping/delivery info
  deliveryInfo: {
    message: 'Entregamos en toda la República Mexicana',
    estimatedDays: '3-5 días hábiles',
  },

  // Currency
  currency: {
    code: 'MXN',
    symbol: '$',
    locale: 'es-MX',
  },

  // Discount rules
  discounts: {
    bulkOrder: {
      minQuantity: 5,
      percentage: 10, // 10% discount for 5+ altars
      message: '10% de descuento en pedidos de 5 o más altares',
    },
  },
} as const

// Model types with display names
export const MODEL_TYPES = {
  seres_queridos: {
    value: 'seres_queridos',
    label: 'Seres Queridos',
    description: 'Altares para recordar a tus seres queridos',
    icon: '🕊️',
  },
  bebes_no_nacidos: {
    value: 'bebes_no_nacidos',
    label: 'Bebés',
    description: 'Altares especiales para bebés no nacidos o prematuros',
    icon: '👼',
  },
  mascotas: {
    value: 'mascotas',
    label: 'Mascotas',
    description: 'Altares para recordar a tus mascotas',
    icon: '🐾',
  },
} as const

// Default included items per altar
export const DEFAULT_INCLUDED_ITEMS = {
  panes: 2,
  vasos: 1,
  calaveras: 1,
  portaretratos: 1,
} as const
