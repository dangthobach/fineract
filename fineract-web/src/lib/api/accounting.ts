import { fineractAPI } from './client';
import type {
  GLAccount,
  GLAccountsListParams,
  JournalEntry,
  JournalEntryData,
  JournalEntriesListParams,
  AccountingRule,
  GLClosure,
  FinancialActivityAccount,
  ProvisioningEntry,
  ChartOfAccounts,
  TrialBalance,
  FinancialReport,
  CreateGLAccountRequest,
  CreateJournalEntryRequest,
  CreateAccountingRuleRequest,
  CreateGLClosureRequest,
} from '@/types/accounting';
import type { ApiResponse, PagedResponse } from '@/types/api';

// GL Accounts API
export const glAccountsApi = {
  // List all GL Accounts
  getAll: (params?: GLAccountsListParams): Promise<GLAccount[]> =>
    fineractAPI.get('/glaccounts', { params }),

  // Get GL Account by ID
  getById: (id: number, fetchRunningBalance = false): Promise<GLAccount> =>
    fineractAPI.get(`/glaccounts/${id}`, { 
      params: { fetchRunningBalance } 
    }),

  // Get GL Account Template
  getTemplate: (type?: number): Promise<GLAccount> =>
    fineractAPI.get('/glaccounts/template', { params: { type } }),

  // Create GL Account
  create: (data: CreateGLAccountRequest): Promise<ApiResponse> =>
    fineractAPI.post('/glaccounts', data),

  // Update GL Account
  update: (id: number, data: Partial<CreateGLAccountRequest>): Promise<ApiResponse> =>
    fineractAPI.put(`/glaccounts/${id}`, data),

  // Delete GL Account
  delete: (id: number): Promise<ApiResponse> =>
    fineractAPI.delete(`/glaccounts/${id}`),

  // Get Chart of Accounts (organized by type)
  getChartOfAccounts: async (): Promise<ChartOfAccounts> => {
    const accounts = await fineractAPI.get<GLAccount[]>('/glaccounts');
    
    const chartOfAccounts: ChartOfAccounts = {
      assets: accounts.filter((acc: GLAccount) => acc.type.value === 'ASSET'),
      liabilities: accounts.filter((acc: GLAccount) => acc.type.value === 'LIABILITY'),
      equity: accounts.filter((acc: GLAccount) => acc.type.value === 'EQUITY'),
      income: accounts.filter((acc: GLAccount) => acc.type.value === 'INCOME'),
      expenses: accounts.filter((acc: GLAccount) => acc.type.value === 'EXPENSE'),
    };
    
    return chartOfAccounts;
  },
};

// Journal Entries API
export const journalEntriesApi = {
  // List Journal Entries
  getAll: (params?: JournalEntriesListParams): Promise<PagedResponse<JournalEntry>> =>
    fineractAPI.get('/journalentries', { params }),

  // Get Journal Entry by ID
  getById: (id: number): Promise<JournalEntryData> =>
    fineractAPI.get(`/journalentries/${id}`),

  // Create Journal Entry
  create: (data: CreateJournalEntryRequest): Promise<ApiResponse> =>
    fineractAPI.post('/journalentries', data),

  // Update Journal Entry
  update: (id: number, data: Partial<CreateJournalEntryRequest>): Promise<ApiResponse> =>
    fineractAPI.put(`/journalentries/${id}`, data),

  // Delete Journal Entry
  delete: (id: number): Promise<ApiResponse> =>
    fineractAPI.delete(`/journalentries/${id}`),

  // Reverse Journal Entry
  reverse: (id: number, comments?: string): Promise<ApiResponse> =>
    fineractAPI.post(`/journalentries/${id}?command=reverse`, { comments }),

  // Get Trial Balance
  getTrialBalance: (officeId?: number, date?: string): Promise<TrialBalance> => {
    const params = new URLSearchParams();
    if (officeId) params.append('officeId', officeId.toString());
    if (date) params.append('date', date);
    
    return fineractAPI.get(`/journalentries/trialbalance?${params.toString()}`);
  },
};

// Accounting Rules API
export const accountingRulesApi = {
  // List Accounting Rules
  getAll: (): Promise<AccountingRule[]> =>
    fineractAPI.get('/accountingrules'),

  // Get Accounting Rule by ID
  getById: (id: number): Promise<AccountingRule> =>
    fineractAPI.get(`/accountingrules/${id}`),

  // Get Accounting Rule Template
  getTemplate: (): Promise<AccountingRule> =>
    fineractAPI.get('/accountingrules/template'),

  // Create Accounting Rule
  create: (data: CreateAccountingRuleRequest): Promise<ApiResponse> =>
    fineractAPI.post('/accountingrules', data),

  // Update Accounting Rule
  update: (id: number, data: Partial<CreateAccountingRuleRequest>): Promise<ApiResponse> =>
    fineractAPI.put(`/accountingrules/${id}`, data),

  // Delete Accounting Rule
  delete: (id: number): Promise<ApiResponse> =>
    fineractAPI.delete(`/accountingrules/${id}`),
};

// GL Closures API
export const glClosuresApi = {
  // List GL Closures
  getAll: (officeId?: number): Promise<GLClosure[]> =>
    fineractAPI.get('/glclosures', { params: { officeId } }),

  // Get GL Closure by ID
  getById: (id: number): Promise<GLClosure> =>
    fineractAPI.get(`/glclosures/${id}`),

  // Create GL Closure
  create: (data: CreateGLClosureRequest): Promise<ApiResponse> =>
    fineractAPI.post('/glclosures', data),

  // Update GL Closure
  update: (id: number, data: Partial<CreateGLClosureRequest>): Promise<ApiResponse> =>
    fineractAPI.put(`/glclosures/${id}`, data),

  // Delete GL Closure
  delete: (id: number): Promise<ApiResponse> =>
    fineractAPI.delete(`/glclosures/${id}`),
};

// Financial Activity Accounts API
export const financialActivityAccountsApi = {
  // List Financial Activity Accounts
  getAll: (): Promise<FinancialActivityAccount[]> =>
    fineractAPI.get('/financialactivityaccounts'),

  // Get Financial Activity Account by ID
  getById: (id: number): Promise<FinancialActivityAccount> =>
    fineractAPI.get(`/financialactivityaccounts/${id}`),

  // Get Template
  getTemplate: (): Promise<FinancialActivityAccount> =>
    fineractAPI.get('/financialactivityaccounts/template'),

  // Create Financial Activity Account
  create: (data: { financialActivityId: number; glAccountId: number }): Promise<ApiResponse> =>
    fineractAPI.post('/financialactivityaccounts', data),

  // Update Financial Activity Account
  update: (id: number, data: { glAccountId: number }): Promise<ApiResponse> =>
    fineractAPI.put(`/financialactivityaccounts/${id}`, data),

  // Delete Financial Activity Account
  delete: (id: number): Promise<ApiResponse> =>
    fineractAPI.delete(`/financialactivityaccounts/${id}`),
};

// Provisioning Entries API
export const provisioningEntriesApi = {
  // List Provisioning Entries
  getAll: (): Promise<ProvisioningEntry[]> =>
    fineractAPI.get('/provisioningentries'),

  // Get Provisioning Entry by ID
  getById: (id: number): Promise<ProvisioningEntry> =>
    fineractAPI.get(`/provisioningentries/${id}`),

  // Create Provisioning Entry
  create: (date: string): Promise<ApiResponse> =>
    fineractAPI.post('/provisioningentries', { date }),

  // Recreate Provisioning Entry
  recreate: (entryId: number): Promise<ApiResponse> =>
    fineractAPI.post(`/provisioningentries/${entryId}?command=recreateprovisioningentry`),
};

// Accrual Accounting API
export const accrualAccountingApi = {
  // Run Periodic Accrual Accounting
  runPeriodicAccrual: (tillDate: string): Promise<ApiResponse> =>
    fineractAPI.post('/runaccruals', { tillDate }),
};

// Reports API for Accounting
export const accountingReportsApi = {
  // Balance Sheet
  getBalanceSheet: (
    officeId: number,
    date: string,
    dateFormat = 'yyyy-MM-dd',
    locale = 'en'
  ): Promise<FinancialReport> =>
    fineractAPI.get('/reports/BalanceSheet', {
      params: { 
        R_officeId: officeId, 
        R_date: date, 
        R_dateFormat: dateFormat, 
        R_locale: locale 
      },
    }),

  // Income Statement
  getIncomeStatement: (
    officeId: number,
    fromDate: string,
    toDate: string,
    dateFormat = 'yyyy-MM-dd',
    locale = 'en'
  ): Promise<FinancialReport> =>
    fineractAPI.get('/reports/IncomeStatement', {
      params: { 
        R_officeId: officeId, 
        R_fromDate: fromDate, 
        R_toDate: toDate,
        R_dateFormat: dateFormat, 
        R_locale: locale 
      },
    }),

  // Trial Balance
  getTrialBalanceReport: (
    officeId: number,
    date: string,
    dateFormat = 'yyyy-MM-dd',
    locale = 'en'
  ): Promise<FinancialReport> =>
    fineractAPI.get('/reports/TrialBalance', {
      params: { 
        R_officeId: officeId, 
        R_date: date, 
        R_dateFormat: dateFormat, 
        R_locale: locale 
      },
    }),
};

// Export all accounting APIs
export const accountingApi = {
  glAccounts: glAccountsApi,
  journalEntries: journalEntriesApi,
  accountingRules: accountingRulesApi,
  glClosures: glClosuresApi,
  financialActivityAccounts: financialActivityAccountsApi,
  provisioningEntries: provisioningEntriesApi,
  accrualAccounting: accrualAccountingApi,
  reports: accountingReportsApi,
};
