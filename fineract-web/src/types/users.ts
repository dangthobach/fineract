// User Management Types and Interfaces
// TypeScript definitions for Apache Fineract User Administration

export interface User {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  officeId: number
  officeName: string
  staffId?: number
  staffDisplayName?: string
  roles: Role[]
  availableRoles?: Role[]
  selectedRoles?: number[]
  sendPasswordToEmail?: boolean
  isSelfServiceUser?: boolean
  enabled?: boolean
  accountNonExpired?: boolean
  accountNonLocked?: boolean
  credentialsNonExpired?: boolean
}

export interface Role {
  id: number
  name: string
  description?: string
  disabled?: boolean
  permissions?: Permission[]
  selectedPermissions?: number[]
}

export interface Permission {
  id: number
  grouping: string
  code: string
  entityName: string
  actionName: string
  selected?: boolean
}

export interface CreateUserRequest {
  username: string
  firstname: string
  lastname: string
  email: string
  officeId: number
  staffId?: number
  roles: number[]
  sendPasswordToEmail?: boolean
  password?: string
  repeatPassword?: string
  isSelfServiceUser?: boolean
  dateFormat?: string
  locale?: string
}

export interface UpdateUserRequest {
  username?: string
  firstname?: string
  lastname?: string
  email?: string
  officeId?: number
  staffId?: number
  roles?: number[]
  password?: string
  repeatPassword?: string
  isSelfServiceUser?: boolean
  dateFormat?: string
  locale?: string
}

export interface UserSearchParams {
  username?: string
  officeId?: number
  staffId?: number
  orderBy?: 'username' | 'firstname' | 'lastname' | 'email'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}

export interface RoleSearchParams {
  name?: string
  orderBy?: 'name' | 'description'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}

export interface PasswordPolicy {
  id: number
  description: string
  active: boolean
  key: string
  value: string
}
