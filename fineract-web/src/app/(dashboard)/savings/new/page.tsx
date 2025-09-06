'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  ArrowLeft,
  ArrowRight,
  PiggyBank,
  User,
  CreditCard,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

import { savingsAccountsApi, savingsProductsApi } from '@/lib/api'

// Validation schema
const savingsAccountSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  productId: z.number().min(1, 'Product is required'),
  fieldOfficerId: z.number().optional(),
  submittedOnDate: z.string().min(1, 'Submission date is required'),
  nominalAnnualInterestRate: z.number().optional(),
  minRequiredOpeningBalance: z.number().optional(),
  lockinPeriodFrequency: z.number().optional(),
  lockinPeriodFrequencyType: z.number().optional(),
  withdrawalFeeForTransfers: z.boolean().optional(),
  allowOverdraft: z.boolean().optional(),
  overdraftLimit: z.number().optional(),
  minRequiredBalance: z.number().optional(),
  enforceMinRequiredBalance: z.boolean().optional(),
  minBalanceForInterestCalculation: z.number().optional(),
  withHoldTax: z.boolean().optional(),
  externalId: z.string().optional(),
})

type SavingsAccountFormData = z.infer<typeof savingsAccountSchema>

// Mock data for development
const mockClients = [
  { id: 1, displayName: 'Maria Santos', officeId: 1, officeName: 'Head Office' },
  { id: 2, displayName: 'Juan Rodriguez', officeId: 1, officeName: 'Head Office' },
  { id: 3, displayName: 'Ana Garcia', officeId: 1, officeName: 'Head Office' },
  { id: 4, displayName: 'Carlos Lopez', officeId: 1, officeName: 'Head Office' },
]

const mockProducts = [
  {
    id: 1,
    name: 'Regular Savings Account',
    shortName: 'RSA',
    currency: { code: 'USD', displaySymbol: '$' },
    nominalAnnualInterestRate: 3.5,
    minRequiredOpeningBalance: 50,
    description: 'Standard savings account for regular customers'
  },
  {
    id: 2,
    name: 'High Yield Savings',
    shortName: 'HYS',
    currency: { code: 'USD', displaySymbol: '$' },
    nominalAnnualInterestRate: 5.0,
    minRequiredOpeningBalance: 1000,
    description: 'High interest savings account with higher minimum balance'
  },
  {
    id: 3,
    name: 'Youth Savings Account',
    shortName: 'YSA',
    currency: { code: 'USD', displaySymbol: '$' },
    nominalAnnualInterestRate: 4.0,
    minRequiredOpeningBalance: 10,
    description: 'Special savings account for youth customers'
  }
]

const mockFieldOfficers = [
  { id: 1, displayName: 'John Smith', officeId: 1, officeName: 'Head Office' },
  { id: 2, displayName: 'Sarah Johnson', officeId: 1, officeName: 'Head Office' },
  { id: 3, displayName: 'Mike Brown', officeId: 1, officeName: 'Head Office' }
]

export default function NewSavingsAccountPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const form = useForm<SavingsAccountFormData>({
    resolver: zodResolver(savingsAccountSchema),
    defaultValues: {
      submittedOnDate: new Date().toISOString().split('T')[0],
      withdrawalFeeForTransfers: false,
      allowOverdraft: false,
      enforceMinRequiredBalance: true,
      withHoldTax: false,
    },
  })

  const steps = [
    { number: 1, title: 'Client Selection', description: 'Choose the client for this account' },
    { number: 2, title: 'Product Selection', description: 'Select savings product and configure terms' },
    { number: 3, title: 'Account Configuration', description: 'Set up account details and preferences' },
    { number: 4, title: 'Review & Submit', description: 'Review all details and submit application' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const onSubmit = async (data: SavingsAccountFormData) => {
    try {
      // Mock submission for development
      console.log('Submitting savings account:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to savings list
      router.push('/savings?created=true')
    } catch (error) {
      console.error('Error creating savings account:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              New Savings Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a new savings account application
            </p>
          </div>
        </div>
        <Badge variant="outline">
          Step {currentStep} of {steps.length}
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Client Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Client Selection
                </CardTitle>
                <CardDescription>
                  Choose the client for this savings account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value))
                          const client = mockClients.find(c => c.id === parseInt(value))
                          setSelectedClient(client)
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              <div>
                                <div className="font-medium">{client.displayName}</div>
                                <div className="text-sm text-gray-500">{client.officeName}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedClient && (
                  <Alert>
                    <User className="h-4 w-4" />
                    <AlertDescription>
                      Selected client: <strong>{selectedClient.displayName}</strong> from {selectedClient.officeName}
                    </AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="submittedOnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="externalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="External system identifier" {...field} />
                      </FormControl>
                      <FormDescription>
                        Reference ID from external system (if applicable)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Product Selection */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Product Selection
                </CardTitle>
                <CardDescription>
                  Choose savings product and configure basic terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Savings Product *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value))
                          const product = mockProducts.find(p => p.id === parseInt(value))
                          setSelectedProduct(product)
                          if (product) {
                            form.setValue('nominalAnnualInterestRate', product.nominalAnnualInterestRate)
                            form.setValue('minRequiredOpeningBalance', product.minRequiredOpeningBalance)
                          }
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a savings product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">
                                  {product.nominalAnnualInterestRate}% | Min: {formatCurrency(product.minRequiredOpeningBalance)}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedProduct && (
                  <Alert>
                    <PiggyBank className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div><strong>{selectedProduct.name}</strong></div>
                        <div className="text-sm">
                          Interest Rate: {selectedProduct.nominalAnnualInterestRate}% | 
                          Min Opening Balance: {formatCurrency(selectedProduct.minRequiredOpeningBalance)}
                        </div>
                        <div className="text-sm text-gray-600">{selectedProduct.description}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nominalAnnualInterestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="3.50"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Annual interest rate percentage
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minRequiredOpeningBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Opening Balance</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="50.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum balance required to open account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fieldOfficerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Officer (Optional)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field officer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockFieldOfficers.map((officer) => (
                            <SelectItem key={officer.id} value={officer.id.toString()}>
                              {officer.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Account Configuration */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Configuration
                </CardTitle>
                <CardDescription>
                  Configure advanced account settings and restrictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minRequiredBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Required Balance</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="25.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum balance to maintain
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minBalanceForInterestCalculation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Balance for Interest</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="10.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum balance to earn interest
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lockinPeriodFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lock-in Period</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="6"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Lock-in period duration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overdraftLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overdraft Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="500.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum overdraft allowed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="withdrawalFeeForTransfers"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Withdrawal Fee for Transfers
                          </FormLabel>
                          <FormDescription>
                            Charge withdrawal fee when transferring funds
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowOverdraft"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Overdraft
                          </FormLabel>
                          <FormDescription>
                            Allow account balance to go negative
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enforceMinRequiredBalance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Enforce Min Required Balance
                          </FormLabel>
                          <FormDescription>
                            Prevent withdrawals below minimum balance
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="withHoldTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Withhold Tax
                          </FormLabel>
                          <FormDescription>
                            Automatically deduct tax from interest earnings
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Review & Submit
                </CardTitle>
                <CardDescription>
                  Review all account details before submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary sections */}
                <div className="grid gap-4">
                  {/* Client Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Client Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Client:</span> {selectedClient?.displayName}</p>
                      <p><span className="font-medium">Office:</span> {selectedClient?.officeName}</p>
                      <p><span className="font-medium">Submitted Date:</span> {form.watch('submittedOnDate')}</p>
                      {form.watch('externalId') && (
                        <p><span className="font-medium">External ID:</span> {form.watch('externalId')}</p>
                      )}
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Product Information</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Product:</span> {selectedProduct?.name}</p>
                      <p><span className="font-medium">Interest Rate:</span> {form.watch('nominalAnnualInterestRate')}% p.a.</p>
                      <p><span className="font-medium">Min Opening Balance:</span> {formatCurrency(form.watch('minRequiredOpeningBalance') || 0)}</p>
                      {form.watch('fieldOfficerId') && (
                        <p><span className="font-medium">Field Officer:</span> {mockFieldOfficers.find(o => o.id === form.watch('fieldOfficerId'))?.displayName}</p>
                      )}
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Account Settings</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Withdrawal Fee for Transfers:</span> {form.watch('withdrawalFeeForTransfers') ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Allow Overdraft:</span> {form.watch('allowOverdraft') ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Enforce Min Balance:</span> {form.watch('enforceMinRequiredBalance') ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Withhold Tax:</span> {form.watch('withHoldTax') ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please review all information carefully. Once submitted, the savings account application will be created and pending approval.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep === 4 ? (
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !form.watch('clientId')) ||
                      (currentStep === 2 && !form.watch('productId'))
                    }
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
