// Savings Account API Service
// Comprehensive API service for Apache Fineract Savings functionality

import { api } from '@/lib/api'
import {
  SavingsAccount,
  SavingsProduct,
  SavingsAccountTransaction,
  SavingsAccountCharge,
  SavingsAccountTemplate,
  SavingsAccountSearchParams,
  CreateSavingsAccountRequest,
  UpdateSavingsAccountRequest,
  ActivateSavingsAccountRequest,
  CloseSavingsAccountRequest,
  SavingsAccountTransactionRequest,
  HoldAmountRequest,
  BlockUnblockAccountRequest,
  SavingsAccountStatistics,
  ProductPerformance
} from '@/types/savings'
import { PagedResponse, ApiResponse } from '@/types/api'

/**
 * Savings Accounts API Service
 */
export class SavingsAccountsApi {
  private readonly baseUrl = '/savingsaccounts'

  /**
   * Retrieve all savings accounts with optional filtering and pagination
   */
  async getSavingsAccounts(params?: SavingsAccountSearchParams): Promise<PagedResponse<SavingsAccount>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const url = queryParams.toString() 
      ? `${this.baseUrl}?${queryParams.toString()}`
      : this.baseUrl

    return api.get<PagedResponse<SavingsAccount>>(url)
  }

  /**
   * Retrieve a specific savings account by ID
   */
  async getSavingsAccount(accountId: number, associations?: string[]): Promise<SavingsAccount> {
    const queryParams = new URLSearchParams()
    
    if (associations && associations.length > 0) {
      queryParams.append('associations', associations.join(','))
    }

    const url = queryParams.toString()
      ? `${this.baseUrl}/${accountId}?${queryParams.toString()}`
      : `${this.baseUrl}/${accountId}`

    return api.get<SavingsAccount>(url)
  }

  /**
   * Create a new savings account
   */
  async createSavingsAccount(request: CreateSavingsAccountRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(this.baseUrl, request)
  }

  /**
   * Update an existing savings account
   */
  async updateSavingsAccount(accountId: number, request: UpdateSavingsAccountRequest): Promise<ApiResponse> {
    return api.put<ApiResponse>(`${this.baseUrl}/${accountId}`, request)
  }

  /**
   * Delete a savings account (only if not activated)
   */
  async deleteSavingsAccount(accountId: number): Promise<ApiResponse> {
    return api.delete<ApiResponse>(`${this.baseUrl}/${accountId}`)
  }

  /**
   * Approve a savings account
   */
  async approveSavingsAccount(accountId: number, approvedOnDate: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=approve`, {
      approvedOnDate,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Reject a savings account
   */
  async rejectSavingsAccount(accountId: number, rejectedOnDate: string, note?: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=reject`, {
      rejectedOnDate,
      note,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Activate a savings account
   */
  async activateSavingsAccount(accountId: number, request: ActivateSavingsAccountRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=activate`, request)
  }

  /**
   * Close a savings account
   */
  async closeSavingsAccount(accountId: number, request: CloseSavingsAccountRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=close`, request)
  }

  /**
   * Calculate interest for savings account
   */
  async calculateInterest(accountId: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=calculateInterest`)
  }

  /**
   * Post interest for savings account
   */
  async postInterest(accountId: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=postInterest`)
  }

  /**
   * Block a savings account
   */
  async blockSavingsAccount(accountId: number, request: BlockUnblockAccountRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=block`, request)
  }

  /**
   * Unblock a savings account
   */
  async unblockSavingsAccount(accountId: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=unblock`)
  }

  /**
   * Hold amount in savings account
   */
  async holdAmount(accountId: number, request: HoldAmountRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=holdAmount`, request)
  }

  /**
   * Release held amount in savings account
   */
  async releaseAmount(accountId: number, transactionId: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}?command=releaseAmount`, {
      transactionId
    })
  }

  /**
   * Get savings account template for new account creation
   */
  async getSavingsAccountTemplate(clientId?: number, productId?: number): Promise<SavingsAccountTemplate> {
    const queryParams = new URLSearchParams({ template: 'true' })
    
    if (clientId) queryParams.append('clientId', clientId.toString())
    if (productId) queryParams.append('productId', productId.toString())

    return api.get<SavingsAccountTemplate>(`${this.baseUrl}/template?${queryParams.toString()}`)
  }

  /**
   * Get savings account transactions
   */
  async getSavingsAccountTransactions(
    accountId: number, 
    offset?: number, 
    limit?: number,
    orderBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<PagedResponse<SavingsAccountTransaction>> {
    const queryParams = new URLSearchParams()
    
    if (offset !== undefined) queryParams.append('offset', offset.toString())
    if (limit !== undefined) queryParams.append('limit', limit.toString())
    if (orderBy) queryParams.append('orderBy', orderBy)
    if (sortOrder) queryParams.append('sortOrder', sortOrder)

    const url = queryParams.toString()
      ? `${this.baseUrl}/${accountId}/transactions?${queryParams.toString()}`
      : `${this.baseUrl}/${accountId}/transactions`

    return api.get<PagedResponse<SavingsAccountTransaction>>(url)
  }

  /**
   * Get specific transaction
   */
  async getSavingsAccountTransaction(accountId: number, transactionId: number): Promise<SavingsAccountTransaction> {
    return api.get<SavingsAccountTransaction>(`${this.baseUrl}/${accountId}/transactions/${transactionId}`)
  }

  /**
   * Make a deposit to savings account
   */
  async makeDeposit(accountId: number, request: SavingsAccountTransactionRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/transactions?command=deposit`, request)
  }

  /**
   * Make a withdrawal from savings account
   */
  async makeWithdrawal(accountId: number, request: SavingsAccountTransactionRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/transactions?command=withdrawal`, request)
  }

  /**
   * Reverse a transaction
   */
  async reverseTransaction(accountId: number, transactionId: number, note?: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/transactions/${transactionId}?command=undo`, {
      note,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Get savings account charges
   */
  async getSavingsAccountCharges(accountId: number): Promise<SavingsAccountCharge[]> {
    return api.get<SavingsAccountCharge[]>(`${this.baseUrl}/${accountId}/charges`)
  }

  /**
   * Get specific charge
   */
  async getSavingsAccountCharge(accountId: number, chargeId: number): Promise<SavingsAccountCharge> {
    return api.get<SavingsAccountCharge>(`${this.baseUrl}/${accountId}/charges/${chargeId}`)
  }

  /**
   * Add charge to savings account
   */
  async addCharge(accountId: number, chargeId: number, amount?: number, dueDate?: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/charges`, {
      chargeId,
      amount,
      dueDate,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Update savings account charge
   */
  async updateCharge(accountId: number, chargeId: number, amount?: number, dueDate?: string): Promise<ApiResponse> {
    return api.put<ApiResponse>(`${this.baseUrl}/${accountId}/charges/${chargeId}`, {
      amount,
      dueDate,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Pay charge
   */
  async payCharge(accountId: number, chargeId: number, transactionDate: string, amount: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/charges/${chargeId}?command=paycharge`, {
      transactionDate,
      amount,
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    })
  }

  /**
   * Waive charge
   */
  async waiveCharge(accountId: number, chargeId: number): Promise<ApiResponse> {
    return api.post<ApiResponse>(`${this.baseUrl}/${accountId}/charges/${chargeId}?command=waive`)
  }

  /**
   * Delete charge
   */
  async deleteCharge(accountId: number, chargeId: number): Promise<ApiResponse> {
    return api.delete<ApiResponse>(`${this.baseUrl}/${accountId}/charges/${chargeId}`)
  }

  /**
   * Get savings account statistics
   */
  async getSavingsAccountStatistics(officeId?: number): Promise<SavingsAccountStatistics> {
    const queryParams = new URLSearchParams()
    if (officeId) queryParams.append('officeId', officeId.toString())

    const url = queryParams.toString()
      ? `${this.baseUrl}/statistics?${queryParams.toString()}`
      : `${this.baseUrl}/statistics`

    return api.get<SavingsAccountStatistics>(url)
  }

  /**
   * Get account balance history
   */
  async getBalanceHistory(accountId: number, fromDate?: string, toDate?: string): Promise<any[]> {
    const queryParams = new URLSearchParams()
    if (fromDate) queryParams.append('fromDate', fromDate)
    if (toDate) queryParams.append('toDate', toDate)

    const url = queryParams.toString()
      ? `${this.baseUrl}/${accountId}/balance-history?${queryParams.toString()}`
      : `${this.baseUrl}/${accountId}/balance-history`

    return api.get<any[]>(url)
  }

  /**
   * Export savings accounts to CSV
   */
  async exportSavingsAccounts(params?: SavingsAccountSearchParams): Promise<Blob> {
    const queryParams = new URLSearchParams()
    queryParams.append('exportCSV', 'true')
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`/api${this.baseUrl}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to export savings accounts')
    }

    return response.blob()
  }
}

/**
 * Savings Products API Service
 */
export class SavingsProductsApi {
  private readonly baseUrl = '/savingsproducts'

  /**
   * Retrieve all savings products
   */
  async getSavingsProducts(): Promise<SavingsProduct[]> {
    return api.get<SavingsProduct[]>(this.baseUrl)
  }

  /**
   * Retrieve a specific savings product by ID
   */
  async getSavingsProduct(productId: number): Promise<SavingsProduct> {
    return api.get<SavingsProduct>(`${this.baseUrl}/${productId}`)
  }

  /**
   * Create a new savings product
   */
  async createSavingsProduct(product: Partial<SavingsProduct>): Promise<ApiResponse> {
    return api.post<ApiResponse>(this.baseUrl, product)
  }

  /**
   * Update an existing savings product
   */
  async updateSavingsProduct(productId: number, product: Partial<SavingsProduct>): Promise<ApiResponse> {
    return api.put<ApiResponse>(`${this.baseUrl}/${productId}`, product)
  }

  /**
   * Delete a savings product
   */
  async deleteSavingsProduct(productId: number): Promise<ApiResponse> {
    return api.delete<ApiResponse>(`${this.baseUrl}/${productId}`)
  }

  /**
   * Get savings product template
   */
  async getSavingsProductTemplate(): Promise<any> {
    return api.get<any>(`${this.baseUrl}/template`)
  }

  /**
   * Get product performance metrics
   */
  async getProductPerformance(productId?: number): Promise<ProductPerformance[]> {
    const queryParams = new URLSearchParams()
    if (productId) queryParams.append('productId', productId.toString())

    const url = queryParams.toString()
      ? `${this.baseUrl}/performance?${queryParams.toString()}`
      : `${this.baseUrl}/performance`

    return api.get<ProductPerformance[]>(url)
  }
}

// Create singleton instances
export const savingsAccountsApi = new SavingsAccountsApi()
export const savingsProductsApi = new SavingsProductsApi()
