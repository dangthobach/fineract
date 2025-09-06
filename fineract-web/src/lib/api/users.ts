// User Management API Service
// Manages system users, roles and permissions

import { apiClient } from './client'
import { 
  User, 
  Role,
  Permission,
  CreateUserRequest, 
  UpdateUserRequest,
  UserSearchParams,
  RoleSearchParams
} from '@/types/users'
import { PagedResponse, ApiResponse } from '@/types/api'

export class UsersApi {
  private readonly baseUrl = '/users'

  /**
   * Retrieve all users with optional search and pagination
   */
  static async getAllUsers(params?: UserSearchParams): Promise<PagedResponse<User>> {
    const response = await apiClient.get('/users', {
      params: {
        orderBy: params?.orderBy || 'username',
        sortOrder: params?.sortOrder || 'ASC',
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific user by ID
   */
  static async getUser(userId: number): Promise<User> {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/users', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Update an existing user
   */
  static async updateUser(userId: number, data: UpdateUserRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/users/${userId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Delete a user
   */
  static async deleteUser(userId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/users/${userId}`)
    return response.data
  }

  /**
   * Get user template for creating new user
   */
  static async getUserTemplate(): Promise<any> {
    const response = await apiClient.get('/users/template')
    return response.data
  }

  /**
   * Change user password
   */
  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await apiClient.put(`/users/${userId}?command=password`, {
      password: currentPassword,
      repeatPassword: newPassword
    })
    return response.data
  }
}

export class RolesApi {
  private readonly baseUrl = '/roles'

  /**
   * Retrieve all roles with optional search and pagination
   */
  static async getAllRoles(params?: RoleSearchParams): Promise<PagedResponse<Role>> {
    const response = await apiClient.get('/roles', {
      params: {
        orderBy: params?.orderBy || 'name',
        sortOrder: params?.sortOrder || 'ASC',
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific role by ID
   */
  static async getRole(roleId: number): Promise<Role> {
    const response = await apiClient.get(`/roles/${roleId}`)
    return response.data
  }

  /**
   * Create a new role
   */
  static async createRole(data: { name: string; description?: string }): Promise<ApiResponse> {
    const response = await apiClient.post('/roles', data)
    return response.data
  }

  /**
   * Update an existing role
   */
  static async updateRole(roleId: number, data: { name?: string; description?: string }): Promise<ApiResponse> {
    const response = await apiClient.put(`/roles/${roleId}`, data)
    return response.data
  }

  /**
   * Delete a role
   */
  static async deleteRole(roleId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/roles/${roleId}`)
    return response.data
  }

  /**
   * Update role permissions
   */
  static async updateRolePermissions(roleId: number, permissions: number[]): Promise<ApiResponse> {
    const response = await apiClient.put(`/roles/${roleId}/permissions`, {
      permissions
    })
    return response.data
  }
}

export class PermissionsApi {
  private readonly baseUrl = '/permissions'

  /**
   * Retrieve all permissions
   */
  static async getAllPermissions(): Promise<Permission[]> {
    const response = await apiClient.get('/permissions')
    return response.data
  }

  /**
   * Update user permissions
   */
  static async updateUserPermissions(userId: number, permissions: number[]): Promise<ApiResponse> {
    const response = await apiClient.put(`/users/${userId}/permissions`, {
      permissions
    })
    return response.data
  }
}

// Export individual functions for easier use
export const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserTemplate,
  changePassword
} = UsersApi

export const {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  updateRolePermissions
} = RolesApi

export const {
  getAllPermissions,
  updateUserPermissions
} = PermissionsApi
