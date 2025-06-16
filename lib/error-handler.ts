import * as Sentry from "@sentry/nextjs"

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: unknown) => {
  console.error("Error:", error)

  if (error instanceof AppError) {
    Sentry.captureException(error)
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  Sentry.captureException(error)
  return {
    message: "Error interno del servidor",
    statusCode: 500,
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
