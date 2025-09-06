'use client';

import { useState, useMemo } from 'react';
import { loansApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal,
  Download,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Loan, LoanStatus, LoanSearchParams } from '@/types/loans';
import Link from 'next/link';

// Status configurations
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
  'loanStatusType.withdrawn.by.client': {
    label: 'Withdrawn',
    variant: 'outline' as const,
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  },
  'loanStatusType.rejected': {
    label: 'Rejected',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-red-600 bg-red-50 border-red-200'
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
  'loanStatusType.closed.reschedule.outstanding.amount': {
    label: 'Rescheduled',
    variant: 'outline' as const,
    icon: Calendar,
    color: 'text-gray-600 bg-gray-50 border-gray-200'
  },
  'loanStatusType.overpaid': {
    label: 'Overpaid',
    variant: 'default' as const,
    icon: DollarSign,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
};

interface LoanListFilters {
  search: string;
  status: LoanStatus | 'all';
  loanProductId: number | 'all';
  loanOfficerId: number | 'all';
  officeId: number | 'all';
}

export default function LoanListPage() {
  const [filters, setFilters] = useState<LoanListFilters>({
    search: '',
    status: 'all',
    loanProductId: 'all',
    loanOfficerId: 'all',
    officeId: 'all',
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Build search parameters
  const searchParams = useMemo<LoanSearchParams>(() => {
    const params: LoanSearchParams = {
      offset: currentPage * pageSize,
      limit: pageSize,
      orderBy: sortBy,
      sortOrder: sortOrder,
    };

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters.loanProductId !== 'all') {
      params.loanProductId = filters.loanProductId as number;
    }
    if (filters.loanOfficerId !== 'all') {
      params.loanOfficerId = filters.loanOfficerId as number;
    }
    if (filters.officeId !== 'all') {
      params.officeId = filters.officeId as number;
    }

    return params;
  }, [filters, currentPage, pageSize, sortBy, sortOrder]);

  // Fetch loans
  const {
    data: loansData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<{
    totalFilteredRecords: number;
    pageItems: Loan[];
  }>({
    queryKey: ['loans', searchParams],
    queryFn: () => loansApi.getLoans(searchParams),
    placeholderData: (previousData) => previousData,
  });

  // Fetch loan products for filter dropdown
  const { data: loanProducts } = useQuery({
    queryKey: ['loan-products'],
    queryFn: () => loansApi.getLoanProducts(),
  });

  // Fetch loan statistics
  const { data: loanStats } = useQuery({
    queryKey: ['loan-stats', filters.officeId],
    queryFn: () => loansApi.getLoanStats(
      filters.officeId !== 'all' ? filters.officeId as number : undefined
    ),
  });

  const loans = loansData?.pageItems || [];
  const totalRecords = loansData?.totalFilteredRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

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

  const getStatusBadge = (status: LoanStatus) => {
    const config = STATUS_CONFIG[status];
    const StatusIcon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.color} gap-1`}>
        <StatusIcon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (loan: Loan) => {
    if (loan.summary.totalOverdue > 0) {
      const overdueDays = loan.delinquent?.pastDueDays || 0;
      if (overdueDays > 90) {
        return <Badge variant="destructive">High Risk</Badge>;
      } else if (overdueDays > 30) {
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">Medium Risk</Badge>;
      } else {
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Risk</Badge>;
      }
    }
    return null;
  };

  const handleFilterChange = (key: keyof LoanListFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      loanProductId: 'all',
      loanOfficerId: 'all',
      officeId: 'all',
    });
    setCurrentPage(0);
  };

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Loans</h3>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load loans'}
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Management</h1>
          <p className="text-gray-600 mt-1">
            Manage loan applications, approvals, and portfolio
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/loans/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/loans/new">
              <Plus className="h-4 w-4 mr-2" />
              New Loan Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {loanStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(loanStats.totalLoanPortfolio)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loanStats.totalLoans} active loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(loanStats.totalOutstandingAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loanStats.activeLoans} active loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(loanStats.totalOverdueAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {loanStats.overdueLoans} overdue loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio at Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {loanStats.portfolioAtRisk.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Risk ratio
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search loans..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Loan Product</label>
              <Select
                value={filters.loanProductId.toString()}
                onValueChange={(value) => handleFilterChange('loanProductId', value === 'all' ? 'all' : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {loanProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Page Size</label>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Loans</CardTitle>
              <CardDescription>
                Showing {loans.length} of {totalRecords} loans
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account No</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Disbursed Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">No loans found</h3>
                          <p className="text-gray-600">
                            {filters.search || filters.status !== 'all' || filters.loanProductId !== 'all'
                              ? 'Try adjusting your search filters.'
                              : 'Create your first loan application to get started.'
                            }
                          </p>
                        </div>
                        {!filters.search && filters.status === 'all' && filters.loanProductId === 'all' && (
                          <Button asChild>
                            <Link href="/loans/new">
                              <Plus className="h-4 w-4 mr-2" />
                              New Loan Application
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan: Loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <Link
                          href={`/loans/${loan.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {loan.accountNo}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/clients/${loan.clientId}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {loan.clientName}
                        </Link>
                      </TableCell>
                      <TableCell>{loan.loanProductName}</TableCell>
                      <TableCell>
                        {formatCurrency(loan.principal, loan.currency.code)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={loan.summary.totalOutstanding > 0 ? 'font-medium' : 'text-gray-500'}>
                            {formatCurrency(loan.summary.totalOutstanding, loan.currency.code)}
                          </span>
                          {loan.summary.totalOverdue > 0 && (
                            <span className="text-sm text-red-600">
                              Overdue: {formatCurrency(loan.summary.totalOverdue, loan.currency.code)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status.code)}</TableCell>
                      <TableCell>{getRiskBadge(loan)}</TableCell>
                      <TableCell>
                        {loan.timeline.actualDisbursementDate 
                          ? formatDate(loan.timeline.actualDisbursementDate)
                          : loan.timeline.expectedDisbursementDate 
                          ? `Expected: ${formatDate(loan.timeline.expectedDisbursementDate)}`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/loans/${loan.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {(loan.status.pendingApproval || loan.status.waitingForDisbursal) && (
                              <DropdownMenuItem asChild>
                                <Link href={`/loans/${loan.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {loan.status.active && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link href={`/loans/${loan.id}/repayment`}>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Make Repayment
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/loans/${loan.id}/schedule`}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    View Schedule
                                  </Link>
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${loan.clientId}`}>
                                View Client
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalRecords)} of {totalRecords} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageIndex = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageIndex}
                        variant={currentPage === pageIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageIndex)}
                      >
                        {pageIndex + 1}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
