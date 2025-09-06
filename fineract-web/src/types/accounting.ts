// Types for Accounting Module
export interface GLAccount {
  id: number;
  name: string;
  glCode: string;
  parentId?: number;
  type: GLAccountType;
  usage: GLAccountUsage;
  description?: string;
  disabled: boolean;
  manualEntriesAllowed: boolean;
  nameDecorated?: string;
  tagId?: number;
  organizationRunningBalance?: number;
  children?: GLAccount[];
}

export interface GLAccountType {
  id: number;
  code: string;
  description: string;
  value: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
}

export interface GLAccountUsage {
  id: number;
  code: string;
  description: string;
  value: 'HEADER' | 'DETAIL';
}

export interface JournalEntry {
  id: number;
  officeId: number;
  officeName: string;
  glAccountId: number;
  glAccountName: string;
  glAccountCode: string;
  glAccountType: GLAccountType;
  transactionDate: string;
  entryType: 'DEBIT' | 'CREDIT';
  amount: number;
  transactionId: string;
  entityType: string;
  entityId?: number;
  createdByUserId: number;
  createdDate: string;
  createdByUserName: string;
  comments?: string;
  reversed: boolean;
  referenceNumber?: string;
  manualEntry: boolean;
  runningBalance?: number;
}

export interface JournalEntryData {
  id: number;
  officeId: number;
  officeName: string;
  transactionDate: string;
  transactionId: string;
  referenceNumber?: string;
  comments?: string;
  totalDebitAmount: number;
  totalCreditAmount: number;
  debits: JournalEntryDetail[];
  credits: JournalEntryDetail[];
  reversed: boolean;
  entityType: string;
  entityId?: number;
}

export interface JournalEntryDetail {
  glAccountId: number;
  glAccountName: string;
  glAccountCode: string;
  glAccountType: GLAccountType;
  amount: number;
}

export interface AccountingRule {
  id: number;
  name: string;
  description?: string;
  officeId: number;
  officeName: string;
  accountToDebit: GLAccount;
  accountToCredit: GLAccount;
  debitTags: TagOption[];
  creditTags: TagOption[];
  allowMultipleCreditEntries: boolean;
  allowMultipleDebitEntries: boolean;
  systemDefined: boolean;
}

export interface TagOption {
  id: number;
  name: string;
  code: string;
}

export interface GLClosure {
  id: number;
  officeId: number;
  officeName: string;
  closingDate: string;
  comments?: string;
  createdDate: string;
  createdByUserId: number;
  createdByUsername: string;
  updatedDate?: string;
  updatedByUserId?: number;
  updatedByUsername?: string;
  deleted: boolean;
}

export interface FinancialActivityAccount {
  id: number;
  financialActivityData: FinancialActivity;
  glAccount: GLAccount;
}

export interface FinancialActivity {
  id: number;
  name: string;
  code: string;
}

export interface ProvisioningEntry {
  id: number;
  journalEntryId: number;
  createdDate: string;
  createdByUserId: number;
  modifiedByUserId?: number;
  entries: ProvisioningEntryDetail[];
  reservedAmount: number;
}

export interface ProvisioningEntryDetail {
  id: number;
  officeId: number;
  currencyCode: string;
  productId: number;
  categoryId: number;
  overdueInDays: number;
  reserevedAmount: number;
  liabilityAccount: GLAccount;
  expenseAccount: GLAccount;
}

// Chart of Accounts Structure
export interface ChartOfAccounts {
  assets: GLAccount[];
  liabilities: GLAccount[];
  equity: GLAccount[];
  income: GLAccount[];
  expenses: GLAccount[];
}

// Trial Balance
export interface TrialBalance {
  glAccounts: TrialBalanceEntry[];
  totalDebit: number;
  totalCredit: number;
  asOfDate: string;
}

export interface TrialBalanceEntry {
  glAccount: GLAccount;
  debitAmount: number;
  creditAmount: number;
  balance: number;
}

// Financial Reports
export interface FinancialReport {
  reportType: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'TRIAL_BALANCE';
  periodType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  fromDate: string;
  toDate: string;
  data: FinancialReportData[];
  totals: FinancialReportTotals;
}

export interface FinancialReportData {
  accountType: string;
  accounts: FinancialReportAccount[];
  total: number;
}

export interface FinancialReportAccount {
  glAccount: GLAccount;
  amount: number;
  percentage: number;
}

export interface FinancialReportTotals {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

// API Request/Response types
export interface GLAccountsListParams {
  type?: number;
  searchParam?: string;
  usage?: number;
  manualEntriesAllowed?: boolean;
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  parentId?: number;
  tagId?: number;
}

export interface JournalEntriesListParams {
  officeId?: number;
  glAccountId?: number;
  manualEntriesOnly?: boolean;
  fromDate?: string;
  toDate?: string;
  transactionId?: string;
  entityType?: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  locale?: string;
  dateFormat?: string;
}

export interface CreateJournalEntryRequest {
  officeId: number;
  transactionDate: string;
  comments?: string;
  referenceNumber?: string;
  debits: CreateJournalEntryDetail[];
  credits: CreateJournalEntryDetail[];
  locale: string;
  dateFormat: string;
}

export interface CreateJournalEntryDetail {
  glAccountId: number;
  amount: number;
}

export interface CreateGLAccountRequest {
  name: string;
  glCode: string;
  parentId?: number;
  type: number;
  usage: number;
  description?: string;
  manualEntriesAllowed: boolean;
  tagId?: number;
}

export interface CreateAccountingRuleRequest {
  name: string;
  description?: string;
  officeId: number;
  accountToDebit: number;
  accountToCredit: number;
  debitTags: number[];
  creditTags: number[];
  allowMultipleCreditEntries: boolean;
  allowMultipleDebitEntries: boolean;
}

export interface CreateGLClosureRequest {
  officeId: number;
  closingDate: string;
  comments?: string;
  locale: string;
  dateFormat: string;
}
