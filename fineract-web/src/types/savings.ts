// Types for Savings Account Management
// Comprehensive TypeScript definitions for Apache Fineract Savings functionality

/**
 * Core Savings Account Interface
 */
export interface SavingsAccount {
  id: number
  accountNo: string
  externalId?: string
  clientId: number
  clientName: string
  productId: number
  productName: string
  fieldOfficerId?: number
  fieldOfficerName?: string
  status: SavingsAccountStatus
  accountType: SavingsAccountType
  timeline: SavingsAccountTimeline
  currency: Currency
  nominalAnnualInterestRate: number
  interestCompoundingPeriodType: InterestCompoundingPeriodType
  interestPostingPeriodType: InterestPostingPeriodType
  interestCalculationType: InterestCalculationType
  interestCalculationDaysInYearType: InterestCalculationDaysInYearType
  minRequiredOpeningBalance?: number
  lockinPeriodFrequency?: number
  lockinPeriodFrequencyType?: PeriodFrequencyType
  withdrawalFeeForTransfers: boolean
  allowOverdraft: boolean
  overdraftLimit?: number
  minRequiredBalance?: number
  enforceMinRequiredBalance: boolean
  minBalanceForInterestCalculation?: number
  withHoldTax: boolean
  taxGroup?: TaxGroup
  accountBalance: number
  availableBalance: number
  totalDeposits: number
  totalWithdrawals: number
  totalWithdrawalFees: number
  totalFees: number
  totalPenalties: number
  totalInterestEarned: number
  totalInterestPosted: number
  totalOverdraftInterestDerived: number
  accountBalanceTimeSeries?: AccountBalanceTimeSeries[]
  transactions?: SavingsAccountTransaction[]
  charges?: SavingsAccountCharge[]
  depositAccountOnHoldFunds?: DepositAccountOnHoldFunds[]
  summary: SavingsAccountSummary
  createdDate: string
  lastModifiedDate: string
  submittedOnDate?: string
  submittedByUsername?: string
  submittedByFirstname?: string
  submittedByLastname?: string
  approvedOnDate?: string
  approvedByUsername?: string
  approvedByFirstname?: string
  approvedByLastname?: string
  activatedOnDate?: string
  activatedByUsername?: string
  activatedByFirstname?: string
  activatedByLastname?: string
  closedOnDate?: string
  closedByUsername?: string
  closedByFirstname?: string
  closedByLastname?: string
}

/**
 * Savings Account Status Enumeration
 */
export enum SavingsAccountStatus {
  INVALID = 'INVALID',
  SUBMITTED_AND_PENDING_APPROVAL = 'SUBMITTED_AND_PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
  PREMATURE_CLOSED = 'PREMATURE_CLOSED',
  TRANSFER_IN_PROGRESS = 'TRANSFER_IN_PROGRESS',
  TRANSFER_ON_HOLD = 'TRANSFER_ON_HOLD'
}

/**
 * Savings Account Type Enumeration
 */
export enum SavingsAccountType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  JLG = 'JLG' // Joint Liability Group
}

/**
 * Savings Account Timeline
 */
export interface SavingsAccountTimeline {
  submittedOnDate?: string
  submittedByUsername?: string
  submittedByFirstname?: string
  submittedByLastname?: string
  approvedOnDate?: string
  approvedByUsername?: string
  approvedByFirstname?: string
  approvedByLastname?: string
  activatedOnDate?: string
  activatedByUsername?: string
  activatedByFirstname?: string
  activatedByLastname?: string
  closedOnDate?: string
  closedByUsername?: string
  closedByFirstname?: string
  closedByLastname?: string
}

/**
 * Savings Product Interface
 */
export interface SavingsProduct {
  id: number
  name: string
  shortName: string
  description?: string
  currency: Currency
  nominalAnnualInterestRate: number
  interestCompoundingPeriodType: InterestCompoundingPeriodType
  interestPostingPeriodType: InterestPostingPeriodType
  interestCalculationType: InterestCalculationType
  interestCalculationDaysInYearType: InterestCalculationDaysInYearType
  minRequiredOpeningBalance?: number
  lockinPeriodFrequency?: number
  lockinPeriodFrequencyType?: PeriodFrequencyType
  withdrawalFeeForTransfers: boolean
  allowOverdraft: boolean
  overdraftLimit?: number
  minRequiredBalance?: number
  enforceMinRequiredBalance: boolean
  minBalanceForInterestCalculation?: number
  withHoldTax: boolean
  taxGroup?: TaxGroup
  accountingRule: AccountingRuleType
  accountingMappings?: SavingsProductAccountingMappings
  paymentChannelToFundSourceMappings?: PaymentChannelToFundSourceMapping[]
  feeToIncomeAccountMappings?: FeeToIncomeAccountMapping[]
  penaltyToIncomeAccountMappings?: PenaltyToIncomeAccountMapping[]
  charges?: Charge[]
  isActive: boolean
  createdDate: string
  lastModifiedDate: string
}

/**
 * Interest Calculation Types
 */
export enum InterestCompoundingPeriodType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY'
}

export enum InterestPostingPeriodType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY'
}

export enum InterestCalculationType {
  DAILY_BALANCE = 'DAILY_BALANCE',
  AVERAGE_DAILY_BALANCE = 'AVERAGE_DAILY_BALANCE'
}

export enum InterestCalculationDaysInYearType {
  DAYS_360 = 'DAYS_360',
  DAYS_365 = 'DAYS_365'
}

/**
 * Savings Account Transaction Interface
 */
export interface SavingsAccountTransaction {
  id: number
  accountId: number
  officeId: number
  officeName: string
  transactionType: SavingsTransactionType
  date: string
  currency: Currency
  paymentDetailData?: PaymentDetailData
  amount: number
  runningBalance: number
  reversed: boolean
  submittedOnDate: string
  interestedPostedAsOn: boolean
  submittedByUsername?: string
  note?: string
  accountTransferData?: PortfolioAccountData
  transfer?: AccountTransferData
  originalTransactionId?: number
  lienTransaction: boolean
  releaseTransactionId?: number
}

/**
 * Savings Transaction Types
 */
export enum SavingsTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  INTEREST_POSTING = 'INTEREST_POSTING',
  WITHDRAWAL_FEE = 'WITHDRAWAL_FEE',
  ANNUAL_FEE = 'ANNUAL_FEE',
  WAIVE_CHARGES = 'WAIVE_CHARGES',
  PAY_CHARGE = 'PAY_CHARGE',
  DIVIDEND_PAYOUT = 'DIVIDEND_PAYOUT',
  INITIATE_TRANSFER = 'INITIATE_TRANSFER',
  APPROVE_TRANSFER = 'APPROVE_TRANSFER',
  WITHDRAW_TRANSFER = 'WITHDRAW_TRANSFER',
  REJECT_TRANSFER = 'REJECT_TRANSFER',
  WRITTEN_OFF = 'WRITTEN_OFF',
  OVERDRAFT_INTEREST = 'OVERDRAFT_INTEREST',
  WITHHOLD_TAX = 'WITHHOLD_TAX',
  ESCHEAT = 'ESCHEAT',
  AMOUNT_HOLD = 'AMOUNT_HOLD',
  AMOUNT_RELEASE = 'AMOUNT_RELEASE'
}

/**
 * Savings Account Charge Interface
 */
export interface SavingsAccountCharge {
  id: number
  chargeId: number
  accountId: number
  name: string
  chargeTimeType: ChargeTimeType
  chargeCalculationType: ChargeCalculationType
  percentage?: number
  amountPercentageAppliedTo?: number
  currency: Currency
  amount: number
  amountPaid: number
  amountWaived: number
  amountOutstanding: number
  penalty: boolean
  isActive: boolean
  isFreeWithdrawal: boolean
  freeWithdrawalChargeFrequency?: number
  restartFrequency?: number
  restartFrequencyEnum?: number
  isPaymentDue: boolean
  dueAsOfDate?: string
  inactivationDate?: string
}

/**
 * Charge Time Type Enumeration
 */
export enum ChargeTimeType {
  SPECIFIED_DUE_DATE = 'SPECIFIED_DUE_DATE',
  SAVINGS_ACTIVATION = 'SAVINGS_ACTIVATION',
  SAVINGS_CLOSURE = 'SAVINGS_CLOSURE',
  WITHDRAWAL_FEE = 'WITHDRAWAL_FEE',
  ANNUAL_FEE = 'ANNUAL_FEE',
  MONTHLY_FEE = 'MONTHLY_FEE',
  QUARTERLY_FEE = 'QUARTERLY_FEE',
  WEEKLY_FEE = 'WEEKLY_FEE',
  OVERDRAFT_FEE = 'OVERDRAFT_FEE'
}

/**
 * Charge Calculation Type Enumeration
 */
export enum ChargeCalculationType {
  FLAT = 'FLAT',
  PERCENT_OF_AMOUNT = 'PERCENT_OF_AMOUNT',
  PERCENT_OF_AMOUNT_AND_INTEREST = 'PERCENT_OF_AMOUNT_AND_INTEREST',
  PERCENT_OF_INTEREST = 'PERCENT_OF_INTEREST'
}

/**
 * Savings Account Summary
 */
export interface SavingsAccountSummary {
  currency: Currency
  totalDeposits?: number
  totalWithdrawals?: number
  totalWithdrawalFees?: number
  totalAnnualFees?: number
  totalInterestEarned?: number
  totalInterestPosted?: number
  accountBalance?: number
  totalFeeCharge?: number
  totalPenaltyCharge?: number
  totalOverdraftInterestDerived?: number
  interestNotPosted?: number
  lastInterestCalculationDate?: string
  availableBalance?: number
}

/**
 * Currency Interface
 */
export interface Currency {
  code: string
  name: string
  decimalPlaces: number
  inMultiplesOf?: number
  displaySymbol: string
  nameCode: string
  displayLabel: string
}

/**
 * Period Frequency Type
 */
export enum PeriodFrequencyType {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
  YEARS = 'YEARS'
}

/**
 * Tax Group Interface
 */
export interface TaxGroup {
  id: number
  name: string
  taxComponents: TaxComponent[]
  createdDate: string
  lastModifiedDate: string
}

/**
 * Tax Component Interface
 */
export interface TaxComponent {
  id: number
  name: string
  percentage: number
  debitAccountType?: GLAccountType
  debitAcount?: GLAccount
  creditAccountType?: GLAccountType
  creditAccount?: GLAccount
  startDate: string
  endDate?: string
}

/**
 * Account Balance Time Series
 */
export interface AccountBalanceTimeSeries {
  date: string
  balance: number
  deposits: number
  withdrawals: number
  interestPosted: number
}

/**
 * Deposit Account On Hold Funds
 */
export interface DepositAccountOnHoldFunds {
  id: number
  amount: number
  transactionType: string
  transactionDate: string
  transactionId: number
  reversed: boolean
}

/**
 * Savings Product Accounting Mappings
 */
export interface SavingsProductAccountingMappings {
  savingsReferenceAccount?: GLAccount
  savingsControlAccount?: GLAccount
  transfersSuspenseAccount?: GLAccount
  interestOnSavingsAccount?: GLAccount
  incomeFromFeeAccount?: GLAccount
  incomeFromPenaltyAccount?: GLAccount
  overdraftPortfolioControl?: GLAccount
  incomeFromInterestAccount?: GLAccount
  writeOffAccount?: GLAccount
}

/**
 * Payment Channel to Fund Source Mapping
 */
export interface PaymentChannelToFundSourceMapping {
  paymentType: PaymentType
  fundSourceAccount: GLAccount
}

/**
 * Fee to Income Account Mapping
 */
export interface FeeToIncomeAccountMapping {
  charge: Charge
  incomeAccount: GLAccount
}

/**
 * Penalty to Income Account Mapping
 */
export interface PenaltyToIncomeAccountMapping {
  charge: Charge
  incomeAccount: GLAccount
}

/**
 * GL Account Interface
 */
export interface GLAccount {
  id: number
  name: string
  parentId?: number
  glCode: string
  disabled: boolean
  manualEntriesAllowed: boolean
  type: GLAccountType
  usage: GLAccountUsage
  description?: string
  nameDecorated: string
  tagId?: CodeValue
  organizationRunningBalance: number
}

/**
 * GL Account Type Enumeration
 */
export enum GLAccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

/**
 * GL Account Usage Enumeration
 */
export enum GLAccountUsage {
  DETAIL = 'DETAIL',
  HEADER = 'HEADER'
}

/**
 * Accounting Rule Type
 */
export enum AccountingRuleType {
  NONE = 'NONE',
  CASH_BASED = 'CASH_BASED',
  ACCRUAL_PERIODIC = 'ACCRUAL_PERIODIC',
  ACCRUAL_UPFRONT = 'ACCRUAL_UPFRONT'
}

/**
 * Payment Type Interface
 */
export interface PaymentType {
  id: number
  name: string
  description?: string
  isCashPayment: boolean
  position: number
}

/**
 * Charge Interface
 */
export interface Charge {
  id: number
  name: string
  active: boolean
  penalty: boolean
  currency: Currency
  amount: number
  chargeTimeType: ChargeTimeType
  chargeAppliesTo: ChargeAppliesTo
  chargeCalculationType: ChargeCalculationType
  chargePaymentMode: ChargePaymentMode
  feeOnMonthDay?: MonthDay
  feeInterval?: number
  minCap?: number
  maxCap?: number
  feeFrequency?: FeeFrequencyType
  incomeOrLiabilityAccount?: GLAccount
  taxGroup?: TaxGroup
}

/**
 * Charge Applies To Enumeration
 */
export enum ChargeAppliesTo {
  LOAN = 'LOAN',
  SAVINGS = 'SAVINGS',
  CLIENT = 'CLIENT',
  SHARES = 'SHARES'
}

/**
 * Charge Payment Mode Enumeration
 */
export enum ChargePaymentMode {
  REGULAR = 'REGULAR',
  ACCOUNT_TRANSFER = 'ACCOUNT_TRANSFER'
}

/**
 * Fee Frequency Type Enumeration
 */
export enum FeeFrequencyType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY'
}

/**
 * Month Day Interface
 */
export interface MonthDay {
  monthOfYear: number
  dayOfMonth: number
}

/**
 * Code Value Interface
 */
export interface CodeValue {
  id: number
  name: string
  position: number
  description?: string
  active: boolean
}

/**
 * Payment Detail Data Interface
 */
export interface PaymentDetailData {
  id: number
  paymentType: PaymentType
  accountNumber?: string
  checkNumber?: string
  routingCode?: string
  receiptNumber?: string
  bankNumber?: string
}

/**
 * Portfolio Account Data Interface
 */
export interface PortfolioAccountData {
  accountId: number
  accountNo: string
  productId: number
  productName: string
  clientId: number
  clientName: string
  accountType: number
  accountTypeName: string
  currency: Currency
  accountBalance?: number
  totalDeposits?: number
  totalWithdrawals?: number
}

/**
 * Account Transfer Data Interface
 */
export interface AccountTransferData {
  id: number
  fromOffice: Office
  toOffice: Office
  fromClient: Client
  toClient: Client
  fromAccount: PortfolioAccountData
  toAccount: PortfolioAccountData
  currency: Currency
  transferAmount: number
  transferDescription?: string
  transferDate: string
  transferType: string
}

/**
 * Office Interface (simplified)
 */
export interface Office {
  id: number
  name: string
  nameDecorated: string
  externalId?: string
  openingDate: string
  hierarchy?: string
}

/**
 * Client Interface (simplified for transfers)
 */
export interface Client {
  id: number
  accountNo: string
  displayName: string
  officeId: number
  officeName: string
}

/**
 * Savings Account Search Parameters
 */
export interface SavingsAccountSearchParams {
  accountNo?: string
  externalId?: string
  clientName?: string
  productId?: number
  status?: SavingsAccountStatus
  minBalance?: number
  maxBalance?: number
  fromDate?: string
  toDate?: string
  officeId?: number
  offset?: number
  limit?: number
  orderBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * Savings Account Template Interface
 */
export interface SavingsAccountTemplate {
  clientId?: number
  clientName?: string
  groupId?: number
  groupName?: string
  clientOptions?: ClientOption[]
  groupOptions?: GroupOption[]
  productOptions?: SavingsProductOption[]
  fieldOfficerOptions?: StaffOption[]
  interestCompoundingPeriodTypeOptions?: CodeValueOption[]
  interestPostingPeriodTypeOptions?: CodeValueOption[]
  interestCalculationTypeOptions?: CodeValueOption[]
  interestCalculationDaysInYearTypeOptions?: CodeValueOption[]
  lockinPeriodFrequencyTypeOptions?: CodeValueOption[]
  withdrawalFeeTypeOptions?: CodeValueOption[]
  chargeOptions?: ChargeOption[]
  accountingRule: AccountingRuleType
}

/**
 * Client Option Interface
 */
export interface ClientOption {
  id: number
  displayName: string
  officeId: number
  officeName: string
}

/**
 * Group Option Interface
 */
export interface GroupOption {
  id: number
  name: string
  officeId: number
  officeName: string
}

/**
 * Savings Product Option Interface
 */
export interface SavingsProductOption {
  id: number
  name: string
  shortName: string
  description?: string
  currency: Currency
  nominalAnnualInterestRate: number
}

/**
 * Staff Option Interface
 */
export interface StaffOption {
  id: number
  displayName: string
  officeId: number
  officeName: string
  isLoanOfficer: boolean
  isActive: boolean
}

/**
 * Code Value Option Interface
 */
export interface CodeValueOption {
  id: number
  name: string
  value: number
  description?: string
}

/**
 * Charge Option Interface
 */
export interface ChargeOption {
  id: number
  name: string
  active: boolean
  penalty: boolean
  currency: Currency
  amount: number
  chargeTimeType: ChargeTimeType
  chargeCalculationType: ChargeCalculationType
}

/**
 * Savings Account Creation Request
 */
export interface CreateSavingsAccountRequest {
  clientId: number
  productId: number
  fieldOfficerId?: number
  submittedOnDate: string
  nominalAnnualInterestRate?: number
  minRequiredOpeningBalance?: number
  lockinPeriodFrequency?: number
  lockinPeriodFrequencyType?: number
  withdrawalFeeForTransfers?: boolean
  allowOverdraft?: boolean
  overdraftLimit?: number
  minRequiredBalance?: number
  enforceMinRequiredBalance?: boolean
  minBalanceForInterestCalculation?: number
  withHoldTax?: boolean
  taxGroupId?: number
  externalId?: string
  charges?: CreateSavingsAccountChargeRequest[]
  dateFormat: string
  locale: string
}

/**
 * Savings Account Charge Creation Request
 */
export interface CreateSavingsAccountChargeRequest {
  chargeId: number
  amount?: number
  dueDate?: string
  feeOnMonthDay?: number[]
  feeInterval?: number
  dateFormat: string
  locale: string
}

/**
 * Savings Account Update Request
 */
export interface UpdateSavingsAccountRequest {
  productId?: number
  fieldOfficerId?: number
  nominalAnnualInterestRate?: number
  minRequiredOpeningBalance?: number
  lockinPeriodFrequency?: number
  lockinPeriodFrequencyType?: number
  withdrawalFeeForTransfers?: boolean
  allowOverdraft?: boolean
  overdraftLimit?: number
  minRequiredBalance?: number
  enforceMinRequiredBalance?: boolean
  minBalanceForInterestCalculation?: number
  withHoldTax?: boolean
  taxGroupId?: number
  externalId?: string
}

/**
 * Savings Account Activation Request
 */
export interface ActivateSavingsAccountRequest {
  activatedOnDate: string
  dateFormat: string
  locale: string
}

/**
 * Savings Account Closure Request
 */
export interface CloseSavingsAccountRequest {
  closedOnDate: string
  withdrawBalance?: boolean
  paymentTypeId?: number
  accountNumber?: string
  checkNumber?: string
  routingCode?: string
  receiptNumber?: string
  bankNumber?: string
  note?: string
  dateFormat: string
  locale: string
}

/**
 * Savings Account Transaction Request
 */
export interface SavingsAccountTransactionRequest {
  transactionDate: string
  transactionAmount: number
  paymentTypeId?: number
  accountNumber?: string
  checkNumber?: string
  routingCode?: string
  receiptNumber?: string
  bankNumber?: string
  note?: string
  dateFormat: string
  locale: string
}

/**
 * Hold Amount Request
 */
export interface HoldAmountRequest {
  transactionDate: string
  transactionAmount: number
  reasonForBlock: string
  dateFormat: string
  locale: string
}

/**
 * Block/Unblock Account Request
 */
export interface BlockUnblockAccountRequest {
  reasonForBlock?: string
}

/**
 * Savings Account Statistics
 */
export interface SavingsAccountStatistics {
  totalAccounts: number
  activeAccounts: number
  inactiveAccounts: number
  pendingApprovalAccounts: number
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  averageBalance: number
  topPerformingProducts: ProductPerformance[]
  recentTransactions: SavingsAccountTransaction[]
  monthlyGrowth: number
  interestPaid: number
}

/**
 * Product Performance Interface
 */
export interface ProductPerformance {
  productId: number
  productName: string
  accountCount: number
  totalBalance: number
  averageBalance: number
  growthRate: number
}
