// Configuration Types and Interfaces
// TypeScript definitions for Apache Fineract System Configuration

export interface Configuration {
  id: number
  name: string
  enabled: boolean
  value?: number
  stringValue?: string
  dateValue?: string
  description?: string
  isTrapdoorEnabled?: boolean
}

export interface UpdateConfigurationRequest {
  name?: string
  enabled?: boolean
  value?: number
  stringValue?: string
  dateValue?: string
  dateFormat?: string
  locale?: string
}

export interface Code {
  id: number
  name: string
  systemDefined: boolean
  codeValues?: CodeValue[]
}

export interface CodeValue {
  id: number
  name: string
  description?: string
  position?: number
  isActive: boolean
  isSystemDefined?: boolean
}

export interface CreateCodeRequest {
  name: string
  systemDefined?: boolean
}

export interface CreateCodeValueRequest {
  name: string
  description?: string
  position?: number
  isActive?: boolean
}
