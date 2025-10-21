/**
 * Error handling utilities
 */

export type AppError = {
  message: string
  code?: string
  statusCode?: number
  details?: unknown
}

/**
 * Parse error from unknown type
 * @param error - Error of unknown type
 * @returns Formatted error object
 */
export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
      statusCode: 500,
      details: error,
    }
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'ERROR',
      statusCode: 500,
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: String(error.message),
      code: 'code' in error ? String(error.code) : 'ERROR',
      statusCode: 'statusCode' in error ? Number(error.statusCode) : 500,
      details: error,
    }
  }

  return {
    message: 'Un error desconocido ocurrió',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    details: error,
  }
}

/**
 * Create a user-friendly error message
 * @param error - Error to format
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const parsed = parseError(error)

  // Map common error codes to user-friendly messages in Spanish
  const messageMap: Record<string, string> = {
    PGRST301: 'No se encontró el recurso solicitado',
    '23505': 'Este registro ya existe',
    '23503': 'No se puede eliminar porque está en uso',
    '23502': 'Faltan campos requeridos',
    '42501': 'No tienes permisos para realizar esta acción',
    NETWORK_ERROR: 'Error de conexión. Por favor verifica tu internet',
    TIMEOUT: 'La operación tardó demasiado. Por favor intenta de nuevo',
  }

  if (parsed.code && messageMap[parsed.code]) {
    return messageMap[parsed.code]
  }

  return parsed.message || 'Ocurrió un error inesperado'
}

/**
 * Log error (can be extended to send to error tracking service)
 * @param error - Error to log
 * @param context - Additional context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const parsed = parseError(error)

  console.error('[Error]', {
    ...parsed,
    context,
    timestamp: new Date().toISOString(),
  })

  // TODO: Send to error tracking service (Sentry, etc.)
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   Sentry.captureException(error, { extra: context })
  // }
}

/**
 * Create error response for API routes
 * @param error - Error to format
 * @param statusCode - HTTP status code
 * @returns Response object
 */
export function createErrorResponse(error: unknown, statusCode?: number): Response {
  const parsed = parseError(error)
  const status = statusCode || parsed.statusCode || 500

  return new Response(
    JSON.stringify({
      error: {
        message: getUserFriendlyMessage(error),
        code: parsed.code,
      },
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
