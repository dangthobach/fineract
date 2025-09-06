// Offices API Service
// Manages organizational structure and office hierarchy

import { apiClient } from './client'
import { 
  Office, 
  CreateOfficeRequest, 
  UpdateOfficeRequest,
  OfficeSearchParams 
} from '@/types/offices'
import { PagedResponse, ApiResponse } from '@/types/api'

export class OfficesApi {
  private readonly baseUrl = '/offices'

  /**
   * Retrieve all offices with optional search and pagination
   */
  static async getAllOffices(params?: OfficeSearchParams): Promise<PagedResponse<Office>> {
    const response = await apiClient.get('/offices', {
      params: {
        orderBy: params?.orderBy || 'name',
        sortOrder: params?.sortOrder || 'ASC',
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific office by ID
   */
  static async getOffice(officeId: number): Promise<Office> {
    const response = await apiClient.get(`/offices/${officeId}`)
    return response.data
  }

  /**
   * Create a new office
   */
  static async createOffice(data: CreateOfficeRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/offices', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Update an existing office
   */
  static async updateOffice(officeId: number, data: UpdateOfficeRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/offices/${officeId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Get office template for creating new office
   */
  static async getOfficeTemplate(): Promise<any> {
    const response = await apiClient.get('/offices/template')
    return response.data
  }

  /**
   * Get all offices in hierarchy
   */
  static async getOfficesInHierarchy(): Promise<Office[]> {
    const response = await apiClient.get('/offices', {
      params: {
        orderBy: 'hierarchy',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Get subordinate offices
   */
  static async getSubordinateOffices(officeId: number): Promise<Office[]> {
    const response = await apiClient.get(`/offices/${officeId}/children`)
    return response.data
  }
}

// Export individual functions for easier use
export const {
  getAllOffices,
  getOffice,
  createOffice,
  updateOffice,
  getOfficeTemplate,
  getOfficesInHierarchy,
  getSubordinateOffices
} = OfficesApi
