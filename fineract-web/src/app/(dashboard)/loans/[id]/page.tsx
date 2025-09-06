'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Building,
  CreditCard,
  TrendingUp,
  Download,
  MoreHorizontal,
  Plus,
  Eye,
  Receipt,
  Shield,
  Users,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { loansApi } from '@/lib/api';
import { Loan, LoanTransaction, LoanCharge, LoanCollateral, LoanGuarantor } from '@/types/loans';
import Link from 'next/link';

const STATUS_CONFIG = {
  'loanStatusType.submitted.and.pending.approval': {
    label: 'Pending Approval',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  'loanStatusType.approved': {
    label: 'Approved',
    variant: 'default' as const,
    icon: CheckCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  'loanStatusType.active': {
    label: 'Active',
    variant: 'default' as const,
    icon: DollarSign,
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  'loanStatusType.closed.obligations.met': {
    label: 'Closed',
    variant: 'outline' as const,
    icon: CheckCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  },
  'loanStatusType.closed.written.off': {
    label: 'Written Off',
    variant: 'destructive' as const,
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200'
  },
};

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const loanId = parseInt(params.id as string);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch loan details with all associations
  const {
    data: loan,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Loan>({
    queryKey: ['loan', loanId],
    queryFn: () => loansApi.getLoanById(loanId, [
      'all',
      'repaymentSchedule',
      'transactions',
      'charges',
      'collateral',
      'guarantors'
    ]),
    enabled: !!loanId,
  });

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: any) => {
    const config = STATUS_CONFIG[status.code as keyof typeof STATUS_CONFIG];
    if (!config) return <Badge variant="outline">{status.value}</Badge>;
    
    const StatusIcon = config.icon;
    return (
      <Badge variant={config.variant} className={`${config.color} gap-1`}>
        <StatusIcon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRepaymentProgress = () => {
    if (!loan) return 0;
    const { principalDisbursed, principalPaid } = loan.summary;
    if (principalDisbursed === 0) return 0;
    return Math.round((principalPaid / principalDisbursed) * 100);
  };

  const getTransactionTypeBadge = (transaction: LoanTransaction) => {
    const type = transaction.type;
    if (type.disbursement) return <Badge variant="default">Disbursement</Badge>;
    if (type.repayment) return <Badge variant="secondary">Repayment</Badge>;
    if (type.waiveInterest) return <Badge variant="outline">Waive Interest</Badge>;
    if (type.waiveCharges) return <Badge variant="outline">Waive Charges</Badge>;
    if (type.writeOff) return <Badge variant="destructive">Write Off</Badge>;
    return <Badge variant="outline">{type.value}</Badge>;
  };

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Loan</h3>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load loan details'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loan Not Found</h3>
              <p className="text-gray-600 mb-4">
                The requested loan could not be found.
              </p>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Loan #{loan.accountNo}
              </h1>
              {getStatusBadge(loan.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <Link href={`/clients/${loan.clientId}`} className="text-blue-600 hover:text-blue-800">
                  {loan.clientName}
                </Link>
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                {loan.loanProductName}
              </span>
              {loan.timeline.actualDisbursementDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Disbursed: {formatDate(loan.timeline.actualDisbursementDate)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Loan Actions</DropdownMenuLabel>
              {loan.status.pendingApproval && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/loans/${loan.id}/approve`}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Loan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/loans/${loan.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Application
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {loan.status.waitingForDisbursal && (
                <DropdownMenuItem asChild>
                  <Link href={`/loans/${loan.id}/disburse`}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Disburse Loan
                  </Link>
                </DropdownMenuItem>
              )}
              {loan.status.active && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/loans/${loan.id}/repayment`}>
                      <Receipt className="h-4 w-4 mr-2" />
                      Make Repayment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/loans/${loan.id}/charges/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Charge
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Generate Statement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loan.principal, loan.currency.code)}
            </div>
            <p className="text-xs text-muted-foreground">
              Approved: {formatCurrency(loan.approvedPrincipal, loan.currency.code)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loan.summary.totalOutstanding, loan.currency.code)}
            </div>
            <p className="text-xs text-muted-foreground">
              {loan.summary.totalOverdue > 0 && (
                <span className="text-red-600">
                  Overdue: {formatCurrency(loan.summary.totalOverdue, loan.currency.code)}
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(loan.summary.totalRepayment, loan.currency.code)}
            </div>
            <p className="text-xs text-muted-foreground">
              Progress: {getRepaymentProgress()}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loan.interestRatePerPeriod}%
            </div>
            <p className="text-xs text-muted-foreground">
              Annual: {loan.annualInterestRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {loan.status.active && (
        <Card>
          <CardHeader>
            <CardTitle>Repayment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Principal Repaid</span>
                <span>{getRepaymentProgress()}%</span>
              </div>
              <Progress value={getRepaymentProgress()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Paid: {formatCurrency(loan.summary.principalPaid, loan.currency.code)}</span>
                <span>Remaining: {formatCurrency(loan.summary.principalOutstanding, loan.currency.code)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Information Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="charges">Charges</TabsTrigger>
              <TabsTrigger value="collateral">Collateral</TabsTrigger>
              <TabsTrigger value="guarantors">Guarantors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Loan Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Account Number:</span>
                        <div className="font-medium">{loan.accountNo}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">External ID:</span>
                        <div className="font-medium">{loan.externalId || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Loan Officer:</span>
                        <div className="font-medium">{loan.loanOfficerName || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Fund:</span>
                        <div className="font-medium">{loan.fundName || 'N/A'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms & Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Loan Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Term:</span>
                        <div className="font-medium">
                          {loan.termFrequency} {loan.termPeriodFrequencyType.value}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Repayments:</span>
                        <div className="font-medium">{loan.numberOfRepayments}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <div className="font-medium">
                          Every {loan.repaymentEvery} {loan.repaymentFrequencyType.value}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Amortization:</span>
                        <div className="font-medium">{loan.amortizationType.value}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Principal Due</TableHead>
                      <TableHead>Interest Due</TableHead>
                      <TableHead>Fees Due</TableHead>
                      <TableHead>Total Due</TableHead>
                      <TableHead>Total Paid</TableHead>
                      <TableHead>Outstanding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loan.repaymentSchedule?.periods?.map((period, index) => (
                      <TableRow key={index} className={period.complete ? 'bg-green-50' : ''}>
                        <TableCell>{period.period || 'Disbursement'}</TableCell>
                        <TableCell>{period.dueDate ? formatDate(period.dueDate) : '-'}</TableCell>
                        <TableCell>{formatCurrency(period.principalDue, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(period.interestDue, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(period.feeChargesDue + period.penaltyChargesDue, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(period.totalDueForPeriod, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(period.totalPaidForPeriod || 0, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(period.totalOutstandingForPeriod, loan.currency.code)}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          No repayment schedule available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Fees</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loan.transactions?.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDateTime(transaction.date)}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction)}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(transaction.principalPortion || 0, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(transaction.interestPortion || 0, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency((transaction.feeChargesPortion || 0) + (transaction.penaltyChargesPortion || 0), loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(transaction.outstandingLoanBalance || 0, loan.currency.code)}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="charges">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Charge</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Waived</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loan.charges?.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{charge.name}</div>
                            <div className="text-sm text-gray-500">
                              {charge.penalty ? 'Penalty' : 'Fee'} - {charge.chargeTimeType.value}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{charge.dueDate ? formatDate(charge.dueDate) : '-'}</TableCell>
                        <TableCell>{formatCurrency(charge.amount, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(charge.amountPaid || 0, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(charge.amountWaived || 0, loan.currency.code)}</TableCell>
                        <TableCell>{formatCurrency(charge.amountOutstanding, loan.currency.code)}</TableCell>
                        <TableCell>
                          {charge.paid ? (
                            <Badge variant="default">Paid</Badge>
                          ) : charge.waived ? (
                            <Badge variant="outline">Waived</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No charges found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="collateral">
              <div className="space-y-4">
                {loan.collateral?.map((collateral, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {collateral.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Quantity:</span>
                          <div className="font-medium">{collateral.quantity}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Price:</span>
                          <div className="font-medium">{formatCurrency(collateral.unitPrice)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Value:</span>
                          <div className="font-medium">{formatCurrency(collateral.totalValue)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Collateral Value:</span>
                          <div className="font-medium">{formatCurrency(collateral.totalCollateralValue)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <Shield className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                        <p>No collateral attached to this loan</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="guarantors">
              <div className="space-y-4">
                {loan.guarantors?.map((guarantor, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {guarantor.firstname} {guarantor.lastname}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Relationship:</span>
                            <div className="font-medium">{guarantor.clientRelationshipType.name}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <div className="font-medium">{guarantor.guarantorType.value}</div>
                          </div>
                          {guarantor.guaranteeAmount && (
                            <div>
                              <span className="text-gray-600">Guarantee Amount:</span>
                              <div className="font-medium">{formatCurrency(guarantor.guaranteeAmount)}</div>
                            </div>
                          )}
                        </div>
                        {(guarantor.addressLine1 || guarantor.mobileNumber) && (
                          <div className="space-y-2 text-sm">
                            {guarantor.addressLine1 && (
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                  <div>{guarantor.addressLine1}</div>
                                  {guarantor.addressLine2 && <div>{guarantor.addressLine2}</div>}
                                  {guarantor.city && <div>{guarantor.city}, {guarantor.state} {guarantor.zip}</div>}
                                </div>
                              </div>
                            )}
                            {guarantor.mobileNumber && (
                              <div>
                                <span className="text-gray-600">Mobile:</span>
                                <div className="font-medium">{guarantor.mobileNumber}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                        <p>No guarantors assigned to this loan</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
