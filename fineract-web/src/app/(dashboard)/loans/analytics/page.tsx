'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3Icon,
  TrendingUpIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  PieChartIcon,
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
  DownloadIcon,
  FilterIcon
} from 'lucide-react'

const PortfolioMetrics = {
  totalPortfolio: 2450000,
  activeLoans: 156,
  portfolioAtRisk: 8.5,
  averageTicketSize: 15705,
  repaymentRate: 94.2,
  growthRate: 12.8
}

const RiskSegments = [
  { category: 'Current', count: 142, percentage: 91.0, amount: 2234000, color: 'bg-green-500' },
  { category: '1-30 DPD', count: 8, percentage: 5.1, amount: 126000, color: 'bg-yellow-500' },
  { category: '31-60 DPD', count: 4, percentage: 2.6, amount: 65000, color: 'bg-orange-500' },
  { category: '60+ DPD', count: 2, percentage: 1.3, amount: 25000, color: 'bg-red-500' }
]

const TopPerformingProducts = [
  { name: 'Micro Business Loan', count: 45, amount: 675000, growth: 15.2 },
  { name: 'Agricultural Loan', count: 38, amount: 570000, growth: 22.1 },
  { name: 'Housing Improvement', count: 32, amount: 640000, growth: 8.7 },
  { name: 'Emergency Loan', count: 28, amount: 280000, growth: 18.9 },
  { name: 'Education Loan', count: 13, amount: 285000, growth: 12.4 }
]

const RecentActivities = [
  { type: 'disbursement', client: 'Maria Santos', amount: 15000, date: '2024-01-15', status: 'completed' },
  { type: 'repayment', client: 'Juan Rodriguez', amount: 2500, date: '2024-01-15', status: 'completed' },
  { type: 'approval', client: 'Ana Garcia', amount: 25000, date: '2024-01-14', status: 'pending' },
  { type: 'reschedule', client: 'Carlos Lopez', amount: 18000, date: '2024-01-14', status: 'approved' },
  { type: 'writeoff', client: 'Sofia Martinez', amount: 8500, date: '2024-01-13', status: 'completed' }
]

export default function LoanAnalyticsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Loan Portfolio Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive insights into loan portfolio performance and risk assessment
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(PortfolioMetrics.totalPortfolio)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatPercentage(PortfolioMetrics.growthRate)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PortfolioMetrics.activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio at Risk</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPercentage(PortfolioMetrics.portfolioAtRisk)}
            </div>
            <p className="text-xs text-muted-foreground">
              PAR {'>'}30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Loan Size</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(PortfolioMetrics.averageTicketSize)}</div>
            <p className="text-xs text-muted-foreground">
              Per loan disbursed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repayment Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(PortfolioMetrics.repaymentRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              On-time payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              +{formatPercentage(PortfolioMetrics.growthRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Portfolio growth
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Risk Analysis */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Portfolio Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RiskSegments.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${segment.color}`} />
                      <span className="text-sm font-medium">{segment.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{segment.count} loans</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(segment.amount)}
                      </div>
                    </div>
                  </div>
                  <Progress value={segment.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {formatPercentage(segment.percentage)} of portfolio
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Products */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3Icon className="h-5 w-5 mr-2" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TopPerformingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.count} loans • {formatCurrency(product.amount)}
                    </div>
                  </div>
                  <Badge variant={product.growth > 15 ? "default" : product.growth > 10 ? "secondary" : "outline"}>
                    +{formatPercentage(product.growth)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Recent Loan Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RecentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'approved' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="font-medium capitalize">{activity.type}</div>
                    <div className="text-sm text-muted-foreground">{activity.client}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(activity.amount)}</div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
                <Badge variant={
                  activity.status === 'completed' ? 'default' :
                  activity.status === 'pending' ? 'secondary' :
                  activity.status === 'approved' ? 'outline' : 'destructive'
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileTextIcon className="h-5 w-5 mr-2" />
            Generate Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3Icon className="h-6 w-6 mb-2" />
              Portfolio Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertTriangleIcon className="h-6 w-6 mb-2" />
              Risk Analysis
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUpIcon className="h-6 w-6 mb-2" />
              Performance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CalendarIcon className="h-6 w-6 mb-2" />
              Aging Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
