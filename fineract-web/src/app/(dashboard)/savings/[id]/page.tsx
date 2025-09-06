'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  PiggyBank,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  RefreshCw,
  Plus,
  Clock,
  FileText,
  Receipt,
  Activity
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

import { savingsAccountsApi } from '@/lib/api'
import { SavingsAccount, SavingsAccountTransaction, SavingsAccountCharge, SavingsAccountStatus } from '@/types/savings'

// Mock data for development
const mockSavingsAccount: SavingsAccount = {
  id: 1,
  accountNo: 'SA-2024-001',
  externalId: 'EXT-001',
  clientId: 1,
  clientName: 'Maria Santos',
  productId: 1,
  productName: 'Regular Savings Account',
  fieldOfficerId: 1,
  fieldOfficerName: 'John Smith',
  status: SavingsAccountStatus.ACTIVE,
  accountType: 'INDIVIDUAL' as any,
  timeline: {
    submittedOnDate: '2024-01-10',
    submittedByUsername: 'admin',
    submittedByFirstname: 'System',
    submittedByLastname: 'Administrator',
    approvedOnDate: '2024-01-11',
    approvedByUsername: 'manager',
    approvedByFirstname: 'Branch',
    approvedByLastname: 'Manager',
    activatedOnDate: '2024-01-12',
    activatedByUsername: 'teller',
    activatedByFirstname: 'Bank',
    activatedByLastname: 'Teller'
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
  lockinPeriodFrequency: 6,
  lockinPeriodFrequencyType: 'MONTHS' as any,
  withdrawalFeeForTransfers: false,
  allowOverdraft: false,
  enforceMinRequiredBalance: true,
  minRequiredBalance: 25,
  minBalanceForInterestCalculation: 10,
  withHoldTax: false,
  accountBalance: 2450.00,
  availableBalance: 2450.00,
  totalDeposits: 3000.00,
  totalWithdrawals: 550.00,
  totalWithdrawalFees: 0,
  totalFees: 15.00,
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
    totalWithdrawals: 550.00,
    totalWithdrawalFees: 0,
    totalInterestEarned: 12.50,
    totalInterestPosted: 12.50,
    totalFeeCharge: 15.00,
    lastInterestCalculationDate: '2024-01-14'
  },
  createdDate: '2024-01-10T10:30:00',
  lastModifiedDate: '2024-01-15T14:20:00'
}

const mockTransactions: SavingsAccountTransaction[] = [
  {
    id: 1,
    accountId: 1,
    officeId: 1,
    officeName: 'Head Office',
    transactionType: 'DEPOSIT' as any,
    date: '2024-01-15',
    currency: mockSavingsAccount.currency,
    amount: 500.00,
    runningBalance: 2450.00,
    reversed: false,
    submittedOnDate: '2024-01-15',
    interestedPostedAsOn: false,
    submittedByUsername: 'teller',
    note: 'Monthly salary deposit',
    lienTransaction: false
  },
  {
    id: 2,
    accountId: 1,
    officeId: 1,
    officeName: 'Head Office',
    transactionType: 'WITHDRAWAL' as any,
    date: '2024-01-12',
    currency: mockSavingsAccount.currency,
    amount: 200.00,
    runningBalance: 1950.00,
    reversed: false,
    submittedOnDate: '2024-01-12',
    interestedPostedAsOn: false,
    submittedByUsername: 'teller',
    note: 'ATM withdrawal',
    lienTransaction: false
  },
  {
    id: 3,
    accountId: 1,
    officeId: 1,
    officeName: 'Head Office',
    transactionType: 'INTEREST_POSTING' as any,
    date: '2024-01-01',
    currency: mockSavingsAccount.currency,
    amount: 12.50,
    runningBalance: 2162.50,
    reversed: false,
    submittedOnDate: '2024-01-01',
    interestedPostedAsOn: true,
    submittedByUsername: 'system',
    note: 'Monthly interest posting',
    lienTransaction: false
  }
]

const mockCharges: SavingsAccountCharge[] = [
  {
    id: 1,
    chargeId: 1,
    accountId: 1,
    name: 'Monthly Maintenance Fee',
    chargeTimeType: 'MONTHLY_FEE' as any,
    chargeCalculationType: 'FLAT' as any,
    currency: mockSavingsAccount.currency,
    amount: 5.00,
    amountPaid: 5.00,
    amountWaived: 0,
    amountOutstanding: 0,
    penalty: false,
    isActive: true,
    isFreeWithdrawal: false,
    isPaymentDue: false,
    dueAsOfDate: '2024-02-01'
  },
  {
    id: 2,
    chargeId: 2,
    accountId: 1,
    name: 'Overdraft Fee',
    chargeTimeType: 'OVERDRAFT_FEE' as any,
    chargeCalculationType: 'FLAT' as any,
    currency: mockSavingsAccount.currency,
    amount: 25.00,
    amountPaid: 0,
    amountWaived: 0,
    amountOutstanding: 0,
    penalty: true,
    isActive: true,
    isFreeWithdrawal: false,
    isPaymentDue: false
  }
]

export default function SavingsAccountDetailPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = parseInt(params.id as string)
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch savings account details
  const { 
    data: savingsAccount, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['savings-account', accountId],
    queryFn: () => savingsAccountsApi.getSavingsAccount(accountId, ['transactions', 'charges']),
    // Use mock data for development
    enabled: false
  })

  // Use mock data for development
  const account = savingsAccount || mockSavingsAccount
  const transactions = account.transactions || mockTransactions
  const charges = account.charges || mockCharges

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency.code,
      minimumFractionDigits: account.currency.decimalPlaces,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: SavingsAccountStatus) => {
    switch (status) {
      case SavingsAccountStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case SavingsAccountStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case SavingsAccountStatus.CLOSED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case SavingsAccountStatus.SUBMITTED_AND_PENDING_APPROVAL:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'WITHDRAWAL':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      case 'INTEREST_POSTING':
        return <PiggyBank className="h-4 w-4 text-blue-600" />
      case 'WITHDRAWAL_FEE':
        return <Receipt className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Account</h3>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load savings account details'}
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
    <div className="container mx-auto py-8 space-y-6">
      {/* Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Account {account.accountNo}
            </h1>
            <p className="text-sm text-muted-foreground">
              Savings Account Details
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href={`/savings/${accountId}/transaction`}>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Link>
          </Button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.accountBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Available: {formatCurrency(account.availableBalance)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{account.nominalAnnualInterestRate}%</div>
            <p className="text-xs text-muted-foreground">
              Annual rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.totalDeposits)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime deposits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Earned</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.totalInterestEarned)}</div>
            <p className="text-xs text-muted-foreground">
              Total earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                    <p className="text-sm font-semibold">{account.accountNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">External ID</label>
                    <p className="text-sm font-semibold">{account.externalId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <Link 
                      href={`/clients/${account.clientId}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {account.clientName}
                    </Link>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Product</label>
                    <p className="text-sm font-semibold">{account.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Field Officer</label>
                    <p className="text-sm font-semibold">{account.fieldOfficerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2" />
                  Interest Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Interest Rate</label>
                    <p className="text-sm font-semibold">{account.nominalAnnualInterestRate}% p.a.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Compounding</label>
                    <p className="text-sm font-semibold">{account.interestCompoundingPeriodType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Posting</label>
                    <p className="text-sm font-semibold">{account.interestPostingPeriodType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Calculation Type</label>
                    <p className="text-sm font-semibold">{account.interestCalculationType.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Days in Year</label>
                    <p className="text-sm font-semibold">{account.interestCalculationDaysInYearType.replace('DAYS_', '')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Min Balance for Interest</label>
                    <p className="text-sm font-semibold">
                      {account.minBalanceForInterestCalculation ? 
                        formatCurrency(account.minBalanceForInterestCalculation) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Balance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Current Balance</span>
                    <span className="text-sm font-semibold">{formatCurrency(account.accountBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Available Balance</span>
                    <span className="text-sm font-semibold">{formatCurrency(account.availableBalance)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Deposits</span>
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(account.totalDeposits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Withdrawals</span>
                    <span className="text-sm font-semibold text-red-600">{formatCurrency(account.totalWithdrawals)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Fees</span>
                    <span className="text-sm font-semibold">{formatCurrency(account.totalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Interest Earned</span>
                    <span className="text-sm font-semibold text-blue-600">{formatCurrency(account.totalInterestEarned)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Account Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {account.timeline.submittedOnDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(account.timeline.submittedOnDate)} by {account.timeline.submittedByFirstname} {account.timeline.submittedByLastname}
                        </p>
                      </div>
                    </div>
                  )}
                  {account.timeline.approvedOnDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Approved</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(account.timeline.approvedOnDate)} by {account.timeline.approvedByFirstname} {account.timeline.approvedByLastname}
                        </p>
                      </div>
                    </div>
                  )}
                  {account.timeline.activatedOnDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Activated</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(account.timeline.activatedOnDate)} by {account.timeline.activatedByFirstname} {account.timeline.activatedByLastname}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Transaction History
                </div>
                <Button asChild>
                  <Link href={`/savings/${accountId}/transaction`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Transaction
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Running Balance</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction: SavingsAccountTransaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTransactionIcon(transaction.transactionType)}
                            <span className="text-sm font-medium">
                              {transaction.transactionType.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={
                            transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'INTEREST_POSTING'
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }>
                            {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'INTEREST_POSTING'
                              ? '+'
                              : '-'
                            }{formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(transaction.runningBalance)}
                        </TableCell>
                        <TableCell>{transaction.note || 'N/A'}</TableCell>
                        <TableCell>
                          {transaction.reversed ? (
                            <Badge variant="destructive">Reversed</Badge>
                          ) : (
                            <Badge variant="default">Completed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Account Charges
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Charge
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Charge</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {charges.map((charge: SavingsAccountCharge) => (
                      <TableRow key={charge.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{charge.name}</div>
                            {charge.penalty && (
                              <Badge variant="destructive" className="text-xs">
                                Penalty
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{charge.chargeTimeType.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(charge.amount)}</TableCell>
                        <TableCell className="text-green-600 font-semibold">{formatCurrency(charge.amountPaid)}</TableCell>
                        <TableCell className="text-red-600 font-semibold">{formatCurrency(charge.amountOutstanding)}</TableCell>
                        <TableCell>{charge.dueAsOfDate ? formatDate(charge.dueAsOfDate) : 'N/A'}</TableCell>
                        <TableCell>
                          {charge.isPaymentDue ? (
                            <Badge variant="destructive">Payment Due</Badge>
                          ) : charge.amountOutstanding > 0 ? (
                            <Badge variant="secondary">Partial</Badge>
                          ) : (
                            <Badge variant="default">Paid</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Withdrawal Fee for Transfers</span>
                    <Badge variant={account.withdrawalFeeForTransfers ? "destructive" : "secondary"}>
                      {account.withdrawalFeeForTransfers ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Allow Overdraft</span>
                    <Badge variant={account.allowOverdraft ? "default" : "secondary"}>
                      {account.allowOverdraft ? 'Allowed' : 'Not Allowed'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Enforce Min Required Balance</span>
                    <Badge variant={account.enforceMinRequiredBalance ? "default" : "secondary"}>
                      {account.enforceMinRequiredBalance ? 'Enforced' : 'Not Enforced'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tax Withholding</span>
                    <Badge variant={account.withHoldTax ? "destructive" : "secondary"}>
                      {account.withHoldTax ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Balance Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Min Opening Balance</span>
                    <span className="text-sm font-semibold">
                      {account.minRequiredOpeningBalance ? formatCurrency(account.minRequiredOpeningBalance) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Min Required Balance</span>
                    <span className="text-sm font-semibold">
                      {account.minRequiredBalance ? formatCurrency(account.minRequiredBalance) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overdraft Limit</span>
                    <span className="text-sm font-semibold">
                      {account.overdraftLimit ? formatCurrency(account.overdraftLimit) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Lock-in Period</span>
                    <span className="text-sm font-semibold">
                      {account.lockinPeriodFrequency ? 
                        `${account.lockinPeriodFrequency} ${account.lockinPeriodFrequencyType}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline">
                  Edit Account
                </Button>
                <Button variant="outline">
                  Block Account
                </Button>
                <Button variant="outline">
                  Calculate Interest
                </Button>
                <Button variant="outline">
                  Post Interest
                </Button>
                {account.status === SavingsAccountStatus.ACTIVE && (
                  <Button variant="destructive">
                    Close Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
