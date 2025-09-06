// Office Types and Interfaces
// TypeScript definitions for Apache Fineract Office Management

export interface Office {
  id: number
  name: string
  nameDecorated?: string
  externalId?: string
  hierarchy?: string
  openingDate: string
  parentId?: number
  parentName?: string
  allowedParents?: Office[]
}

export interface CreateOfficeRequest {
  name: string
  parentId?: number
  externalId?: string
  openingDate: string
  dateFormat?: string
  locale?: string
}

export interface UpdateOfficeRequest {
  name?: string
  externalId?: string
  parentId?: number
  openingDate?: string
  dateFormat?: string
  locale?: string
}

export interface OfficeSearchParams {
  orderBy?: 'name' | 'hierarchy' | 'openingDate'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}

export interface OfficeHierarchy extends Office {
  children?: OfficeHierarchy[]
  level: number
}
