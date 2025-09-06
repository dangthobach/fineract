// Loan Products API Service
// Manages loan product definitions and configurations

import { apiClient } from './client'
import { 
  LoanProduct, 
  CreateLoanProductRequest, 
  UpdateLoanProductRequest,
  LoanProductSearchParams 
} from '@/types/loan-products'
import { PagedResponse, ApiResponse } from '@/types/api'

export class LoanProductsApi {
  private readonly baseUrl = '/loanproducts'

  /**
   * Retrieve all loan products with optional search and pagination
   */
  static async getAllLoanProducts(params?: LoanProductSearchParams): Promise<PagedResponse<LoanProduct>> {
    const response = await apiClient.get('/loanproducts', {
      params: {
        orderBy: params?.orderBy || 'name',
        sortOrder: params?.sortOrder || 'ASC',
        ...params
      }
    })
    return response.data
  }

  /**
   * Retrieve a specific loan product by ID
   */
  static async getLoanProduct(productId: number): Promise<LoanProduct> {
    const response = await apiClient.get(`/loanproducts/${productId}`)
    return response.data
  }

  /**
   * Create a new loan product
   */
  static async createLoanProduct(data: CreateLoanProductRequest): Promise<ApiResponse> {
    const response = await apiClient.post('/loanproducts', {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Update an existing loan product
   */
  static async updateLoanProduct(productId: number, data: UpdateLoanProductRequest): Promise<ApiResponse> {
    const response = await apiClient.put(`/loanproducts/${productId}`, {
      ...data,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
    return response.data
  }

  /**
   * Delete a loan product
   */
  static async deleteLoanProduct(productId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(`/loanproducts/${productId}`)
    return response.data
  }

  /**
   * Get loan product template for creating new product
   */
  static async getLoanProductTemplate(): Promise<any> {
    const response = await apiClient.get('/loanproducts/template')
    return response.data
  }

  /**
   * Get active loan products only
   */
  static async getActiveLoanProducts(): Promise<LoanProduct[]> {
    const response = await apiClient.get('/loanproducts', {
      params: {
        isActive: true,
        orderBy: 'name',
        sortOrder: 'ASC'
      }
    })
    return response.data
  }

  /**
   * Search loan products by name
   */
  static async searchLoanProducts(query: string): Promise<LoanProduct[]> {
    const response = await apiClient.get('/loanproducts', {
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
  getAllLoanProducts,
  getLoanProduct,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
  getLoanProductTemplate,
  getActiveLoanProducts,
  searchLoanProducts
} = LoanProductsApi
