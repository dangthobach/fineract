// Staff API Service
// Manages staff/employee information and assignments

import { apiClient } from './client'
import { 
  Staff, 
  CreateStaffRequest, 
  UpdateStaffRequest,
  StaffSearchParams 
} from '@/types/staff'
import { PagedResponse, ApiResponse } from '@/types/api'

export class StaffApi {
  private readonly baseUrl = '/staff'

  /**
   * Retrieve all staff with optional search and pagination
   */
  static async getAllStaff(params?: StaffSearchParams): Promise<PagedResponse<Staff>> {
    const response = await apiClient.get('/staff', {
      params: {
        orderBy: params?.orderBy || 'displayName',
        sortOrder: params?.sortOrder || 'ASC',
        status: params?.status || 'active',
        officeId: params?.officeId,
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific staff member by ID
   */
  static async getStaff(staffId: number): Promise<Staff> {
    const response = await apiClient.get(`/staff/${staffId}`)
    return response.data
  }

  /**
   * Create a new staff member
   */
  static async createStaff(data: CreateStaffRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/staff', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Update an existing staff member
   */
  static async updateStaff(staffId: number, data: UpdateStaffRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/staff/${staffId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Get staff template for creating new staff
   */
  static async getStaffTemplate(): Promise<any> {
    const response = await apiClient.get('/staff/template')
    return response.data
  }

  /**
   * Get staff by office
   */
  static async getStaffByOffice(officeId: number): Promise<Staff[]> {
    const response = await apiClient.get('/staff', {
      params: {
        officeId,
        status: 'active',
        orderBy: 'displayName',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Search staff by name
   */
  static async searchStaff(query: string, officeId?: number): Promise<Staff[]> {
    const response = await apiClient.get('/staff', {
      params: {
        displayName: query,
        officeId,
        status: 'active',
        orderBy: 'displayName',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Upload staff image
   */
  static async uploadStaffImage(staffId: number, file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post(`/staff/${staffId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  /**
   * Get staff image
   */
  static async getStaffImage(staffId: number): Promise<Blob> {
    const response = await apiClient.get(`/staff/${staffId}/images`, {
      responseType: 'blob'
    })
    return response.data
  }
}

// Export individual functions for easier use
export const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  getStaffTemplate,
  getStaffByOffice,
  searchStaff,
  uploadStaffImage,
  getStaffImage
} = StaffApi
