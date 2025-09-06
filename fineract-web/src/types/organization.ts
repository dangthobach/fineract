// Organization Management Types
export interface Office {
  id: number;
  name: string;
  nameDecorated?: string;
  externalId?: string;
  openingDate: string;
  hierarchy?: string;
  parentId?: number;
  parentName?: string;
  allowedParents?: Office[];
  children?: Office[];
}

export interface Staff {
  id: number;
  firstname: string;
  lastname: string;
  displayName: string;
  officeId: number;
  officeName: string;
  isLoanOfficer: boolean;
  isActive: boolean;
  joiningDate?: string;
  externalId?: string;
  mobileNo?: string;
  emailAddress?: string;
  organisationalRoleType?: OrganisationalRoleType;
  organisationalRoleParentStaff?: Staff;
  image?: StaffImage;
}

export interface StaffImage {
  id: number;
  location?: string;
  storageType?: string;
}

export interface OrganisationalRoleType {
  id: number;
  code: string;
  value: string;
}

export interface Teller {
  id: number;
  name: string;
  description?: string;
  officeId: number;
  officeName: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  creditAccountId: number;
  creditAccountName: string;
  debitAccountId: number;
  debitAccountName: string;
  cashiers?: Cashier[];
}

export interface Cashier {
  id: number;
  tellerId: number;
  tellerName: string;
  staffId: number;
  staffName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isFullDay: boolean;
  hourStartTime?: string;
  hourEndTime?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Holiday {
  id: number;
  name: string;
  description?: string;
  fromDate: string;
  toDate: string;
  repaymentsRescheduledTo?: string;
  offices: Office[];
  reschedulingType: RepaymentReschedulingType;
  processed: boolean;
}

export interface RepaymentReschedulingType {
  id: number;
  code: string;
  value: string;
}

export interface WorkingDay {
  id: number;
  dayOfWeekType: DayOfWeekType;
  isMorningSession: boolean;
  isAfternoonSession: boolean;
  isEveningSession: boolean;
}

export interface DayOfWeekType {
  id: number;
  code: string;
  value: string;
}

export interface Currency {
  code: string;
  name: string;
  decimalPlaces: number;
  inMultiplesOf?: number;
  displaySymbol?: string;
  nameCode: string;
  displayLabel: string;
}

export interface PaymentType {
  id: number;
  name: string;
  description?: string;
  isCashPayment: boolean;
  position: number;
  codeName?: string;
  isSystemDefined: boolean;
}

export interface Fund {
  id: number;
  name: string;
  externalId?: string;
  accountNumber?: string;
}

// API Request types
export interface CreateOfficeRequest {
  name: string;
  parentId?: number;
  externalId?: string;
  openingDate: string;
  dateFormat: string;
  locale: string;
}

export interface CreateStaffRequest {
  firstname: string;
  lastname: string;
  officeId: number;
  isLoanOfficer: boolean;
  isActive: boolean;
  joiningDate?: string;
  externalId?: string;
  mobileNo?: string;
  emailAddress?: string;
  dateFormat?: string;
  locale?: string;
}

export interface CreateTellerRequest {
  name: string;
  description?: string;
  officeId: number;
  startDate: string;
  endDate?: string;
  creditAccountId: number;
  debitAccountId: number;
  dateFormat: string;
  locale: string;
}

export interface CreateCashierRequest {
  tellerId: number;
  staffId: number;
  description?: string;
  startDate: string;
  endDate?: string;
  isFullDay: boolean;
  hourStartTime?: string;
  hourEndTime?: string;
  dateFormat: string;
  locale: string;
}

export interface CreateHolidayRequest {
  name: string;
  description?: string;
  fromDate: string;
  toDate: string;
  repaymentsRescheduledTo?: string;
  offices: number[];
  reschedulingType: number;
  dateFormat: string;
  locale: string;
}

export interface UpdateWorkingDaysRequest {
  workingDays: {
    dayOfWeekType: number;
    isMorningSession: boolean;
    isAfternoonSession: boolean;
    isEveningSession: boolean;
  }[];
  locale: string;
}

export interface CreatePaymentTypeRequest {
  name: string;
  description?: string;
  isCashPayment: boolean;
  position?: number;
}

export interface CreateFundRequest {
  name: string;
  externalId?: string;
  accountNumber?: string;
}

// List params
export interface OfficesListParams {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface StaffListParams {
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  loanOfficersOnly?: boolean;
  status?: 'all' | 'active' | 'inactive';
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TellersListParams {
  officeId?: number;
  dateFormat?: string;
  locale?: string;
}

export interface HolidaysListParams {
  officeId?: number;
  fromDate?: string;
  toDate?: string;
  locale?: string;
  dateFormat?: string;
}
