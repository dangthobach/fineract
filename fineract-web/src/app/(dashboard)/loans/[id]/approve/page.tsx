'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  User, 
  CreditCard, 
  Calendar, 
  DollarSign,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { loansApi } from '@/lib/api';
import { Loan, LoanApprovalRequest } from '@/types/loans';
import Link from 'next/link';

// Approval form validation schema
const approvalSchema = z.object({
  approvedOnDate: z.string().min(1, 'Approval date is required'),
  approvedLoanAmount: z.number().optional(),
  expectedDisbursementDate: z.string().optional(),
  note: z.string().optional(),
  locale: z.literal('en'),
  dateFormat: z.literal('dd MMMM yyyy'),
});

// Rejection form validation schema
const rejectionSchema = z.object({
  rejectedOnDate: z.string().min(1, 'Rejection date is required'),
  note: z.string().min(1, 'Rejection reason is required'),
  locale: z.literal('en'),
  dateFormat: z.literal('dd MMMM yyyy'),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;
type RejectionFormData = z.infer<typeof rejectionSchema>;

export default function LoanApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const loanId = parseInt(params.id as string);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  // Fetch loan details
  const {
    data: loan,
    isLoading,
    isError,
    error,
  } = useQuery<Loan>({
    queryKey: ['loan', loanId],
    queryFn: () => loansApi.getLoanById(loanId),
    enabled: !!loanId,
  });

  // Approval form
  const approvalForm = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      approvedOnDate: new Date().toISOString().split('T')[0],
      locale: 'en',
      dateFormat: 'dd MMMM yyyy',
    },
  });

  // Rejection form
  const rejectionForm = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      rejectedOnDate: new Date().toISOString().split('T')[0],
      locale: 'en',
      dateFormat: 'dd MMMM yyyy',
    },
  });

  // Approve loan mutation
  const approveLoanMutation = useMutation({
    mutationFn: (data: ApprovalFormData) => loansApi.approveLoan(loanId, data),
    onSuccess: () => {
      toast.success('Loan approved successfully');
      queryClient.invalidateQueries({ queryKey: ['loan', loanId] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      router.push(`/loans/${loanId}`);
    },
    onError: (error) => {
      toast.error(`Failed to approve loan: ${error.message}`);
    },
  });

  // Reject loan mutation
  const rejectLoanMutation = useMutation({
    mutationFn: (data: RejectionFormData) => loansApi.rejectLoan(loanId, data),
    onSuccess: () => {
      toast.success('Loan rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['loan', loanId] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      router.push(`/loans/${loanId}`);
    },
    onError: (error) => {
      toast.error(`Failed to reject loan: ${error.message}`);
    },
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
      month: 'long',
      day: 'numeric',
    });
  };

  const onApprove = (data: ApprovalFormData) => {
    approveLoanMutation.mutate(data);
  };

  const onReject = (data: RejectionFormData) => {
    rejectLoanMutation.mutate(data);
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

  if (isLoading || !loan) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if loan is eligible for approval/rejection
  if (!loan.status.pendingApproval) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Not Available</h3>
              <p className="text-gray-600 mb-4">
                This loan is not pending approval. Current status: {loan.status.value}
              </p>
              <Button asChild variant="outline">
                <Link href={`/loans/${loan.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Loan Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Approval</h1>
            <p className="text-gray-600">Review and approve or reject the loan application</p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending Approval
        </Badge>
      </div>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Loan Application Summary
          </CardTitle>
          <CardDescription>Loan #{loan.accountNo}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-1">
                <User className="h-4 w-4" />
                Client
              </Label>
              <div>
                <p className="font-medium">{loan.clientName}</p>
                <p className="text-sm text-gray-500">ID: {loan.clientId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                Loan Product
              </Label>
              <div>
                <p className="font-medium">{loan.loanProductName}</p>
                {loan.loanProductDescription && (
                  <p className="text-sm text-gray-500">{loan.loanProductDescription}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Principal Amount
              </Label>
              <div>
                <p className="font-medium text-lg">
                  {formatCurrency(loan.proposedPrincipal, loan.currency.code)}
                </p>
                <p className="text-sm text-gray-500">
                  Proposed: {formatCurrency(loan.principal, loan.currency.code)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Submitted Date
              </Label>
              <div>
                <p className="font-medium">
                  {formatDate(loan.timeline.submittedOnDate)}
                </p>
                <p className="text-sm text-gray-500">
                  By: {loan.timeline.submittedByFirstname} {loan.timeline.submittedByLastname}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600">Interest Rate</Label>
              <p className="font-medium">{loan.interestRatePerPeriod}% per period</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Repayments</Label>
              <p className="font-medium">
                {loan.numberOfRepayments} payments every {loan.repaymentEvery} {loan.repaymentFrequencyType.value}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Expected Disbursement</Label>
              <p className="font-medium">
                {loan.timeline.expectedDisbursementDate 
                  ? formatDate(loan.timeline.expectedDisbursementDate)
                  : 'Not specified'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Selection */}
      {!action && (
        <Card>
          <CardHeader>
            <CardTitle>Select Action</CardTitle>
            <CardDescription>
              Choose whether to approve or reject this loan application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                onClick={() => setAction('approve')}
                size="lg"
                className="h-24 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-8 w-8" />
                <span className="text-lg font-semibold">Approve Loan</span>
                <span className="text-sm opacity-90">Approve this loan application</span>
              </Button>

              <Button
                onClick={() => setAction('reject')}
                variant="destructive"
                size="lg"
                className="h-24 flex flex-col gap-2"
              >
                <XCircle className="h-8 w-8" />
                <span className="text-lg font-semibold">Reject Loan</span>
                <span className="text-sm opacity-90">Reject this loan application</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Form */}
      {action === 'approve' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Approve Loan Application
            </CardTitle>
            <CardDescription>
              Provide approval details for this loan application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...approvalForm}>
              <form onSubmit={approvalForm.handleSubmit(onApprove)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={approvalForm.control}
                    name="approvedOnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approval Date *</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Date when the loan is approved
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={approvalForm.control}
                    name="approvedLoanAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved Amount (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter approved amount"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank to approve the requested amount of {formatCurrency(loan.proposedPrincipal, loan.currency.code)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={approvalForm.control}
                  name="expectedDisbursementDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Disbursement Date (Optional)</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Expected date for loan disbursement
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={approvalForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approval Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about the approval..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional comments or conditions for the approval
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Approval Confirmation</AlertTitle>
                  <AlertDescription>
                    By clicking "Approve Loan", you confirm that you have reviewed this application 
                    and approve it for disbursement. This action cannot be undone without supervisor approval.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={approveLoanMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {approveLoanMutation.isPending ? 'Approving...' : 'Approve Loan'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Rejection Form */}
      {action === 'reject' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Reject Loan Application
            </CardTitle>
            <CardDescription>
              Provide rejection details for this loan application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...rejectionForm}>
              <form onSubmit={rejectionForm.handleSubmit(onReject)} className="space-y-6">
                <FormField
                  control={rejectionForm.control}
                  name="rejectedOnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rejection Date *</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Date when the loan is rejected
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={rejectionForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rejection Reason *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide a detailed reason for rejection..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear explanation for why this loan application is being rejected
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Rejection Warning</AlertTitle>
                  <AlertDescription>
                    By clicking "Reject Loan", you confirm that you have reviewed this application 
                    and are rejecting it. The client will be notified of the rejection and the reason provided.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={rejectLoanMutation.isPending}
                  >
                    {rejectLoanMutation.isPending ? 'Rejecting...' : 'Reject Loan'}
                    <XCircle className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
