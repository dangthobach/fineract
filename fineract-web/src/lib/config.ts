// Application Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.FINERACT_API_URL || 'https://localhost:8443/fineract-provider/api/v1',
    tenantId: process.env.FINERACT_TENANT_ID || 'default',
    timeout: 30000, // 30 seconds
  },

  // Authentication
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshTokenThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    maxPageSize: 500,
  },

  // File upload limits
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },

  // Currency and locale settings
  locale: {
    defaultCurrency: 'USD',
    defaultLocale: 'en-US',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'KES', 'NGN', 'ZAR'],
  },

  // Date formats
  dateFormats: {
    display: 'MMM dd, yyyy',
    input: 'yyyy-MM-dd',
    datetime: 'MMM dd, yyyy HH:mm',
    api: 'dd MMMM yyyy',
  },

  // Feature flags
  features: {
    enableDarkMode: true,
    enableNotifications: true,
    enableAdvancedSearch: true,
    enableBulkOperations: true,
    enableDataExport: true,
  },

  // Query configurations for TanStack Query
  queryConfig: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    retry: 3,
  },

  // Navigation menu items
  navigation: {
    main: [
      { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'Clients', href: '/clients', icon: 'Users' },
      { name: 'Groups', href: '/groups', icon: 'Users' },
      { name: 'Centers', href: '/centers', icon: 'Building' },
      { name: 'Loans', href: '/loans', icon: 'CreditCard' },
      { name: 'Savings', href: '/savings', icon: 'PiggyBank' },
      { name: 'Fixed Deposits', href: '/fixed-deposits', icon: 'Landmark' },
      { name: 'Recurring Deposits', href: '/recurring-deposits', icon: 'RotateCcw' },
      { name: 'Shares', href: '/shares', icon: 'TrendingUp' },
      { name: 'Accounting', href: '/accounting', icon: 'Calculator' },
      { name: 'Reports', href: '/reports', icon: 'FileText' },
      { name: 'Admin', href: '/admin', icon: 'Settings' },
    ],
    admin: [
      { name: 'Organization', href: '/admin/organization', icon: 'Building2' },
      { name: 'Users', href: '/admin/users', icon: 'UserCog' },
      { name: 'Roles & Permissions', href: '/admin/roles', icon: 'Shield' },
      { name: 'Products', href: '/admin/products', icon: 'Package' },
      { name: 'Offices', href: '/admin/offices', icon: 'MapPin' },
      { name: 'Employees', href: '/admin/employees', icon: 'UserCheck' },
      { name: 'Data Tables', href: '/admin/datatables', icon: 'Table' },
      { name: 'System Configuration', href: '/admin/system', icon: 'Cog' },
    ],
  },
} as const;

// Type definitions for configuration
export type Config = typeof config;
export type NavigationItem = (typeof config.navigation.main)[0];
export type SupportedCurrency = (typeof config.locale.supportedCurrencies)[number];
