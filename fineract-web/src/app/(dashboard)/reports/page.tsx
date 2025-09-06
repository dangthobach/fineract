'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { reportsApiService } from '@/lib/api/reports';
import type { ReportData, AnalyticsSummary, ChartData, OfficePerformance } from '@/types/reports';
import { 
  BarChart, 
  LineChart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Download,
  Play,
  Plus,
  Search
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [portfolioChart, setPortfolioChart] = useState<ChartData | null>(null);
  const [parTrendChart, setPARTrendChart] = useState<ChartData | null>(null);
  const [officePerformance, setOfficePerformance] = useState<OfficePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        reportsRes,
        analyticsData,
        portfolioData,
        parTrendData,
        officeData
      ] = await Promise.all([
        reportsApiService.reports.getReports(),
        reportsApiService.analytics.getSummary(),
        reportsApiService.analytics.getPortfolioPerformance(),
        reportsApiService.analytics.getPARTrend(),
        reportsApiService.analytics.getOfficePerformance(),
      ]);

      setReports(reportsRes);
      setAnalytics(analyticsData);
      setPortfolioChart(portfolioData);
      setPARTrendChart(parTrendData);
      setOfficePerformance(officeData);
    } catch (error) {
      console.error('Failed to load reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Report columns
  const reportColumns: ColumnDef<ReportData>[] = [
    {
      accessorKey: 'reportName',
      header: 'Report Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('reportName')}</div>
      ),
    },
    {
      accessorKey: 'reportCategory',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue('reportCategory')}</Badge>
      ),
    },
    {
      accessorKey: 'reportType',
      header: 'Type',
    },
    {
      accessorKey: 'coreReport',
      header: 'Core Report',
      cell: ({ row }) => (
        <Badge variant={row.getValue('coreReport') ? 'default' : 'secondary'}>
          {row.getValue('coreReport') ? 'Core' : 'Custom'}
        </Badge>
      ),
    },
    {
      accessorKey: 'useReport',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('useReport') ? 'default' : 'destructive'}>
          {row.getValue('useReport') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      ),
    },
  ];

  // Office Performance columns
  const officeColumns: ColumnDef<OfficePerformance>[] = [
    {
      accessorKey: 'officeName',
      header: 'Office',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('officeName')}</div>
      ),
    },
    {
      accessorKey: 'totalClients',
      header: 'Clients',
    },
    {
      accessorKey: 'totalLoans',
      header: 'Loans',
    },
    {
      accessorKey: 'outstandingAmount',
      header: 'Outstanding',
      cell: ({ row }) => {
        const amount = row.getValue('outstandingAmount') as number;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
      },
    },
    {
      accessorKey: 'portfolioAtRisk',
      header: 'PAR %',
      cell: ({ row }) => {
        const par = row.getValue('portfolioAtRisk') as number;
        const variant = par > 5 ? 'destructive' : par > 3 ? 'secondary' : 'default';
        return <Badge variant={variant}>{par.toFixed(1)}%</Badge>;
      },
    },
    {
      accessorKey: 'growthRate',
      header: 'Growth %',
      cell: ({ row }) => {
        const growth = row.getValue('growthRate') as number;
        return (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            {growth.toFixed(1)}%
          </div>
        );
      },
    },
  ];

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.reportCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const reportCategories = [...new Set(reports.map(r => r.reportCategory))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate reports, analyze data, and monitor performance
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Summary Cards */}
          {analytics && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalClients.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.growthRate.clients}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.activeLoans.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.growthRate.loans}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(analytics.outstandingLoanAmount / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total loan portfolio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio at Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.portfolioAtRisk.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    PAR 30 days
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Outstanding loan amount over time</CardDescription>
              </CardHeader>
              <CardContent>
                {portfolioChart && (
                  <Bar
                    data={portfolioChart}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + (Number(value) / 1000000).toFixed(1) + 'M';
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* PAR Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio at Risk Trend</CardTitle>
                <CardDescription>PAR 30 and PAR 90 over time</CardDescription>
              </CardHeader>
              <CardContent>
                {parTrendChart && (
                  <Line
                    data={parTrendChart}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Office Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Office Performance</CardTitle>
              <CardDescription>Comparative performance across offices</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={officeColumns} data={officePerformance} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {reportCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                System and custom reports available for execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={reportColumns} data={filteredReports} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Deep dive into portfolio metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced analytics features will be available here, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Cohort analysis for loan performance</li>
                  <li>Predictive analytics for default risk</li>
                  <li>Seasonal trend analysis</li>
                  <li>Regional performance comparison</li>
                  <li>Custom KPI tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Create and manage custom SQL-based reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Custom report builder will be available here for creating:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                <li>SQL-based custom queries</li>
                <li>Parameterized reports with filters</li>
                <li>Scheduled report generation</li>
                <li>Multiple export formats</li>
                <li>Report sharing and permissions</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
