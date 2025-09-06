// API Common Types
// Shared types for API responses and requests

/**
 * Standard API Response Interface
 */
export interface ApiResponse {
  resourceId?: number
  officeId?: number
  clientId?: number
  savingsId?: number
  loanId?: number
  resourceIdentifier?: string
  changes?: Record<string, any>
  rollbackTransaction?: boolean
}

/**
 * Paged Response Interface for list endpoints
 */
export interface PagedResponse<T> {
  totalFilteredRecords: number
  pageItems: T[]
}

/**
 * Error Response Interface
 */
export interface ErrorResponse {
  developerMessage: string
  httpStatusCode: string
  defaultUserMessage: string
  userMessageGlobalisationCode: string
  errors?: ValidationError[]
}

/**
 * Validation Error Interface
 */
export interface ValidationError {
  developerMessage: string
  defaultUserMessage: string
  userMessageGlobalisationCode: string
  parameterName: string
  value: any
  args?: any[]
}

/**
 * Sort Order Type
 */
export type SortOrder = 'ASC' | 'DESC'

/**
 * Date Format Type
 */
export type DateFormat = 'dd MMMM yyyy' | 'yyyy-MM-dd'

/**
 * Locale Type
 */
export type Locale = 'en' | 'es' | 'fr' | 'pt' | 'ar'

/**
 * Common Request Parameters
 */
export interface CommonParams {
  dateFormat?: DateFormat
  locale?: Locale
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  offset?: number
  limit?: number
  orderBy?: string
  sortOrder?: SortOrder
}
