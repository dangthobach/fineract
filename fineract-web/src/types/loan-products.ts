// Loan Products Types and Interfaces
// TypeScript definitions for Apache Fineract Loan Product Management

export interface LoanProduct {
  id: number
  name: string
  shortName: string
  description?: string
  fundId?: number
  fundName?: string
  includeInBorrowerCycle: boolean
  useBorrowerCycle: boolean
  startDate?: string
  closeDate?: string
  status: 'ACTIVE' | 'INACTIVE'
  currency: {
    code: string
    name: string
    decimalPlaces: number
    displaySymbol: string
    nameCode: string
    displayLabel: string
  }
  
  // Interest Configuration
  interestRateVariableSettings: {
    interestRatePerPeriod: number
    interestRateFrequencyType: {
      id: number
      code: string
      value: string
    }
    minInterestRatePerPeriod: number
    maxInterestRatePerPeriod: number
    interestRateVariableType: {
      id: number
      code: string
      value: string
    }
  }
  
  interestType: {
    id: number
    code: string
    value: string
  }
  
  interestCalculationPeriodType: {
    id: number
    code: string
    value: string
  }
  
  // Amount Configuration
  principal: number
  minPrincipal: number
  maxPrincipal: number
  
  // Term Configuration
  numberOfRepayments: number
  minNumberOfRepayments: number
  maxNumberOfRepayments: number
  
  repaymentFrequencyType: {
    id: number
    code: string
    value: string
  }
  
  // Repayment Configuration
  amortizationType: {
    id: number
    code: string
    value: string
  }
  
  interestRateFrequencyType: {
    id: number
    code: string
    value: string
  }
  
  // Charges
  charges: LoanProductCharge[]
  
  // Accounting
  accountingRule: {
    id: number
    code: string
    value: string
  }
  
  // Additional Settings
  transactionProcessingStrategyId: number
  transactionProcessingStrategyName: string
  graceOnPrincipalPayment?: number
  graceOnInterestPayment?: number
  graceOnInterestCharged?: number
  graceOnArrearsAgeing?: number
  overdueDaysForNPA?: number
  daysInMonthType: {
    id: number
    code: string
    value: string
  }
  daysInYearType: {
    id: number
    code: string
    value: string
  }
  isInterestRecalculationEnabled: boolean
  canDefineInstallmentAmount: boolean
  canUseForTopup: boolean
}

export interface LoanProductCharge {
  id: number
  name: string
  active: boolean
  penalty: boolean
  currency: {
    code: string
    name: string
    decimalPlaces: number
    displaySymbol: string
  }
  amount: number
  chargeTimeType: {
    id: number
    code: string
    value: string
  }
  chargeAppliesTo: {
    id: number
    code: string
    value: string
  }
  chargeCalculationType: {
    id: number
    code: string
    value: string
  }
  chargePaymentMode: {
    id: number
    code: string
    value: string
  }
}

export interface CreateLoanProductRequest {
  name: string
  shortName: string
  description?: string
  fundId?: number
  includeInBorrowerCycle?: boolean
  useBorrowerCycle?: boolean
  startDate?: string
  closeDate?: string
  
  // Currency
  currencyCode: string
  digitsAfterDecimal: number
  inMultiplesOf?: number
  
  // Interest Configuration
  interestRatePerPeriod: number
  interestRateFrequencyTypeId: number
  minInterestRatePerPeriod?: number
  maxInterestRatePerPeriod?: number
  interestTypeId: number
  interestCalculationPeriodTypeId: number
  
  // Amount Configuration
  principal: number
  minPrincipal?: number
  maxPrincipal?: number
  
  // Term Configuration
  numberOfRepayments: number
  minNumberOfRepayments?: number
  maxNumberOfRepayments?: number
  repaymentFrequencyTypeId: number
  
  // Repayment Configuration
  amortizationTypeId: number
  transactionProcessingStrategyId: number
  
  // Grace Periods
  graceOnPrincipalPayment?: number
  graceOnInterestPayment?: number
  graceOnInterestCharged?: number
  graceOnArrearsAgeing?: number
  overdueDaysForNPA?: number
  
  // Calendar Settings
  daysInMonthTypeId?: number
  daysInYearTypeId?: number
  
  // Features
  isInterestRecalculationEnabled?: boolean
  canDefineInstallmentAmount?: boolean
  canUseForTopup?: boolean
  
  // Charges
  charges?: number[]
  
  // Accounting
  accountingRule: number
  
  dateFormat?: string
  locale?: string
}

export interface UpdateLoanProductRequest extends Partial<CreateLoanProductRequest> {}

export interface LoanProductSearchParams {
  name?: string
  isActive?: boolean
  orderBy?: 'name' | 'shortName' | 'principal'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}
