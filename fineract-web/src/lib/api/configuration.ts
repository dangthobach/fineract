// Configuration Management API Service
// Manages system configurations and code values

import { apiClient } from './client'
import { 
  Configuration,
  CodeValue,
  Code,
  UpdateConfigurationRequest,
  CreateCodeRequest,
  CreateCodeValueRequest
} from '@/types/configuration'
import { ApiResponse } from '@/types/api'

export class ConfigurationsApi {
  private readonly baseUrl = '/configurations'

  /**
   * Retrieve all system configurations
   */
  static async getAllConfigurations(): Promise<Configuration[]> {
    const response = await apiClient.get('/configurations')
    return response.data
  }

  /**
   * Update a system configuration
   */
  static async updateConfiguration(configId: number, data: UpdateConfigurationRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/configurations/${configId}`, data)
    return response.data
  }

  /**
   * Update multiple configurations
   */
  static async updateConfigurations(configurations: UpdateConfigurationRequest[]): Promise<ApiResponse> {
    const response = await apiClient.put('/configurations', {
      globalConfiguration: configurations
    })
    return response.data
  }
}

export class CodesApi {
  private readonly baseUrl = '/codes'

  /**
   * Retrieve all codes
   */
  static async getAllCodes(): Promise<Code[]> {
    const response = await apiClient.get('/codes')
    return response.data
  }

  /**
   * Retrieve a specific code by ID
   */
  static async getCode(codeId: number): Promise<Code> {
    const response = await apiClient.get(`/codes/${codeId}`)
    return response.data
  }

  /**
   * Create a new code
   */
  static async createCode(data: CreateCodeRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/codes', data)
    return response.data
  }

  /**
   * Update an existing code
   */
  static async updateCode(codeId: number, data: Partial<CreateCodeRequest>): Promise<ApiResponse> {
    const response = await apiClient.put(`/codes/${codeId}`, data)
    return response.data
  }

  /**
   * Delete a code
   */
  static async deleteCode(codeId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/codes/${codeId}`)
    return response.data
  }
}

export class CodeValuesApi {
  private readonly baseUrl = '/codes'

  /**
   * Retrieve all code values for a code
   */
  static async getCodeValues(codeId: number): Promise<CodeValue[]> {
    const response = await apiClient.get(`/codes/${codeId}/codevalues`)
    return response.data
  }

  /**
   * Retrieve a specific code value
   */
  static async getCodeValue(codeId: number, codeValueId: number): Promise<CodeValue> {
    const response = await apiClient.get(`/codes/${codeId}/codevalues/${codeValueId}`)
    return response.data
  }

  /**
   * Create a new code value
   */
  static async createCodeValue(codeId: number, data: CreateCodeValueRequest): Promise<ApiResponse> {
    const response = await apiClient.post(`/codes/${codeId}/codevalues`, data)
    return response.data
  }

  /**
   * Update an existing code value
   */
  static async updateCodeValue(codeId: number, codeValueId: number, data: Partial<CreateCodeValueRequest>): Promise<ApiResponse> {
    const response = await apiClient.put(`/codes/${codeId}/codevalues/${codeValueId}`, data)
    return response.data
  }

  /**
   * Delete a code value
   */
  static async deleteCodeValue(codeId: number, codeValueId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/codes/${codeId}/codevalues/${codeValueId}`)
    return response.data
  }
}

// Export individual functions for easier use
export const {
  getAllConfigurations,
  updateConfiguration,
  updateConfigurations
} = ConfigurationsApi

export const {
  getAllCodes,
  getCode,
  createCode,
  updateCode,
  deleteCode
} = CodesApi

export const {
  getCodeValues,
  getCodeValue,
  createCodeValue,
  updateCodeValue,
  deleteCodeValue
} = CodeValuesApi
