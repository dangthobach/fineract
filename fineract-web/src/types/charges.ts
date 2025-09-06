// Charges Types and Interfaces
// TypeScript definitions for Apache Fineract Charge Management

export interface Charge {
  id: number
  name: string
  active: boolean
  penalty: boolean
  currency: {
    code: string
    name: string
    decimalPlaces: number
    displaySymbol: string
    nameCode: string
    displayLabel: string
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
  feeOnMonthDay?: number[]
  feeInterval?: number
  minCap?: number
  maxCap?: number
  feeFrequency?: {
    id: number
    code: string
    value: string
  }
  incomeOrLiabilityAccount?: {
    id: number
    name: string
    glCode: string
  }
  taxGroupId?: number
  taxGroupName?: string
}

export interface CreateChargeRequest {
  name: string
  currencyCode: string
  amount: number
  chargeTimeTypeId: number
  chargeAppliesToId: number
  chargeCalculationTypeId: number
  chargePaymentModeId: number
  active?: boolean
  penalty?: boolean
  feeOnMonthDay?: number[]
  feeInterval?: number
  minCap?: number
  maxCap?: number
  feeFrequencyId?: number
  incomeOrLiabilityAccountId?: number
  taxGroupId?: number
  dateFormat?: string
  locale?: string
  monthDayFormat?: string
}

export interface UpdateChargeRequest extends Partial<CreateChargeRequest> {}

export interface ChargeSearchParams {
  name?: string
  active?: boolean
  penalty?: boolean
  chargeAppliesTo?: 'LOAN' | 'SAVINGS' | 'CLIENT' | 'SHARES'
  orderBy?: 'name' | 'amount' | 'chargeTimeType'
  sortOrder?: 'ASC' | 'DESC'
  offset?: number
  limit?: number
}

export interface ChargeTimeType {
  id: number
  code: string
  value: string
}

export interface ChargeAppliesTo {
  id: number
  code: string
  value: string
}

export interface ChargeCalculationType {
  id: number
  code: string
  value: string
}

export interface ChargePaymentMode {
  id: number
  code: string
  value: string
}
