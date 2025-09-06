'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  CreditCard, 
  Calculator, 
  Shield, 
  Users, 
  FileText,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { loansApi } from '@/lib/api';
// import { clientsApi } from '@/services/clients'; // Will be created later
import { CreateLoanApplicationRequest, LoanApplicationTemplate, LoanProduct } from '@/types/loans';

// Form validation schema
const loanApplicationSchema = z.object({
  clientId: z.number().min(1, 'Please select a client'),
  productId: z.number().min(1, 'Please select a loan product'),
  principal: z.number().min(1, 'Principal amount is required'),
  loanTermFrequency: z.number().min(1, 'Loan term is required'),
  loanTermFrequencyType: z.number().min(1, 'Term frequency type is required'),
  loanType: z.string().default('individual'),
  numberOfRepayments: z.number().min(1, 'Number of repayments is required'),
  repaymentEvery: z.number().min(1, 'Repayment frequency is required'),
  repaymentFrequencyType: z.number().min(1, 'Repayment frequency type is required'),
  interestRatePerPeriod: z.number().min(0, 'Interest rate must be non-negative'),
  amortizationType: z.number().min(1, 'Amortization type is required'),
  interestType: z.number().min(1, 'Interest type is required'),
  interestCalculationPeriodType: z.number().min(1, 'Interest calculation period is required'),
  transactionProcessingStrategyCode: z.string().min(1, 'Transaction processing strategy is required'),
  expectedDisbursementDate: z.string().min(1, 'Expected disbursement date is required'),
  submittedOnDate: z.string().min(1, 'Submitted date is required'),
  linkAccountId: z.number().optional(),
  createStandingInstructionAtDisbursement: z.boolean().optional(),
  isTopup: z.boolean().optional(),
  loanIdToClose: z.number().optional(),
  topupAmount: z.number().optional(),
  locale: z.literal('en'),
  dateFormat: z.literal('dd MMMM yyyy'),
});

type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

interface StepProps {
  form: any;
  template?: LoanApplicationTemplate;
  selectedProduct?: LoanProduct;
}

// Step 1: Client Selection
function ClientSelectionStep({ form, template }: StepProps) {
  const [clientSearch, setClientSearch] = useState('');
  
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients', clientSearch],
    queryFn: async () => {
      // Mock data for now - will be replaced with actual clientsApi
      if (clientSearch.length < 3) return { pageItems: [] };
      return {
        pageItems: [
          { id: 1, displayName: 'John Doe', accountNo: 'C001', officeName: 'Main Office' },
          { id: 2, displayName: 'Jane Smith', accountNo: 'C002', officeName: 'Branch Office' },
        ]
      };
    },
    enabled: clientSearch.length > 2,
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold">Select Client</h3>
        <p className="text-gray-600">Choose the client for this loan application</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Client</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter client name or ID..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                  />
                  {clients && clients.pageItems.length > 0 && (
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.pageItems.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            <div className="flex flex-col">
                              <span>{client.displayName}</span>
                              <span className="text-xs text-gray-500">
                                ID: {client.accountNo} | {client.officeName}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Search for a client by name or account number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// Step 2: Product Selection
function ProductSelectionStep({ form, template }: StepProps) {
  const selectedProductId = form.watch('productId');
  const selectedProduct = template?.productOptions.find(p => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold">Select Loan Product</h3>
        <p className="text-gray-600">Choose the appropriate loan product</p>
      </div>

      <FormField
        control={form.control}
        name="productId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loan Product</FormLabel>
            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan product" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {template?.productOptions.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-gray-500">
                        {product.currency.displaySymbol}{product.minPrincipal} - {product.currency.displaySymbol}{product.maxPrincipal} | {product.interestRatePerPeriod}% interest
                      </span>
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
        <Card>
          <CardHeader>
            <CardTitle>{selectedProduct.name}</CardTitle>
            <CardDescription>{selectedProduct.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Principal Range</Label>
                <p className="font-medium">
                  {selectedProduct.currency.displaySymbol}{selectedProduct.minPrincipal?.toLocaleString()} - {selectedProduct.currency.displaySymbol}{selectedProduct.maxPrincipal?.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Interest Rate</Label>
                <p className="font-medium">
                  {selectedProduct.minInterestRatePerPeriod}% - {selectedProduct.maxInterestRatePerPeriod}%
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Repayment Terms</Label>
                <p className="font-medium">
                  {selectedProduct.minNumberOfRepayments} - {selectedProduct.maxNumberOfRepayments} payments
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Currency</Label>
                <p className="font-medium">
                  {selectedProduct.currency.name} ({selectedProduct.currency.code})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Step 3: Loan Terms
function LoanTermsStep({ form, selectedProduct }: StepProps) {
  const principal = form.watch('principal');
  const interestRate = form.watch('interestRatePerPeriod');
  const numberOfRepayments = form.watch('numberOfRepayments');

  const calculateMonthlyPayment = () => {
    if (!principal || !interestRate || !numberOfRepayments) return 0;
    const monthlyRate = interestRate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfRepayments)) / 
                   (Math.pow(1 + monthlyRate, numberOfRepayments) - 1);
    return payment;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold">Loan Terms</h3>
        <p className="text-gray-600">Configure the loan amount and repayment terms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter principal amount"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Range: {selectedProduct?.currency.displaySymbol}{selectedProduct?.minPrincipal?.toLocaleString()} - {selectedProduct?.currency.displaySymbol}{selectedProduct?.maxPrincipal?.toLocaleString()}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRatePerPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter interest rate"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Range: {selectedProduct?.minInterestRatePerPeriod}% - {selectedProduct?.maxInterestRatePerPeriod}%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfRepayments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Repayments</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of repayments"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Range: {selectedProduct?.minNumberOfRepayments} - {selectedProduct?.maxNumberOfRepayments} payments
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="loanTermFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Term</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter loan term"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repaymentEvery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repayment Every</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter repayment frequency"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedDisbursementDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Disbursement Date</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Loan Summary */}
      {principal && interestRate && numberOfRepayments && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-blue-700">Principal Amount</Label>
                <p className="font-medium text-blue-900">
                  {selectedProduct?.currency.displaySymbol}{principal.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-blue-700">Estimated Monthly Payment</Label>
                <p className="font-medium text-blue-900">
                  {selectedProduct?.currency.displaySymbol}{calculateMonthlyPayment().toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-blue-700">Total Repayment</Label>
                <p className="font-medium text-blue-900">
                  {selectedProduct?.currency.displaySymbol}{(calculateMonthlyPayment() * numberOfRepayments).toFixed(2)}
                </p>
              </div>
              <div>
                <Label className="text-blue-700">Total Interest</Label>
                <p className="font-medium text-blue-900">
                  {selectedProduct?.currency.displaySymbol}{((calculateMonthlyPayment() * numberOfRepayments) - principal).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Step 4: Review & Submit
function ReviewStep({ form, template }: StepProps) {
  const formData = form.getValues();
  const selectedClient = template?.clientName;
  const selectedProduct = template?.productOptions.find(p => p.id === formData.productId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold">Review Application</h3>
        <p className="text-gray-600">Please review the loan application details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Client</Label>
                <p className="font-medium">{selectedClient}</p>
              </div>
              <div>
                <Label className="text-gray-600">Loan Product</Label>
                <p className="font-medium">{selectedProduct?.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Principal Amount</Label>
                <p className="font-medium">
                  {selectedProduct?.currency.displaySymbol}{formData.principal?.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Interest Rate</Label>
                <p className="font-medium">{formData.interestRatePerPeriod}% per period</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Number of Repayments</Label>
                <p className="font-medium">{formData.numberOfRepayments}</p>
              </div>
              <div>
                <Label className="text-gray-600">Repayment Frequency</Label>
                <p className="font-medium">Every {formData.repaymentEvery} period(s)</p>
              </div>
              <div>
                <Label className="text-gray-600">Expected Disbursement</Label>
                <p className="font-medium">
                  {new Date(formData.expectedDisbursementDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">Application Date</Label>
                <p className="font-medium">
                  {new Date(formData.submittedOnDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const STEPS = [
  { title: 'Client', icon: User, component: ClientSelectionStep },
  { title: 'Product', icon: CreditCard, component: ProductSelectionStep },
  { title: 'Terms', icon: Calculator, component: LoanTermsStep },
  { title: 'Review', icon: FileText, component: ReviewStep },
];

export default function NewLoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      submittedOnDate: new Date().toISOString().split('T')[0],
      loanType: 'individual',
      locale: 'en',
      dateFormat: 'dd MMMM yyyy',
      loanTermFrequencyType: 2, // Months
      repaymentFrequencyType: 2, // Months
      amortizationType: 1, // Equal installments
      interestType: 0, // Declining balance
      interestCalculationPeriodType: 1, // Daily
      transactionProcessingStrategyCode: 'mifos-standard-strategy',
    },
  });

  const clientId = form.watch('clientId');
  const productId = form.watch('productId');

  // Fetch loan application template
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['loan-template', clientId, productId],
    queryFn: () => loansApi.getLoanApplicationTemplate(clientId, productId),
    enabled: !!clientId || !!productId,
  });

  const selectedProduct = template?.productOptions.find(p => p.id === productId);

  // Create loan application mutation
  const createLoanMutation = useMutation({
    mutationFn: (data: CreateLoanApplicationRequest) => loansApi.createLoanApplication(data),
    onSuccess: (result) => {
      toast.success('Loan application created successfully');
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      router.push(`/loans/${result.loanId}`);
    },
    onError: (error) => {
      toast.error(`Failed to create loan application: ${error.message}`);
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepFields = (step: number): (keyof LoanApplicationFormData)[] => {
    switch (step) {
      case 0:
        return ['clientId'];
      case 1:
        return ['productId'];
      case 2:
        return ['principal', 'interestRatePerPeriod', 'numberOfRepayments', 'loanTermFrequency', 'repaymentEvery', 'expectedDisbursementDate'];
      default:
        return [];
    }
  };

  const onSubmit = (data: LoanApplicationFormData) => {
    createLoanMutation.mutate(data);
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <CardTitle className="text-2xl">New Loan Application</CardTitle>
          </div>
          <CardDescription>
            Create a new loan application with our step-by-step wizard
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                        ${isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        Step {index + 1}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CurrentStepComponent 
                form={form} 
                template={template}
                selectedProduct={selectedProduct}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createLoanMutation.isPending}
                  >
                    {createLoanMutation.isPending ? 'Creating...' : 'Submit Application'}
                    <FileText className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
