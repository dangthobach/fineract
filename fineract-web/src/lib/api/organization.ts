import { fineractAPI } from '@/lib/api/client';
import type {
  Office,
  Staff,
  Teller,
  Cashier,
  Holiday,
  WorkingDay,
  Currency,
  PaymentType,
  Fund,
  CreateOfficeRequest,
  CreateStaffRequest,
  CreateTellerRequest,
  CreateCashierRequest,
  CreateHolidayRequest,
  UpdateWorkingDaysRequest,
  CreatePaymentTypeRequest,
  CreateFundRequest,
  OfficesListParams,
  StaffListParams,
  TellersListParams,
  HolidaysListParams,
} from '@/types/organization';

// Offices API
export const officesApi = {
  // Get all offices
  getOffices: (params?: OfficesListParams) =>
    fineractAPI.get<Office[]>('/offices', { params }),

  // Get office by ID
  getOffice: (officeId: number) =>
    fineractAPI.get<Office>(`/offices/${officeId}`),

  // Create office
  createOffice: (data: CreateOfficeRequest) =>
    fineractAPI.post<{ officeId: number }>('/offices', data),

  // Update office
  updateOffice: (officeId: number, data: Partial<CreateOfficeRequest>) =>
    fineractAPI.put<{ officeId: number }>(`/offices/${officeId}`, data),

  // Get office template
  getOfficeTemplate: () =>
    fineractAPI.get<{ allowedParents: Office[] }>('/offices/template'),
};

// Staff API
export const staffApi = {
  // Get all staff
  getStaff: (params?: StaffListParams) =>
    fineractAPI.get<Staff[]>('/staff', { params }),

  // Get staff by ID
  getStaffById: (staffId: number) =>
    fineractAPI.get<Staff>(`/staff/${staffId}`),

  // Create staff
  createStaff: (data: CreateStaffRequest) =>
    fineractAPI.post<{ resourceId: number }>('/staff', data),

  // Update staff
  updateStaff: (staffId: number, data: Partial<CreateStaffRequest>) =>
    fineractAPI.put<{ resourceId: number }>(`/staff/${staffId}`, data),

  // Upload staff image
  uploadStaffImage: (staffId: number, formData: FormData) =>
    fineractAPI.post(`/staff/${staffId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete staff image
  deleteStaffImage: (staffId: number) =>
    fineractAPI.delete(`/staff/${staffId}/images`),
};

// Tellers API
export const tellersApi = {
  // Get all tellers
  getTellers: (params?: TellersListParams) =>
    fineractAPI.get<Teller[]>('/tellers', { params }),

  // Get teller by ID
  getTeller: (tellerId: number) =>
    fineractAPI.get<Teller>(`/tellers/${tellerId}`),

  // Create teller
  createTeller: (data: CreateTellerRequest) =>
    fineractAPI.post<{ tellerId: number }>('/tellers', data),

  // Update teller
  updateTeller: (tellerId: number, data: Partial<CreateTellerRequest>) =>
    fineractAPI.put<{ tellerId: number }>(`/tellers/${tellerId}`, data),

  // Delete teller
  deleteTeller: (tellerId: number) =>
    fineractAPI.delete(`/tellers/${tellerId}`),

  // Get teller cashiers
  getTellerCashiers: (tellerId: number) =>
    fineractAPI.get<Cashier[]>(`/tellers/${tellerId}/cashiers`),

  // Get cashier by ID
  getCashier: (tellerId: number, cashierId: number) =>
    fineractAPI.get<Cashier>(`/tellers/${tellerId}/cashiers/${cashierId}`),

  // Create cashier
  createCashier: (data: CreateCashierRequest) =>
    fineractAPI.post<{ resourceId: number }>('/tellers/cashiers', data),

  // Update cashier
  updateCashier: (tellerId: number, cashierId: number, data: Partial<CreateCashierRequest>) =>
    fineractAPI.put<{ resourceId: number }>(`/tellers/${tellerId}/cashiers/${cashierId}`, data),

  // Delete cashier
  deleteCashier: (tellerId: number, cashierId: number) =>
    fineractAPI.delete(`/tellers/${tellerId}/cashiers/${cashierId}`),

  // Allocate cashier
  allocateCashier: (tellerId: number, cashierId: number) =>
    fineractAPI.post(`/tellers/${tellerId}/cashiers/${cashierId}?command=allocate`),

  // Settle cashier
  settleCashier: (tellerId: number, cashierId: number, data: { currencyCode: string; txnAmount: number }) =>
    fineractAPI.post(`/tellers/${tellerId}/cashiers/${cashierId}?command=settle`, data),
};

// Holidays API
export const holidaysApi = {
  // Get all holidays
  getHolidays: (params?: HolidaysListParams) =>
    fineractAPI.get<Holiday[]>('/holidays', { params }),

  // Get holiday by ID
  getHoliday: (holidayId: number) =>
    fineractAPI.get<Holiday>(`/holidays/${holidayId}`),

  // Create holiday
  createHoliday: (data: CreateHolidayRequest) =>
    fineractAPI.post<{ resourceId: number }>('/holidays', data),

  // Update holiday
  updateHoliday: (holidayId: number, data: Partial<CreateHolidayRequest>) =>
    fineractAPI.put<{ resourceId: number }>(`/holidays/${holidayId}`, data),

  // Delete holiday
  deleteHoliday: (holidayId: number) =>
    fineractAPI.delete(`/holidays/${holidayId}`),

  // Activate holiday
  activateHoliday: (holidayId: number) =>
    fineractAPI.post(`/holidays/${holidayId}?command=activate`),
};

// Working Days API
export const workingDaysApi = {
  // Get working days
  getWorkingDays: () =>
    fineractAPI.get<WorkingDay[]>('/workingdays'),

  // Update working days
  updateWorkingDays: (data: UpdateWorkingDaysRequest) =>
    fineractAPI.put('/workingdays', data),
};

// Currencies API
export const currenciesApi = {
  // Get permitted currencies
  getPermittedCurrencies: () =>
    fineractAPI.get<{ permitted: Currency[]; selected: Currency[] }>('/currencies'),

  // Update permitted currencies
  updatePermittedCurrencies: (currencies: string[]) =>
    fineractAPI.put('/currencies', { currencies }),
};

// Payment Types API
export const paymentTypesApi = {
  // Get all payment types
  getPaymentTypes: () =>
    fineractAPI.get<PaymentType[]>('/paymenttypes'),

  // Get payment type by ID
  getPaymentType: (paymentTypeId: number) =>
    fineractAPI.get<PaymentType>(`/paymenttypes/${paymentTypeId}`),

  // Create payment type
  createPaymentType: (data: CreatePaymentTypeRequest) =>
    fineractAPI.post<{ resourceId: number }>('/paymenttypes', data),

  // Update payment type
  updatePaymentType: (paymentTypeId: number, data: Partial<CreatePaymentTypeRequest>) =>
    fineractAPI.put<{ resourceId: number }>(`/paymenttypes/${paymentTypeId}`, data),

  // Delete payment type
  deletePaymentType: (paymentTypeId: number) =>
    fineractAPI.delete(`/paymenttypes/${paymentTypeId}`),
};

// Funds API
export const fundsApi = {
  // Get all funds
  getFunds: () =>
    fineractAPI.get<Fund[]>('/funds'),

  // Get fund by ID
  getFund: (fundId: number) =>
    fineractAPI.get<Fund>(`/funds/${fundId}`),

  // Create fund
  createFund: (data: CreateFundRequest) =>
    fineractAPI.post<{ resourceId: number }>('/funds', data),

  // Update fund
  updateFund: (fundId: number, data: Partial<CreateFundRequest>) =>
    fineractAPI.put<{ resourceId: number }>(`/funds/${fundId}`, data),

  // Delete fund
  deleteFund: (fundId: number) =>
    fineractAPI.delete(`/funds/${fundId}`),
};

// Combined organization API
export const organizationApi = {
  offices: officesApi,
  staff: staffApi,
  tellers: tellersApi,
  holidays: holidaysApi,
  workingDays: workingDaysApi,
  currencies: currenciesApi,
  paymentTypes: paymentTypesApi,
  funds: fundsApi,
};
