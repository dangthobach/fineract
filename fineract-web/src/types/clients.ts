export interface Client {
  id: number;
  accountNo: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  active: boolean;
  activationDate?: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  displayName: string;
  fullname: string;
  mobileNo?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  gender?: {
    id: number;
    name: string;
    active: boolean;
  };
  clientType?: {
    id: number;
    name: string;
    active: boolean;
  };
  clientClassification?: {
    id: number;
    name: string;
    active: boolean;
  };
  isStaff: boolean;
  officeId: number;
  officeName: string;
  transferToOfficeId?: number;
  transferToOfficeName?: string;
  imageId?: number;
  imagePresent: boolean;
  staffId?: number;
  staffName?: string;
  timeline: {
    submittedOnDate: string;
    submittedByUsername?: string;
    submittedByFirstname?: string;
    submittedByLastname?: string;
    activatedOnDate?: string;
    activatedByUsername?: string;
    activatedByFirstname?: string;
    activatedByLastname?: string;
    closedOnDate?: string;
    closedByUsername?: string;
    closedByFirstname?: string;
    closedByLastname?: string;
  };
  savingsProductId?: number;
  savingsProductName?: string;
  savingsAccountId?: number;
  clientNonPersonDetails?: {
    constitution: {
      id: number;
      name: string;
    };
    mainBusinessLine: {
      id: number;
      name: string;
    };
  };
  address?: ClientAddress[];
  familyMembers?: FamilyMember[];
  clientCollaterals?: ClientCollateral[];
  groups?: ClientGroup[];
}

export interface ClientAddress {
  id?: number;
  clientId: number;
  addressType?: {
    id: number;
    name: string;
  };
  street?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  townVillage?: string;
  city?: string;
  countyDistrict?: string;
  stateProvinceId?: number;
  countryId?: number;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  createdBy?: string;
  createdOn?: string;
  updatedBy?: string;
  updatedOn?: string;
}

export interface FamilyMember {
  id?: number;
  clientId: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  qualification?: string;
  age?: number;
  isDependent: boolean;
  relationshipId: number;
  relationship?: {
    id: number;
    name: string;
  };
  genderId?: number;
  gender?: {
    id: number;
    name: string;
  };
  professionId?: number;
  profession?: {
    id: number;
    name: string;
  };
  maritalStatusId?: number;
  maritalStatus?: {
    id: number;
    name: string;
  };
  dateOfBirth?: string;
  mobileNumber?: string;
}

export interface ClientCollateral {
  id: number;
  name: string;
  clientCollateralId: number;
  quantity: number;
  total: number;
  totalCollateral: number;
  unitPrice: number;
}

export interface ClientGroup {
  id: number;
  name: string;
  accountNo: string;
  officeId: number;
  officeName: string;
  hierarchy?: string;
}

export interface ClientSearchParams {
  search?: string;
  officeId?: number;
  staffId?: number;
  offset?: number;
  limit?: number;
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: {
    [key: string]: any;
  };
}

export interface CreateClientRequest {
  officeId: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname?: string;
  displayName?: string;
  mobileNo?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  genderId?: number;
  clientTypeId?: number;
  clientClassificationId?: number;
  staffId?: number;
  active?: boolean;
  activationDate?: string;
  submittedOnDate: string;
  savingsProductId?: number;
  legalFormId?: number;
  address?: Omit<ClientAddress, 'id' | 'clientId'>[];
  familyMembers?: Omit<FamilyMember, 'id' | 'clientId'>[];
  clientNonPersonDetails?: {
    constitutionId?: number;
    mainBusinessLineId?: number;
    remarks?: string;
    incorpNumber?: string;
    incorpValidityTillDate?: string;
  };
}

export interface UpdateClientRequest {
  firstname?: string;
  middlename?: string;
  lastname?: string;
  fullname?: string;
  displayName?: string;
  mobileNo?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  genderId?: number;
  clientTypeId?: number;
  clientClassificationId?: number;
  staffId?: number;
  address?: (Omit<ClientAddress, 'clientId'> & { id?: number })[];
  familyMembers?: (Omit<FamilyMember, 'clientId'> & { id?: number })[];
}

export interface ClientTemplate {
  officeOptions: Array<{
    id: number;
    name: string;
    nameDecorated: string;
  }>;
  staffOptions?: Array<{
    id: number;
    firstname: string;
    lastname: string;
    displayName: string;
    isLoanOfficer: boolean;
    isActive: boolean;
  }>;
  genderOptions: Array<{
    id: number;
    name: string;
    active: boolean;
  }>;
  clientTypeOptions: Array<{
    id: number;
    name: string;
    active: boolean;
  }>;
  clientClassificationOptions: Array<{
    id: number;
    name: string;
    active: boolean;
  }>;
  clientNonPersonConstitutionOptions?: Array<{
    id: number;
    name: string;
    active: boolean;
  }>;
  clientNonPersonMainBusinessLineOptions?: Array<{
    id: number;
    name: string;
    active: boolean;
  }>;
  savingProductOptions?: Array<{
    id: number;
    name: string;
    withdrawalFeeForTransfers: boolean;
    allowOverdraft: boolean;
  }>;
  addressTypeOptions?: Array<{
    id: number;
    name: string;
  }>;
  stateProvinceOptions?: Array<{
    id: number;
    name: string;
  }>;
  countryOptions?: Array<{
    id: number;
    name: string;
  }>;
}

export interface ClientAccountsSummary {
  loanAccounts: LoanAccount[];
  savingsAccounts: SavingsAccount[];
  shareAccounts?: ShareAccount[];
}

export interface LoanAccount {
  id: number;
  accountNo: string;
  productId: number;
  productName: string;
  shortProductName: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  accountBalance?: number;
  amountPaid?: number;
  totalOutstanding?: number;
}

export interface SavingsAccount {
  id: number;
  accountNo: string;
  productId: number;
  productName: string;
  shortProductName: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  accountBalance?: number;
  lastActiveTransactionDate?: string;
}

export interface ShareAccount {
  id: number;
  accountNo: string;
  productId: number;
  productName: string;
  status: {
    id: number;
    code: string;
    value: string;
  };
  totalApprovedShares?: number;
  totalPendingForApprovalShares?: number;
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  pendingClients: number;
  closedClients: number;
  totalLoanPortfolio: number;
  totalSavingsBalance: number;
}

// Utility types for forms
export type ClientFormData = CreateClientRequest;
export type ClientUpdateFormData = UpdateClientRequest;
