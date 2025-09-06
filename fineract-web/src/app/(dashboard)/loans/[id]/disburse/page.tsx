'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CheckCircleIcon,
  DollarSignIcon,
  CalendarIcon,
  CreditCardIcon,
  Building2Icon,
  UserIcon,
  AlertTriangleIcon,
  InfoIcon
} from 'lucide-react'

// Mock loan data
const mockLoan = {
  id: '1',
  loanNumber: 'LN-2024-001',
  clientName: 'Maria Santos',
  clientAccount: 'AC-2024-MS-001',
  productName: 'Micro Business Loan',
  approvedAmount: 15000,
  disbursementAmount: 15000,
  interestRate: 12.5,
  tenor: 12,
  approvalDate: '2024-01-10',
  status: 'approved',
  disbursementMethods: [
    { id: 'bank_transfer', name: 'Bank Transfer', available: true },
    { id: 'cash', name: 'Cash Disbursement', available: true },
    { id: 'mobile_money', name: 'Mobile Money', available: false },
    { id: 'check', name: 'Check', available: true }
  ]
}

interface DisbursementForm {
  disbursementDate: string
  disbursementAmount: string
  disbursementMethod: string
  bankAccount: string
  notes: string
}

export default function LoanDisbursementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState<DisbursementForm>({
    disbursementDate: new Date().toISOString().split('T')[0],
    disbursementAmount: mockLoan.disbursementAmount.toString(),
    disbursementMethod: '',
    bankAccount: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Partial<DisbursementForm>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<DisbursementForm> = {}

    if (!formData.disbursementDate) {
      newErrors.disbursementDate = 'Disbursement date is required'
    }

    if (!formData.disbursementAmount || parseFloat(formData.disbursementAmount) <= 0) {
      newErrors.disbursementAmount = 'Valid disbursement amount is required'
    }

    if (parseFloat(formData.disbursementAmount) > mockLoan.approvedAmount) {
      newErrors.disbursementAmount = 'Disbursement amount cannot exceed approved amount'
    }

    if (!formData.disbursementMethod) {
      newErrors.disbursementMethod = 'Disbursement method is required'
    }

    if (formData.disbursementMethod === 'bank_transfer' && !formData.bankAccount) {
      newErrors.bankAccount = 'Bank account is required for bank transfer'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirmDisbursement = async () => {
    setIsProcessing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setShowConfirmDialog(false)
      // Show success message or redirect
      router.push(`/loans/${params.id}?tab=transactions`)
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.disbursementAmount) || 0
    const monthlyRate = mockLoan.interestRate / 100 / 12
    const payments = mockLoan.tenor
    
    if (monthlyRate === 0) return principal / payments
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
           (Math.pow(1 + monthlyRate, payments) - 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Loan Disbursement
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Process loan disbursement for {mockLoan.clientName} - {mockLoan.loanNumber}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Status: {mockLoan.status.toUpperCase()}
        </Badge>
      </div>

      {/* Loan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="h-5 w-5 mr-2" />
            Loan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Client</div>
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                <span className="font-semibold">{mockLoan.clientName}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Product</div>
              <div className="font-semibold">{mockLoan.productName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Approved Amount</div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(mockLoan.approvedAmount)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Interest Rate</div>
              <div className="font-semibold">{mockLoan.interestRate}% p.a.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Disbursement Form */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2" />
              Disbursement Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disbursementDate">Disbursement Date</Label>
                <Input
                  id="disbursementDate"
                  type="date"
                  value={formData.disbursementDate}
                  onChange={(e) => setFormData({ ...formData, disbursementDate: e.target.value })}
                  className={errors.disbursementDate ? 'border-red-500' : ''}
                />
                {errors.disbursementDate && (
                  <p className="text-red-500 text-sm">{errors.disbursementDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="disbursementAmount">Disbursement Amount</Label>
                <Input
                  id="disbursementAmount"
                  type="number"
                  step="0.01"
                  value={formData.disbursementAmount}
                  onChange={(e) => setFormData({ ...formData, disbursementAmount: e.target.value })}
                  className={errors.disbursementAmount ? 'border-red-500' : ''}
                />
                {errors.disbursementAmount && (
                  <p className="text-red-500 text-sm">{errors.disbursementAmount}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Maximum: {formatCurrency(mockLoan.approvedAmount)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disbursementMethod">Disbursement Method</Label>
                <Select
                  value={formData.disbursementMethod}
                  onValueChange={(value) => setFormData({ ...formData, disbursementMethod: value })}
                >
                  <SelectTrigger className={errors.disbursementMethod ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select disbursement method" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLoan.disbursementMethods
                      .filter(method => method.available)
                      .map(method => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center">
                            {method.id === 'bank_transfer' && <Building2Icon className="h-4 w-4 mr-2" />}
                            {method.id === 'cash' && <DollarSignIcon className="h-4 w-4 mr-2" />}
                            {method.id === 'check' && <CreditCardIcon className="h-4 w-4 mr-2" />}
                            {method.name}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.disbursementMethod && (
                  <p className="text-red-500 text-sm">{errors.disbursementMethod}</p>
                )}
              </div>

              {formData.disbursementMethod === 'bank_transfer' && (
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account</Label>
                  <Input
                    id="bankAccount"
                    placeholder="Enter bank account number"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className={errors.bankAccount ? 'border-red-500' : ''}
                  />
                  {errors.bankAccount && (
                    <p className="text-red-500 text-sm">{errors.bankAccount}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for disbursement"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Process Disbursement
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Disbursement Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Disbursement Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                Please review all details before processing the disbursement. This action cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Disbursement Amount:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(parseFloat(formData.disbursementAmount) || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Monthly Payment:</span>
                <span className="font-semibold">
                  {formatCurrency(calculateMonthlyPayment())}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Loan Term:</span>
                <span className="font-semibold">{mockLoan.tenor} months</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Interest Rate:</span>
                <span className="font-semibold">{mockLoan.interestRate}% p.a.</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Interest:</span>
                <span className="font-semibold">
                  {formatCurrency((calculateMonthlyPayment() * mockLoan.tenor) - (parseFloat(formData.disbursementAmount) || 0))}
                </span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Repayment:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(calculateMonthlyPayment() * mockLoan.tenor)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Disbursement</DialogTitle>
            <DialogDescription>
              Are you sure you want to process this loan disbursement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Client:</span>
                <span>{mockLoan.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className="font-bold">{formatCurrency(parseFloat(formData.disbursementAmount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Method:</span>
                <span>{mockLoan.disbursementMethods.find(m => m.id === formData.disbursementMethod)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formData.disbursementDate}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisbursement}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Disbursement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
