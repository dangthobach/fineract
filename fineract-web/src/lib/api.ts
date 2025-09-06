// Main API Export
// Re-export the API client and all API services for easy importing

// Core API Client
export { fineractAPI as api, FineractAPIClient, apiClient, buildQueryParams, uploadFile } from './api/client'

// Client Management APIs
export * from './api/clients'

// Loan Management APIs  
export * from './api/loans'

// Savings Management APIs (includes SavingsAccountsApi and SavingsProductsApi)
export * from './api/savings'

// Organization Management APIs
export * from './api/offices'
export * from './api/staff'

// Product Management APIs  
export * from './api/loan-products'

// Charge Management APIs
export * from './api/charges'

// User Administration APIs
export * from './api/users'

// System Configuration APIs
export * from './api/configuration'
