// Staff Types and Interfaces
// TypeScript definitions for Apache Fineract Staff Management

export interface Staff {
  id: number
  firstname: string
  lastname: string
  displayName: string
  officeId: number
  officeName: string
  isLoanOfficer: boolean
  externalId?: string
  mobileNo?: string
  isActive: boolean
  joiningDate?: string
  imageId?: number
  imagePresent?: boolean
}

export interface CreateStaffRequest {
  firstname: string
  lastname: string
  officeId: number
  isLoanOfficer?: boolean
  isActive?: boolean
  joiningDate?: string
  externalId?: string
  mobileNo?: string
  dateFormat?: string
  locale?: string
}

export interface UpdateStaffRequest {
  firstname?: string
  lastname?: string
  isLoanOfficer?: boolean
  isActive?: boolean
  joiningDate?: string
  externalId?: string
  mobileNo?: string
  dateFormat?: string
  locale?: string
}

export interface StaffSearchParams {
  displayName?: string
  officeId?: number
  status?: 'active' | 'inactive' | 'all'
  isLoanOfficer?: boolean
  orderBy?: 'displayName' | 'joiningDate' | 'officeName'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}
