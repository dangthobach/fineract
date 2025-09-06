// Charges API Service
// Manages fees, penalties and other charges

import { apiClient } from './client'
import { 
  Charge, 
  CreateChargeRequest, 
  UpdateChargeRequest,
  ChargeSearchParams 
} from '@/types/charges'
import { PagedResponse, ApiResponse } from '@/types/api'

export class ChargesApi {
  private readonly baseUrl = '/charges'

  /**
   * Retrieve all charges with optional search and pagination
   */
  static async getAllCharges(params?: ChargeSearchParams): Promise<PagedResponse<Charge>> {
    const response = await apiClient.get('/charges', {
      params: {
        orderBy: params?.orderBy || 'name',
        sortOrder: params?.sortOrder || 'ASC',
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific charge by ID
   */
  static async getCharge(chargeId: number): Promise<Charge> {
    const response = await apiClient.get(`/charges/${chargeId}`)
    return response.data
  }

  /**
   * Create a new charge
   */
  static async createCharge(data: CreateChargeRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/charges', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Update an existing charge
   */
  static async updateCharge(chargeId: number, data: UpdateChargeRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/charges/${chargeId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Delete a charge
   */
  static async deleteCharge(chargeId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/charges/${chargeId}`)
    return response.data
  }

  /**
   * Get charge template for creating new charge
   */
  static async getChargeTemplate(): Promise<any> {
    const response = await apiClient.get('/charges/template')
    return response.data
  }

  /**
   * Get active charges only
   */
  static async getActiveCharges(): Promise<Charge[]> {
    const response = await apiClient.get('/charges', {
      params: {
        active: true,
        orderBy: 'name',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Get charges by type (loan, savings, client, etc.)
   */
  static async getChargesByType(chargeAppliesTo: string): Promise<Charge[]> {
    const response = await apiClient.get('/charges', {
      params: {
        chargeAppliesTo,
        active: true,
        orderBy: 'name',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Search charges by name
   */
  static async searchCharges(query: string): Promise<Charge[]> {
    const response = await apiClient.get('/charges', {
      params: {
        name: query,
        orderBy: 'name',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }
}

// Export individual functions for easier use
export const {
  getAllCharges,
  getCharge,
  createCharge,
  updateCharge,
  deleteCharge,
  getChargeTemplate,
  getActiveCharges,
  getChargesByType,
  searchCharges
} = ChargesApi
