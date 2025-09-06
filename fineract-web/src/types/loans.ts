// Loan Status Enums
export type LoanStatus = 
  | 'loanStatusType.submitted.and.pending.approval'
  | 'loanStatusType.approved'
  | 'loanStatusType.active'
  | 'loanStatusType.withdrawn.by.client'
  | 'loanStatusType.rejected'
  | 'loanStatusType.closed.obligations.met'
  | 'loanStatusType.closed.written.off'
  | 'loanStatusType.closed.reschedule.outstanding.amount'
  | 'loanStatusType.overpaid';

export type LoanTransactionType =
  | 'loanTransactionType.disbursement'
  | 'loanTransactionType.repayment'
  | 'loanTransactionType.contra'
  | 'loanTransactionType.waive.interest'
  | 'loanTransactionType.waive.charges'
  | 'loanTransactionType.accrual'
  | 'loanTransactionType.write.off'
  | 'loanTransactionType.recovery.repayment'
  | 'loanTransactionType.charge.payment';

export interface Currency {
  code: string;
  name: string;
  decimalPlaces: number;
  inMultiplesOf: number;
  displaySymbol: string;
  nameCode: string;
  displayLabel: string;
}

export interface LoanTimeline {
  submittedOnDate: string;
  submittedByUsername?: string;
  submittedByFirstname?: string;
  submittedByLastname?: string;
  rejectedOnDate?: string;
  rejectedByUsername?: string;
  rejectedByFirstname?: string;
  rejectedByLastname?: string;
  withdrawnOnDate?: string;
  withdrawnByUsername?: string;
  withdrawnByFirstname?: string;
  withdrawnByLastname?: string;
  approvedOnDate?: string;
  approvedByUsername?: string;
  approvedByFirstname?: string;
  approvedByLastname?: string;
  expectedDisbursementDate?: string;
  actualDisbursementDate?: string;
  disbursedByUsername?: string;
  disbursedByFirstname?: string;
  disbursedByLastname?: string;
  closedOnDate?: string;
  closedByUsername?: string;
  closedByFirstname?: string;
  closedByLastname?: string;
  expectedMaturityDate?: string;
  actualMaturityDate?: string;
  writeOffOnDate?: string;
  writeOffByUsername?: string;
  writeOffByFirstname?: string;
  writeOffByLastname?: string;
  chargedOffOnDate?: string;
  chargedOffByUsername?: string;
  chargedOffByFirstname?: string;
  chargedOffByLastname?: string;
}

export interface LoanSummary {
  currency: Currency;
  principalDisbursed: number;
  principalPaid: number;
  principalWrittenOff: number;
  principalOutstanding: number;
  principalOverdue: number;
  interestCharged: number;
  interestPaid: number;
  interestWaived: number;
  interestWrittenOff: number;
  interestOutstanding: number;
  interestOverdue: number;
  feeChargesCharged: number;
  feeChargesDueAtDisbursementCharged: number;
  feeChargesPaid: number;
  feeChargesWaived: number;
  feeChargesWrittenOff: number;
  feeChargesOutstanding: number;
  feeChargesOverdue: number;
  penaltyChargesCharged: number;
  penaltyChargesPaid: number;
  penaltyChargesWaived: number;
  penaltyChargesWrittenOff: number;
  penaltyChargesOutstanding: number;
  penaltyChargesOverdue: number;
  totalExpectedRepayment: number;
  totalRepayment: number;
  totalExpectedCostOfLoan: number;
  totalCostOfLoan: number;
  totalWaived: number;
  totalWrittenOff: number;
  totalOutstanding: number;
  totalOverdue: number;
  overdueSinceDate?: string;
  linkedAccount?: any;
  fixedEmiAmount?: number;
  maxOutstandingLoanBalance?: number;
  canDisburse: boolean;
  inArrears: boolean;
  graceOnArrearsAgeing?: number;
  isNPA: boolean;
  daysInMonthType: {
    id: number;
    code: string;
    value: string;
  };
  daysInYearType: {
    id: number;
    code: string;
    value: string;
  };
  isInterestRecalculationEnabled: boolean;
  isVariableInstallmentsAllowed: boolean;
  minimumGap?: number;
  maximumGap?: number;
  loanCounter?: number;
  loanProductCounter?: number;
  isFloatingInterestRate: boolean;
  interestRateDifferential?: number;
}

export interface LoanSchedulePeriod {
  period?: number;
  dueDate?: string;
  obligationsMetOnDate?: string;
  complete?: boolean;
  daysInPeriod?: number;
  principalOriginalDue?: number;
  principalDue: number;
  principalPaid?: number;
  principalWrittenOff?: number;
  principalOutstanding: number;
  interestOriginalDue?: number;
  interestDue: number;
  interestPaid?: number;
  interestWaived?: number;
  interestWrittenOff?: number;
  interestOutstanding: number;
  feeChargesDue: number;
  feeChargesPaid?: number;
  feeChargesWaived?: number;
  feeChargesWrittenOff?: number;
  feeChargesOutstanding: number;
  penaltyChargesDue: number;
  penaltyChargesPaid?: number;
  penaltyChargesWaived?: number;
  penaltyChargesWrittenOff?: number;
  penaltyChargesOutstanding: number;
  totalOriginalDueForPeriod?: number;
  totalDueForPeriod: number;
  totalPaidForPeriod?: number;
  totalPaidInAdvanceForPeriod?: number;
  totalPaidLateForPeriod?: number;
  totalWaivedForPeriod?: number;
  totalWrittenOffForPeriod?: number;
  totalOutstandingForPeriod: number;
  totalOverdue?: number;
  totalActualCostOfLoanForPeriod?: number;
  totalInstallmentAmountForPeriod?: number;
  rescheduleInterestPortion?: number;
  isNew?: boolean;
}

export interface LoanSchedule {
  currency: Currency;
  loanTermInDays: number;
  totalPrincipalDisbursed: number;
  totalPrincipalExpected: number;
  totalPrincipalPaid: number;
  totalInterestCharged: number;
  totalFeeChargesCharged: number;
  totalPenaltyChargesCharged: number;
  totalWaived: number;
  totalWrittenOff: number;
  totalRepaymentExpected: number;
  totalRepayment: number;
  totalPaidInAdvance: number;
  totalPaidLate: number;
  totalOutstanding: number;
  periods: LoanSchedulePeriod[];
}

export interface LoanTransaction {
  id: number;
  officeId: number;
  officeName?: string;
  type: {
    id: number;
    code: LoanTransactionType;
    value: string;
    disbursement?: boolean;
    repaymentAtDisbursement?: boolean;
    repayment?: boolean;
    contra?: boolean;
    waiveInterest?: boolean;
    waiveCharges?: boolean;
    accrual?: boolean;
    writeOff?: boolean;
    recoveryRepayment?: boolean;
    chargePayment?: boolean;
    refund?: boolean;
  };
  date: string;
  currency: Currency;
  amount: number;
  netDisbursalAmount?: number;
  principalPortion?: number;
  interestPortion?: number;
  feeChargesPortion?: number;
  penaltyChargesPortion?: number;
  overpaymentPortion?: number;
  unrecognizedIncomePortion?: number;
  outstandingLoanBalance?: number;
  submittedOnDate?: string;
  manuallyReversed?: boolean;
  possibleNextRepaymentDate?: string;
  paymentDetailData?: {
    id: number;
    paymentType: {
      id: number;
      name: string;
    };
    accountNumber?: string;
    checkNumber?: string;
    routingCode?: string;
    receiptNumber?: string;
    bankNumber?: string;
  };
  fixedEmiAmount?: number;
}

export interface LoanCharge {
  id: number;
  chargeId: number;
  name: string;
  chargeTimeType: {
    id: number;
    code: string;
    value: string;
  };
  chargeCalculationType: {
    id: number;
    code: string;
    value: string;
  };
  percentage?: number;
  amountPercentageAppliedTo?: number;
  currency: Currency;
  amount: number;
  amountPaid?: number;
  amountWaived?: number;
  amountWrittenOff?: number;
  amountOutstanding: number;
  amountOrPercentage?: number;
  penalty: boolean;
  chargePaymentMode: {
    id: number;
    code: string;
    value: string;
  };
  paid: boolean;
  waived: boolean;
  chargePayable: boolean;
  dueDate?: string;
  submittedOnDate?: string;
}

export interface LoanCollateral {
  id?: number;
  clientCollateralId: number;
  name: string;
  quantity: number;
  value: number;
  unitPrice: number;
  totalValue: number;
  totalCollateralValue: number;
}

export interface LoanGuarantor {
  id?: number;
  loanId: number;
  clientRelationshipType: {
    id: number;
    name: string;
  };
  guarantorType: {
    id: number;
    code: string;
    value: string;
  };
  entityId?: number;
  firstname?: string;
  lastname?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  housePhoneNumber?: string;
  mobileNumber?: string;
  comment?: string;
  dob?: string;
  guaranteeAmount?: number;
  clientId?: number;
  savingsId?: number;
  existingClientId?: number;
  existingSavingsAccountId?: number;
}

export interface LoanDisbursementDetail {
  id?: number;
  expectedDisbursementDate: string;
  actualDisbursementDate?: string;
  principal: number;
  netDisbursalAmount?: number;
  loanChargeId?: number;
  chargeAmount?: number;
  waivedChargeAmount?: number;
}

// Core Loan Interface
export interface Loan {
  id: number;
  accountNo: string;
  externalId?: string;
  clientId: number;
  clientName: string;
  clientOfficeId: number;
  loanProductId: number;
  loanProductName: string;
  loanProductDescription?: string;
  fundId?: number;
  fundName?: string;
  loanOfficerId?: number;
  loanOfficerName?: string;
  loanType: {
    id: number;
    code: string;
    value: string;
  };
  currency: Currency;
  principal: number;
  approvedPrincipal: number;
  proposedPrincipal: number;
  termFrequency: number;
  termPeriodFrequencyType: {
    id: number;
    code: string;
    value: string;
  };
  numberOfRepayments: number;
  repaymentEvery: number;
  repaymentFrequencyType: {
    id: number;
    code: string;
    value: string;
  };
  interestRatePerPeriod: number;
  interestRateFrequencyType: {
    id: number;
    code: string;
    value: string;
  };
  annualInterestRate: number;
  isFloatingInterestRate: boolean;
  interestRateDifferential?: number;
  amortizationType: {
    id: number;
    code: string;
    value: string;
  };
  interestType: {
    id: number;
    code: string;
    value: string;
  };
  interestCalculationPeriodType: {
    id: number;
    code: string;
    value: string;
  };
  allowPartialPeriodInterestCalcualtion: boolean;
  transactionProcessingStrategyCode: string;
  transactionProcessingStrategyName: string;
  graceOnPrincipalPayment?: number;
  recurringMoratoriumOnPrincipalPeriods?: number;
  graceOnInterestPayment?: number;
  graceOnInterestCharged?: number;
  interestChargedFromDate?: string;
  expectedFirstRepaymentOnDate?: string;
  syncDisbursementWithMeeting?: boolean;
  timeline: LoanTimeline;
  summary: LoanSummary;
  repaymentSchedule?: LoanSchedule;
  transactions?: LoanTransaction[];
  charges?: LoanCharge[];
  collateral?: LoanCollateral[];
  guarantors?: LoanGuarantor[];
  linkedAccount?: any;
  disbursementDetails?: LoanDisbursementDetail[];
  status: {
    id: number;
    code: LoanStatus;
    value: string;
    pendingApproval: boolean;
    waitingForDisbursal: boolean;
    active: boolean;
    closedObligationsMet: boolean;
    closedWrittenOff: boolean;
    closedRescheduled: boolean;
    closed: boolean;
    overpaid: boolean;
  };
  createStandingInstructionAtDisbursement?: boolean;
  paidInAdvance?: {
    paidInAdvance: number;
  };
  isNPA: boolean;
  subStatus?: {
    id: number;
    code: string;
    value: string;
    active: boolean;
  };
  isTopup: boolean;
  closureLoanId?: number;
  topupAmount?: number;
  isEqualAmortization: boolean;
  accountNumberFormatted: string;
  inArrears: boolean;
  graceOnArrearsAgeing?: number;
  isChargedOff: boolean;
  delinquent?: {
    availableDaysForRepayment: number;
    pastDueDays: number;
    nextPaymentDueDate: string;
  };
}

export interface LoanProduct {
  id: number;
  name: string;
  shortName: string;
  description?: string;
  fundId?: number;
  fundName?: string;
  includeInBorrowerCycle: boolean;
  useBorrowerCycle: boolean;
  startDate?: string;
  closeDate?: string;
  status: string;
  currency: Currency;
  principal: number;
  minPrincipal?: number;
  maxPrincipal?: number;
  numberOfRepayments: number;
  minNumberOfRepayments?: number;
  maxNumberOfRepayments?: number;
  repaymentEvery: number;
  repaymentFrequencyType: {
    id: number;
    code: string;
    value: string;
  };
  interestRatePerPeriod: number;
  minInterestRatePerPeriod?: number;
  maxInterestRatePerPeriod?: number;
  interestRateFrequencyType: {
    id: number;
    code: string;
    value: string;
  };
  annualInterestRate: number;
  isLinkedToFloatingInterestRates: boolean;
  amortizationType: {
    id: number;
    code: string;
    value: string;
  };
  interestType: {
    id: number;
    code: string;
    value: string;
  };
  interestCalculationPeriodType: {
    id: number;
    code: string;
    value: string;
  };
  allowPartialPeriodInterestCalculation: boolean;
  transactionProcessingStrategyCode: string;
  transactionProcessingStrategyName: string;
  graceOnPrincipalPayment?: number;
  recurringMoratoriumOnPrincipalPeriods?: number;
  graceOnInterestPayment?: number;
  graceOnInterestCharged?: number;
  graceOnArrearsAgeing?: number;
  overdueDaysForNPA?: number;
  minimumDaysBetweenDisbursalAndFirstRepayment?: number;
  holdGuaranteeFunds: boolean;
  principalThresholdForLastInstallment?: number;
  accountMovingsOutOfNPAOnlyOnArrearsCompletion: boolean;
  canDefineInstallmentAmount: boolean;
  installmentAmountInMultiplesOf?: number;
  multiDisburseLoan: boolean;
  maxTrancheCount?: number;
  outstandingLoanBalance?: number;
  daysInMonthType: {
    id: number;
    code: string;
    value: string;
  };
  daysInYearType: {
    id: number;
    code: string;
    value: string;
  };
  isInterestRecalculationEnabled: boolean;
  allowVariableInstallments: boolean;
  minimumGap?: number;
  maximumGap?: number;
  canUseForTopup: boolean;
  isEqualAmortization: boolean;
  enableDownPayment: boolean;
  disbursedAmountPercentageForDownPayment?: number;
  enableAutoRepaymentForDownPayment: boolean;
  repaymentStartDateType?: {
    id: number;
    code: string;
    value: string;
  };
  disallowExpectedDisbursements: boolean;
  allowApprovedDisbursedAmountsOverApplied: boolean;
  overAppliedCalculationType?: string;
  overAppliedNumber?: number;
}

// Request/Response Types
export interface LoanSearchParams {
  search?: string;
  officeId?: number;
  loanOfficerId?: number;
  loanProductId?: number;
  clientId?: number;
  groupId?: number;
  centerId?: number;
  status?: LoanStatus;
  offset?: number;
  limit?: number;
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  orphansOnly?: boolean;
  isSelfUser?: boolean;
}

export interface CreateLoanApplicationRequest {
  clientId: number;
  productId: number;
  principal: number;
  loanTermFrequency: number;
  loanTermFrequencyType: number;
  loanType: string;
  numberOfRepayments: number;
  repaymentEvery: number;
  repaymentFrequencyType: number;
  interestRatePerPeriod: number;
  amortizationType: number;
  interestType: number;
  interestCalculationPeriodType: number;
  transactionProcessingStrategyCode: string;
  expectedDisbursementDate: string;
  submittedOnDate: string;
  linkAccountId?: number;
  createStandingInstructionAtDisbursement?: boolean;
  isTopup?: boolean;
  loanIdToClose?: number;
  topupAmount?: number;
  disbursementData?: LoanDisbursementDetail[];
  collateral?: LoanCollateral[];
  charges?: any[];
  productOptions?: any[];
  locale: string;
  dateFormat: string;
}

export interface UpdateLoanApplicationRequest extends Partial<CreateLoanApplicationRequest> {
  // All fields are optional for updates
}

export interface LoanApprovalRequest {
  approvedOnDate: string;
  approvedLoanAmount?: number;
  expectedDisbursementDate?: string;
  locale: string;
  dateFormat: string;
  note?: string;
}

export interface LoanDisbursementRequest {
  actualDisbursementDate: string;
  transactionAmount?: number;
  fixedEmiAmount?: number;
  paymentTypeId?: number;
  accountNumber?: string;
  checkNumber?: string;
  routingCode?: string;
  receiptNumber?: string;
  bankNumber?: string;
  locale: string;
  dateFormat: string;
  note?: string;
}

export interface LoanRepaymentRequest {
  transactionDate: string;
  transactionAmount: number;
  paymentTypeId?: number;
  accountNumber?: string;
  checkNumber?: string;
  routingCode?: string;
  receiptNumber?: string;
  bankNumber?: string;
  locale: string;
  dateFormat: string;
  note?: string;
}

// Template and Option Types
export interface LoanApplicationTemplate {
  clientId?: number;
  clientName?: string;
  clientOfficeId?: number;
  timeline?: {
    expectedDisbursementDate?: string;
  };
  productOptions: LoanProduct[];
  loanOfficerOptions?: Array<{
    id: number;
    firstname: string;
    lastname: string;
    displayName: string;
    isLoanOfficer: boolean;
    isActive: boolean;
  }>;
  fundOptions?: Array<{
    id: number;
    name: string;
  }>;
  loanPurposeOptions?: Array<{
    id: number;
    name: string;
  }>;
  loanCollateralOptions?: Array<{
    id: number;
    name: string;
    quality: string;
    liquidationValue: number;
    pctToBase: number;
    currency: Currency;
  }>;
  calendarOptions?: any[];
  syncDisbursementWithMeeting?: boolean;
  loanCounter: number;
  loanProductCounter: number;
  notes?: any[];
  accountLinkingOptions?: any[];
  product?: LoanProduct;
}

// Statistics and Analytics
export interface LoanStats {
  totalLoans: number;
  activeLoans: number;
  pendingApprovalLoans: number;
  disbursedLoans: number;
  closedLoans: number;
  overdueLoans: number;
  totalLoanPortfolio: number;
  totalOutstandingAmount: number;
  totalOverdueAmount: number;
  averageLoanSize: number;
  portfolioAtRisk: number;
}

// Utility Types
export type LoanFormData = CreateLoanApplicationRequest;
export type LoanUpdateFormData = UpdateLoanApplicationRequest;
