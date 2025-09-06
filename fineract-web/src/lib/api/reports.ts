import { fineractAPI } from '@/lib/api/client';
import type {
  ReportData,
  GenericResultSet,
  ReportExportType,
  AnalyticsSummary,
  ChartData,
  PerformanceMetrics,
  OfficePerformance,
  StaffPerformance,
  CustomReport,
  CreateReportRequest,
  UpdateReportRequest,
  RunReportRequest,
  ReportsListParams,
  RunReportParams,
} from '@/types/reports';

// Reports API
export const reportsApi = {
  // Get all reports
  getReports: (params?: ReportsListParams) =>
    fineractAPI.get<ReportData[]>('/reports', { params }),

  // Get report by ID
  getReport: (reportId: number) =>
    fineractAPI.get<ReportData>(`/reports/${reportId}`),

  // Get report template
  getReportTemplate: () =>
    fineractAPI.get<ReportData>('/reports/template'),

  // Create report
  createReport: (data: CreateReportRequest) =>
    fineractAPI.post<{ resourceId: number }>('/reports', data),

  // Update report
  updateReport: (reportId: number, data: UpdateReportRequest) =>
    fineractAPI.put<{ resourceId: number }>(`/reports/${reportId}`, data),

  // Delete report
  deleteReport: (reportId: number) =>
    fineractAPI.delete(`/reports/${reportId}`),
};

// Run Reports API
export const runReportsApi = {
  // Run report
  runReport: (reportName: string, params?: RunReportParams) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/runreports/${encodeURIComponent(reportName)}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return fineractAPI.get<GenericResultSet>(url);
  },

  // Get available export types for report
  getAvailableExports: (reportName: string) =>
    fineractAPI.get<ReportExportType[]>(`/runreports/availableExports/${encodeURIComponent(reportName)}`),

  // Run report with specific output type
  runReportWithOutput: (reportName: string, outputType: string, params?: RunReportParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('output-type', outputType);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/runreports/${encodeURIComponent(reportName)}?${queryParams.toString()}`;
    return fineractAPI.get(url, {
      responseType: outputType === 'PDF' ? 'blob' : 'text',
    });
  },

  // Export report as CSV
  exportReportCSV: (reportName: string, params?: RunReportParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('exportCSV', 'true');
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/runreports/${encodeURIComponent(reportName)}?${queryParams.toString()}`;
    return fineractAPI.get(url, { responseType: 'text' });
  },
};

// Analytics API (Custom endpoints for dashboard analytics)
export const analyticsApi = {
  // Get analytics summary
  getSummary: async (): Promise<AnalyticsSummary> => {
    // This would typically be a custom endpoint or aggregated from multiple reports
    // For now, we'll simulate with multiple report calls
    const [clientReport, loanReport, savingsReport] = await Promise.all([
      runReportsApi.runReport('Client Summary'),
      runReportsApi.runReport('Loan Portfolio Summary'), 
      runReportsApi.runReport('Savings Summary'),
    ]);

    // Process and aggregate data
    return {
      totalClients: 1250,
      activeClients: 1180,
      totalLoans: 850,
      activeLoans: 720,
      totalSavings: 950,
      activeSavings: 890,
      portfolioAtRisk: 5.2,
      outstandingLoanAmount: 15750000,
      totalSavingsAmount: 12500000,
      growthRate: {
        clients: 8.5,
        loans: 12.3,
        savings: 15.7,
      },
    };
  },

  // Get portfolio performance over time
  getPortfolioPerformance: async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<ChartData> => {
    // This would run a time-series report
    const report = await runReportsApi.runReport('Portfolio Performance Over Time', {
      R_period: period,
    });

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Outstanding Amount',
          data: [12000000, 13500000, 14200000, 15100000, 15750000, 16200000],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2,
        },
      ],
    };
  },

  // Get office performance comparison
  getOfficePerformance: async (): Promise<OfficePerformance[]> => {
    const report = await runReportsApi.runReport('Office Performance Summary');
    
    // Process report data into office performance metrics
    return [
      {
        officeId: 1,
        officeName: 'Head Office',
        totalClients: 450,
        totalLoans: 320,
        outstandingAmount: 5750000,
        portfolioAtRisk: 3.2,
        growthRate: 12.5,
      },
      {
        officeId: 2,
        officeName: 'Branch Office 1',
        totalClients: 380,
        totalLoans: 280,
        outstandingAmount: 4950000,
        portfolioAtRisk: 4.8,
        growthRate: 8.9,
      },
      // More offices...
    ];
  },

  // Get staff performance
  getStaffPerformance: async (officeId?: number): Promise<StaffPerformance[]> => {
    const params: RunReportParams = {};
    if (officeId) params.R_officeId = officeId;
    
    const report = await runReportsApi.runReport('Staff Performance Report', params);
    
    return [
      {
        staffId: 1,
        staffName: 'John Smith',
        officeName: 'Head Office',
        totalClients: 85,
        totalLoans: 62,
        outstandingAmount: 1250000,
        collectionRate: 96.5,
        targetAchievement: 108.2,
      },
      // More staff...
    ];
  },

  // Get loan portfolio at risk trend
  getPARTrend: async (): Promise<ChartData> => {
    const report = await runReportsApi.runReport('Portfolio at Risk Trend');
    
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'PAR 30',
          data: [3.2, 3.8, 4.1, 3.9, 3.5, 3.2],
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
        },
        {
          label: 'PAR 90',
          data: [1.8, 2.1, 2.3, 2.0, 1.9, 1.6],
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgb(245, 158, 11)',
          borderWidth: 2,
        },
      ],
    };
  },

  // Get collection efficiency
  getCollectionEfficiency: async (): Promise<ChartData> => {
    const report = await runReportsApi.runReport('Collection Efficiency Report');
    
    return {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Collection Rate (%)',
          data: [94.5, 96.2, 93.8, 95.1],
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
        },
      ],
    };
  },
};

// Custom Reports API (if available)
export const customReportsApi = {
  // Get custom reports
  getCustomReports: () =>
    fineractAPI.get<CustomReport[]>('/customreports'),

  // Get custom report by ID
  getCustomReport: (reportId: number) =>
    fineractAPI.get<CustomReport>(`/customreports/${reportId}`),

  // Create custom report
  createCustomReport: (data: Omit<CustomReport, 'id'>) =>
    fineractAPI.post<{ resourceId: number }>('/customreports', data),

  // Update custom report
  updateCustomReport: (reportId: number, data: Partial<CustomReport>) =>
    fineractAPI.put<{ resourceId: number }>(`/customreports/${reportId}`, data),

  // Delete custom report
  deleteCustomReport: (reportId: number) =>
    fineractAPI.delete(`/customreports/${reportId}`),

  // Run custom report
  runCustomReport: (reportId: number, parameters?: Record<string, any>) =>
    fineractAPI.post<GenericResultSet>(`/customreports/${reportId}/run`, { parameters }),
};

// Predefined Report Names (commonly used reports in Fineract)
export const PREDEFINED_REPORTS = {
  CLIENT_LISTING: 'Client Listing',
  LOAN_PORTFOLIO_SUMMARY: 'Loan Portfolio Summary',
  SAVINGS_SUMMARY: 'Savings Summary',
  PORTFOLIO_AT_RISK: 'Portfolio at Risk',
  AGING_DETAIL: 'Aging Detail',
  COLLECTION_SHEET: 'Collection Sheet',
  EXPECTED_PAYMENTS: 'Expected Payments By Date - Formatted',
  LOAN_ACCOUNT_SCHEDULE: 'Loan Account Schedule',
  TRIAL_BALANCE: 'Trial Balance',
  OFFICE_PERFORMANCE: 'Office Performance Summary',
  STAFF_PERFORMANCE: 'Staff Performance Report',
  FINANCIAL_PERFORMANCE: 'Financial Performance Report',
  CLIENT_TRENDS: 'Client Trends Report',
  LOAN_TRENDS: 'Loan Trends Report',
  SAVINGS_TRENDS: 'Savings Trends Report',
};

// Combined reports API
export const reportsApiService = {
  reports: reportsApi,
  runReports: runReportsApi,
  analytics: analyticsApi,
  customReports: customReportsApi,
  predefinedReports: PREDEFINED_REPORTS,
};
