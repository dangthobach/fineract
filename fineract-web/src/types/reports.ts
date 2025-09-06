// Reports & Analytics Types
export interface ReportData {
  id: number;
  reportName: string;
  reportType: string;
  reportSubType?: string;
  reportCategory: string;
  description?: string;
  reportSql?: string;
  coreReport: boolean;
  useReport: boolean;
  reportParameters?: ReportParameter[];
  allowedParameters?: ReportParameterOption[];
  reportTypes?: string[];
}

export interface ReportParameter {
  id: number;
  parameterId?: number;
  reportId: number;
  parameterName: string;
  parameterVariable: string;
  parameterLabel?: string;
  parameterDisplayType: string;
  parameterFormatType?: string;
  parameterDefault?: string;
  selectOne?: string;
  selectAll?: string;
  parameterSql?: string;
  parentParameterName?: string;
}

export interface ReportParameterOption {
  id: number;
  parameterName: string;
  parameterNameValue: string;
}

export interface GenericResultSet {
  columnHeaders: ColumnHeader[];
  data: any[][];
}

export interface ColumnHeader {
  columnName: string;
  columnType: string;
  columnLength?: number;
  columnDisplayType?: string;
  isColumnNullable?: boolean;
  isColumnPrimaryKey?: boolean;
  columnValues?: any[];
}

export interface ReportExportType {
  name: string;
  description?: string;
}

// Dashboard Analytics Types
export interface AnalyticsSummary {
  totalClients: number;
  activeClients: number;
  totalLoans: number;
  activeLoans: number;
  totalSavings: number;
  activeSavings: number;
  portfolioAtRisk: number;
  outstandingLoanAmount: number;
  totalSavingsAmount: number;
  growthRate: {
    clients: number;
    loans: number;
    savings: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface PerformanceMetrics {
  period: string;
  totalDisbursed: number;
  totalRepaid: number;
  portfolioAtRisk: number;
  operatingExpense: number;
  netIncome: number;
  roi: number;
}

export interface OfficePerformance {
  officeId: number;
  officeName: string;
  totalClients: number;
  totalLoans: number;
  outstandingAmount: number;
  portfolioAtRisk: number;
  growthRate: number;
}

export interface StaffPerformance {
  staffId: number;
  staffName: string;
  officeName: string;
  totalClients: number;
  totalLoans: number;
  outstandingAmount: number;
  collectionRate: number;
  targetAchievement: number;
}

// Custom Report Types
export interface CustomReport {
  id?: number;
  name: string;
  description?: string;
  category: string;
  sql: string;
  parameters: CustomReportParameter[];
  isActive: boolean;
  createdBy?: string;
  createdDate?: string;
}

export interface CustomReportParameter {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: { value: any; label: string }[];
}

// API Request types
export interface RunReportRequest {
  reportName: string;
  parameters?: Record<string, any>;
  outputType?: 'JSON' | 'CSV' | 'PDF' | 'XLS' | 'HTML';
  exportCSV?: boolean;
  parameterType?: boolean;
  locale?: string;
  dateFormat?: string;
}

export interface CreateReportRequest {
  reportName: string;
  reportType: string;
  reportSubType?: string;
  reportCategory: string;
  description?: string;
  reportSql?: string;
  coreReport?: boolean;
  useReport?: boolean;
}

export interface UpdateReportRequest extends Partial<CreateReportRequest> {}

// List params
export interface ReportsListParams {
  orderBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface RunReportParams {
  [key: string]: any;
  R_officeId?: number;
  R_loanOfficerId?: number;
  R_startDate?: string;
  R_endDate?: string;
  outputType?: 'JSON' | 'CSV' | 'PDF' | 'XLS' | 'HTML';
  exportCSV?: boolean;
  parameterType?: boolean;
  locale?: string;
  dateFormat?: string;
}
