import { 
  Loan, 
  LoanSearchParams, 
  CreateLoanApplicationRequest, 
  UpdateLoanApplicationRequest,
  LoanApprovalRequest,
  LoanDisbursementRequest,
  LoanRepaymentRequest,
  LoanApplicationTemplate,
  LoanStats,
  LoanProduct,
  LoanTransaction,
  LoanSchedule,
  LoanCharge
} from '@/types/loans';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8443/fineract-provider/api/v1';

class LoansApi {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Fineract-Platform-TenantId': process.env.NEXT_PUBLIC_TENANT_ID || 'default',
      'Authorization': 'Basic ' + btoa((process.env.NEXT_PUBLIC_API_USER || 'mifos') + ':' + (process.env.NEXT_PUBLIC_API_PASSWORD || 'password'))
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all loans with optional filtering
  async getLoans(params: LoanSearchParams = {}): Promise<{
    totalFilteredRecords: number;
    pageItems: Loan[];
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/loans${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  // Get loan by ID with detailed information
  async getLoanById(loanId: number, associations?: string[]): Promise<Loan> {
    let endpoint = `/loans/${loanId}`;
    
    if (associations && associations.length > 0) {
      const associationParams = associations.join(',');
      endpoint += `?associations=${associationParams}`;
    }
    
    return this.makeRequest(endpoint);
  }

  // Get loan application template
  async getLoanApplicationTemplate(clientId?: number, productId?: number): Promise<LoanApplicationTemplate> {
    let endpoint = '/loans/template';
    const params: string[] = [];
    
    if (clientId) params.push(`clientId=${clientId}`);
    if (productId) params.push(`productId=${productId}`);
    
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    
    return this.makeRequest(endpoint);
  }

  // Create new loan application
  async createLoanApplication(loanData: CreateLoanApplicationRequest): Promise<{ 
    loanId: number; 
    resourceId: number; 
  }> {
    return this.makeRequest('/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  }

  // Update loan application
  async updateLoanApplication(
    loanId: number, 
    loanData: UpdateLoanApplicationRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}`, {
      method: 'PUT',
      body: JSON.stringify(loanData),
    });
  }

  // Delete loan application
  async deleteLoanApplication(loanId: number): Promise<{ 
    loanId: number; 
    resourceId: number; 
  }> {
    return this.makeRequest(`/loans/${loanId}`, {
      method: 'DELETE',
    });
  }

  // Approve loan
  async approveLoan(
    loanId: number, 
    approvalData: LoanApprovalRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=approve`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  }

  // Reject loan
  async rejectLoan(
    loanId: number, 
    rejectionData: { rejectedOnDate: string; locale: string; dateFormat: string; note?: string; }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=reject`, {
      method: 'POST',
      body: JSON.stringify(rejectionData),
    });
  }

  // Withdraw loan application
  async withdrawLoan(
    loanId: number, 
    withdrawalData: { withdrawnOnDate: string; locale: string; dateFormat: string; note?: string; }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=withdrawnByApplicant`, {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  // Undo loan approval
  async undoLoanApproval(
    loanId: number, 
    undoData: { note?: string; }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=undoApproval`, {
      method: 'POST',
      body: JSON.stringify(undoData),
    });
  }

  // Disburse loan
  async disburseLoan(
    loanId: number, 
    disbursementData: LoanDisbursementRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=disburse`, {
      method: 'POST',
      body: JSON.stringify(disbursementData),
    });
  }

  // Disburse loan to savings account
  async disburseToSavings(
    loanId: number, 
    disbursementData: LoanDisbursementRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=disburseToSavings`, {
      method: 'POST',
      body: JSON.stringify(disbursementData),
    });
  }

  // Undo loan disbursement
  async undoLoanDisbursement(
    loanId: number, 
    undoData: { note?: string; }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=undoDisbursal`, {
      method: 'POST',
      body: JSON.stringify(undoData),
    });
  }

  // Make loan repayment
  async makeRepayment(
    loanId: number, 
    repaymentData: LoanRepaymentRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=repayment`, {
      method: 'POST',
      body: JSON.stringify(repaymentData),
    });
  }

  // Adjust loan transaction
  async adjustTransaction(
    loanId: number, 
    transactionId: number, 
    adjustmentData: LoanRepaymentRequest
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}/transactions/${transactionId}?command=adjust`, {
      method: 'POST',
      body: JSON.stringify(adjustmentData),
    });
  }

  // Waive loan interest
  async waiveInterest(
    loanId: number, 
    waiveData: { 
      transactionDate: string; 
      transactionAmount: number; 
      locale: string; 
      dateFormat: string; 
      note?: string; 
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=waiveinterest`, {
      method: 'POST',
      body: JSON.stringify(waiveData),
    });
  }

  // Write off loan
  async writeOffLoan(
    loanId: number, 
    writeOffData: { 
      transactionDate: string; 
      locale: string; 
      dateFormat: string; 
      note?: string; 
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=writeoff`, {
      method: 'POST',
      body: JSON.stringify(writeOffData),
    });
  }

  // Close loan (as rescheduled)
  async closeLoanAsRescheduled(
    loanId: number, 
    closeData: { 
      transactionDate: string; 
      locale: string; 
      dateFormat: string; 
      note?: string; 
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=close-rescheduled`, {
      method: 'POST',
      body: JSON.stringify(closeData),
    });
  }

  // Close loan
  async closeLoan(
    loanId: number, 
    closeData: { 
      transactionDate: string; 
      locale: string; 
      dateFormat: string; 
      note?: string; 
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}?command=close`, {
      method: 'POST',
      body: JSON.stringify(closeData),
    });
  }

  // Get loan repayment schedule
  async getRepaymentSchedule(loanId: number): Promise<LoanSchedule> {
    return this.makeRequest(`/loans/${loanId}?associations=repaymentSchedule`);
  }

  // Get loan transactions
  async getLoanTransactions(loanId: number): Promise<LoanTransaction[]> {
    const loan = await this.makeRequest<Loan>(`/loans/${loanId}?associations=transactions`);
    return loan.transactions || [];
  }

  // Get loan charges
  async getLoanCharges(loanId: number): Promise<LoanCharge[]> {
    return this.makeRequest(`/loans/${loanId}/charges`);
  }

  // Add loan charge
  async addLoanCharge(
    loanId: number, 
    chargeData: {
      chargeId: number;
      amount: number;
      dueDate?: string;
      locale: string;
      dateFormat?: string;
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
  }> {
    return this.makeRequest(`/loans/${loanId}/charges`, {
      method: 'POST',
      body: JSON.stringify(chargeData),
    });
  }

  // Update loan charge
  async updateLoanCharge(
    loanId: number, 
    chargeId: number, 
    chargeData: {
      amount: number;
      dueDate?: string;
      locale: string;
      dateFormat?: string;
    }
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}/charges/${chargeId}`, {
      method: 'PUT',
      body: JSON.stringify(chargeData),
    });
  }

  // Waive loan charge
  async waiveLoanCharge(
    loanId: number, 
    chargeId: number
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
    changes: Record<string, any>; 
  }> {
    return this.makeRequest(`/loans/${loanId}/charges/${chargeId}?command=waive`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  // Delete loan charge
  async deleteLoanCharge(
    loanId: number, 
    chargeId: number
  ): Promise<{ 
    loanId: number; 
    resourceId: number; 
  }> {
    return this.makeRequest(`/loans/${loanId}/charges/${chargeId}`, {
      method: 'DELETE',
    });
  }

  // Get loan products
  async getLoanProducts(): Promise<LoanProduct[]> {
    return this.makeRequest('/loanproducts');
  }

  // Get loan product by ID
  async getLoanProductById(productId: number): Promise<LoanProduct> {
    return this.makeRequest(`/loanproducts/${productId}`);
  }

  // Get loan statistics
  async getLoanStats(officeId?: number): Promise<LoanStats> {
    const params = new URLSearchParams();
    if (officeId) params.append('officeId', officeId.toString());
    
    const endpoint = `/loans/statistics${params.toString() ? `?${params.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  // Search loans by account number
  async searchLoansByAccountNumber(accountNo: string): Promise<Loan[]> {
    return this.makeRequest(`/search?query=${encodeURIComponent(accountNo)}&resource=loans`);
  }

  // Get loans by client ID
  async getLoansByClientId(clientId: number): Promise<Loan[]> {
    return this.makeRequest(`/clients/${clientId}/loans`);
  }

  // Get overdue loans
  async getOverdueLoans(officeId?: number): Promise<Loan[]> {
    const params = new URLSearchParams();
    params.append('status', 'active');
    if (officeId) params.append('officeId', officeId.toString());
    
    const result = await this.makeRequest<{pageItems: Loan[]}>(`/loans?${params.toString()}`);
    return result.pageItems.filter(loan => loan.summary.totalOverdue > 0);
  }

  // Get loans pending approval
  async getLoansPendingApproval(officeId?: number): Promise<Loan[]> {
    const params = new URLSearchParams();
    params.append('status', 'loanStatusType.submitted.and.pending.approval');
    if (officeId) params.append('officeId', officeId.toString());
    
    const result = await this.makeRequest<{pageItems: Loan[]}>(`/loans?${params.toString()}`);
    return result.pageItems;
  }

  // Get loans awaiting disbursement
  async getLoansAwaitingDisbursement(officeId?: number): Promise<Loan[]> {
    const params = new URLSearchParams();
    params.append('status', 'loanStatusType.approved');
    if (officeId) params.append('officeId', officeId.toString());
    
    const result = await this.makeRequest<{pageItems: Loan[]}>(`/loans?${params.toString()}`);
    return result.pageItems;
  }

  // Bulk approve loans
  async bulkApproveLoan(approvalData: {
    approvedOnDate: string;
    locale: string;
    dateFormat: string;
    loanApplications: number[];
  }): Promise<any> {
    return this.makeRequest('/loans?command=approve', {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  }

  // Bulk disburse loans
  async bulkDisburseLoan(disbursementData: {
    actualDisbursementDate: string;
    locale: string;
    dateFormat: string;
    loanApplications: number[];
  }): Promise<any> {
    return this.makeRequest('/loans?command=disburse', {
      method: 'POST',
      body: JSON.stringify(disbursementData),
    });
  }
}

export const loansApi = new LoansApi();
