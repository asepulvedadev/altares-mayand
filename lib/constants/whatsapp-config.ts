/**
 * WhatsApp integration configuration
 */

export const WHATSAPP_CONFIG = {
  // Business phone number (from environment variable)
  businessNumber: process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER || '',

  // Message templates
  greeting: '¡Hola! Me gustaría hacer un pedido de altares:',

  // Message formatting
  emojis: {
    title: '🎨',
    customer: '👤',
    details: '📦',
    pricing: '💰',
    notes: '📝',
    dimensions: '📏',
    paint: '🎨',
    extras: '➕',
    quantity: '🔢',
  },

  // URL builders
  getWebUrl: (phone: string, message: string): string => {
    const encodedMessage = encodeURIComponent(message)
    return `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`
  },

  getMobileUrl: (phone: string, message: string): string => {
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phone}?text=${encodedMessage}`
  },

  getUrl: (message: string): string => {
    const phone = WHATSAPP_CONFIG.businessNumber.replace(/[^0-9]/g, '')
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : ''
    )

    return isMobile
      ? WHATSAPP_CONFIG.getMobileUrl(phone, message)
      : WHATSAPP_CONFIG.getWebUrl(phone, message)
  },
} as const

// Helper to detect if user is on mobile
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
