'use client'

import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  PiggyBank, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { savingsAccountsApi, savingsProductsApi } from '@/lib/api'
import { SavingsAccount, SavingsAccountStatus, SavingsAccountSearchParams, SavingsProduct } from '@/types/savings'

// Mock data for development
const mockSavingsAccounts: SavingsAccount[] = [
  {
    id: 1,
    accountNo: 'SA-2024-001',
    externalId: 'EXT-001',
    clientId: 1,
    clientName: 'Maria Santos',
    productId: 1,
    productName: 'Regular Savings Account',
    status: SavingsAccountStatus.ACTIVE,
    accountType: 'INDIVIDUAL' as any,
    timeline: {
      submittedOnDate: '2024-01-10',
      approvedOnDate: '2024-01-11',
      activatedOnDate: '2024-01-12'
    },
    currency: {
      code: 'USD',
      name: 'US Dollar',
      decimalPlaces: 2,
      displaySymbol: '$',
      nameCode: 'currency.USD',
      displayLabel: 'US Dollar ($)'
    },
    nominalAnnualInterestRate: 3.5,
    interestCompoundingPeriodType: 'MONTHLY' as any,
    interestPostingPeriodType: 'MONTHLY' as any,
    interestCalculationType: 'DAILY_BALANCE' as any,
    interestCalculationDaysInYearType: 'DAYS_365' as any,
    minRequiredOpeningBalance: 50,
    withdrawalFeeForTransfers: false,
    allowOverdraft: false,
    enforceMinRequiredBalance: true,
    withHoldTax: false,
    accountBalance: 2450.00,
    availableBalance: 2450.00,
    totalDeposits: 3000.00,
    totalWithdrawals: 550.00,
    totalWithdrawalFees: 0,
    totalFees: 0,
    totalPenalties: 0,
    totalInterestEarned: 12.50,
    totalInterestPosted: 12.50,
    totalOverdraftInterestDerived: 0,
    summary: {
      currency: {
        code: 'USD',
        name: 'US Dollar',
        decimalPlaces: 2,
        displaySymbol: '$',
        nameCode: 'currency.USD',
        displayLabel: 'US Dollar ($)'
      },
      accountBalance: 2450.00,
      totalDeposits: 3000.00,
      totalWithdrawals: 550.00
    },
    createdDate: '2024-01-10T10:30:00',
    lastModifiedDate: '2024-01-15T14:20:00'
  },
  {
    id: 2,
    accountNo: 'SA-2024-002',
    clientId: 2,
    clientName: 'Juan Rodriguez',
    productId: 2,
    productName: 'High Yield Savings',
    status: SavingsAccountStatus.ACTIVE,
    accountType: 'INDIVIDUAL' as any,
    timeline: {
      submittedOnDate: '2024-01-08',
      approvedOnDate: '2024-01-09',
      activatedOnDate: '2024-01-10'
    },
    currency: {
      code: 'USD',
      name: 'US Dollar',
      decimalPlaces: 2,
      displaySymbol: '$',
      nameCode: 'currency.USD',
      displayLabel: 'US Dollar ($)'
    },
    nominalAnnualInterestRate: 5.0,
    interestCompoundingPeriodType: 'MONTHLY' as any,
    interestPostingPeriodType: 'QUARTERLY' as any,
    interestCalculationType: 'AVERAGE_DAILY_BALANCE' as any,
    interestCalculationDaysInYearType: 'DAYS_365' as any,
    minRequiredOpeningBalance: 1000,
    withdrawalFeeForTransfers: false,
    allowOverdraft: false,
    enforceMinRequiredBalance: true,
    withHoldTax: false,
    accountBalance: 5750.00,
    availableBalance: 5750.00,
    totalDeposits: 6000.00,
    totalWithdrawals: 250.00,
    totalWithdrawalFees: 0,
    totalFees: 0,
    totalPenalties: 0,
    totalInterestEarned: 25.00,
    totalInterestPosted: 25.00,
    totalOverdraftInterestDerived: 0,
    summary: {
      currency: {
        code: 'USD',
        name: 'US Dollar',
        decimalPlaces: 2,
        displaySymbol: '$',
        nameCode: 'currency.USD',
        displayLabel: 'US Dollar ($)'
      },
      accountBalance: 5750.00,
      totalDeposits: 6000.00,
      totalWithdrawals: 250.00
    },
    createdDate: '2024-01-08T09:15:00',
    lastModifiedDate: '2024-01-12T16:45:00'
  }
]

const mockStatistics = {
  totalAccounts: 156,
  activeAccounts: 142,
  inactiveAccounts: 8,
  pendingApprovalAccounts: 6,
  totalBalance: 485750.00,
  totalDeposits: 532000.00,
  totalWithdrawals: 46250.00,
  averageBalance: 3114.74,
  monthlyGrowth: 12.8,
  interestPaid: 1850.00
}

interface StatusConfig {
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ComponentType<any>
  color: string
}

const statusConfig: Record<SavingsAccountStatus, StatusConfig> = {
  [SavingsAccountStatus.SUBMITTED_AND_PENDING_APPROVAL]: {
    variant: 'secondary',
    icon: Clock,
    color: 'text-yellow-600'
  },
  [SavingsAccountStatus.APPROVED]: {
    variant: 'outline',
    icon: CheckCircle,
    color: 'text-blue-600'
  },
  [SavingsAccountStatus.ACTIVE]: {
    variant: 'default',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  [SavingsAccountStatus.INACTIVE]: {
    variant: 'secondary',
    icon: AlertTriangle,
    color: 'text-gray-600'
  },
  [SavingsAccountStatus.CLOSED]: {
    variant: 'outline',
    icon: XCircle,
    color: 'text-red-600'
  },
  [SavingsAccountStatus.INVALID]: {
    variant: 'destructive',
    icon: XCircle,
    color: 'text-red-600'
  },
  [SavingsAccountStatus.PREMATURE_CLOSED]: {
    variant: 'destructive',
    icon: XCircle,
    color: 'text-red-600'
  },
  [SavingsAccountStatus.TRANSFER_IN_PROGRESS]: {
    variant: 'secondary',
    icon: RefreshCw,
    color: 'text-blue-600'
  },
  [SavingsAccountStatus.TRANSFER_ON_HOLD]: {
    variant: 'secondary',
    icon: Clock,
    color: 'text-yellow-600'
  }
}

export default function SavingsAccountsPage() {
  const [searchParams, setSearchParams] = useState<SavingsAccountSearchParams>({
    limit: 20,
    offset: 0
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch savings accounts
  const { 
    data: savingsData, 
    isLoading: isLoadingSavings, 
    error: savingsError,
    refetch
  } = useQuery({
    queryKey: ['savings-accounts', searchParams],
    queryFn: () => savingsAccountsApi.getSavingsAccounts(searchParams),
    staleTime: 30000,
    // Use mock data for development
    enabled: false
  })

  // Fetch savings statistics
  const { 
    data: statisticsData
  } = useQuery({
    queryKey: ['savings-statistics'],
    queryFn: () => savingsAccountsApi.getSavingsAccountStatistics(),
    staleTime: 60000,
    // Use mock data for development
    enabled: false
  })

  // Use mock data for development
  const savingsAccounts = savingsData?.pageItems || mockSavingsAccounts
  const statistics = statisticsData || mockStatistics

  // Filter accounts based on search term
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return savingsAccounts

    return savingsAccounts.filter((account: SavingsAccount) =>
      account.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.externalId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [savingsAccounts, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusConfig = (status: SavingsAccountStatus) => {
    return statusConfig[status] || statusConfig[SavingsAccountStatus.INVALID]
  }

  if (savingsError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Savings Accounts</h3>
            <p className="text-gray-600 mb-4">
              {savingsError instanceof Error ? savingsError.message : 'Failed to load savings accounts'}
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Account Management</h1>
          <p className="text-gray-600 mt-1">
            Manage savings accounts, deposits, and interest calculations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/savings/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/savings/new">
              <Plus className="h-4 w-4 mr-2" />
              New Savings Account
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statistics.totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatPercentage(statistics.monthlyGrowth)} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.activeAccounts}</div>
            <p className="text-xs text-muted-foreground">
              of {statistics.totalAccounts} total accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statistics.averageBalance)}</div>
            <p className="text-xs text-muted-foreground">
              per active account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Paid</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(statistics.interestPaid)}</div>
            <p className="text-xs text-muted-foreground">
              this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Savings Accounts</CardTitle>
          <CardDescription>
            A list of all savings accounts with their current status and balances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search accounts, clients, or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={searchParams.status?.toString() || 'all'}
              onValueChange={(value) => setSearchParams(prev => ({
                ...prev,
                status: value === 'all' ? undefined : value as SavingsAccountStatus
              }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={SavingsAccountStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={SavingsAccountStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={SavingsAccountStatus.SUBMITTED_AND_PENDING_APPROVAL}>Pending Approval</SelectItem>
                <SelectItem value={SavingsAccountStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Savings Accounts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSavings ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account: SavingsAccount) => {
                    const statusConf = getStatusConfig(account.status)
                    const StatusIcon = statusConf.icon
                    
                    return (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{account.accountNo}</div>
                            {account.externalId && (
                              <div className="text-sm text-muted-foreground">
                                External: {account.externalId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link 
                            href={`/clients/${account.clientId}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {account.clientName}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{account.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {account.productId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConf.variant}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {account.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{formatCurrency(account.accountBalance)}</div>
                            <div className="text-sm text-muted-foreground">
                              Available: {formatCurrency(account.availableBalance)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatPercentage(account.nominalAnnualInterestRate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(account.lastModifiedDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/savings/${account.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/savings/${account.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Account
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/savings/${account.id}/transactions`}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  View Transactions
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <PiggyBank className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No savings accounts found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {searchTerm ? 'Try adjusting your search criteria' : 'Start by creating a new savings account'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoadingSavings && filteredAccounts.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAccounts.length} of {statistics.totalAccounts} accounts
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
