'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ClientsApi } from '@/lib/api/clients';
import { CreateClientRequest, ClientTemplate } from '@/types/clients';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';

// Form validation schema
const clientFormSchema = z.object({
  officeId: z.number().min(1, 'Office is required'),
  firstname: z.string().min(1, 'First name is required').max(50),
  middlename: z.string().optional(),
  lastname: z.string().min(1, 'Last name is required').max(50),
  mobileNo: z.string().optional(),
  emailAddress: z.string().email().optional().or(z.literal('')),
  dateOfBirth: z.date().optional(),
  genderId: z.number().optional(),
  clientTypeId: z.number().optional(),
  clientClassificationId: z.number().optional(),
  staffId: z.number().optional(),
  active: z.boolean().default(false),
  activationDate: z.date().optional(),
  submittedOnDate: z.date(),
  savingsProductId: z.number().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  mode: 'create' | 'edit';
  clientId?: number;
}

export function ClientForm({ mode, clientId }: ClientFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch client template for form options
  const {
    data: template,
    isLoading: templateLoading,
    error: templateError
  } = useQuery({
    queryKey: ['client-template'],
    queryFn: ClientsApi.getClientTemplate,
  });

  // Fetch existing client data for edit mode
  const {
    data: existingClient,
    isLoading: clientLoading,
    error: clientError
  } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientId ? ClientsApi.getClient(clientId) : null,
    enabled: mode === 'edit' && !!clientId,
  });

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      officeId: 0,
      firstname: '',
      middlename: '',
      lastname: '',
      mobileNo: '',
      emailAddress: '',
      active: false,
      submittedOnDate: new Date(),
    },
  });

  // Update form with existing client data
  useEffect(() => {
    if (existingClient && mode === 'edit') {
      form.reset({
        officeId: existingClient.officeId,
        firstname: existingClient.firstname,
        middlename: existingClient.middlename || '',
        lastname: existingClient.lastname,
        mobileNo: existingClient.mobileNo || '',
        emailAddress: existingClient.emailAddress || '',
        dateOfBirth: existingClient.dateOfBirth ? new Date(existingClient.dateOfBirth) : undefined,
        genderId: existingClient.gender?.id,
        clientTypeId: existingClient.clientType?.id,
        clientClassificationId: existingClient.clientClassification?.id,
        staffId: existingClient.staffId,
        active: existingClient.active,
        activationDate: existingClient.activationDate ? new Date(existingClient.activationDate) : undefined,
        submittedOnDate: new Date(existingClient.timeline.submittedOnDate),
        savingsProductId: existingClient.savingsProductId,
      });
    }
  }, [existingClient, mode, form]);

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: (data: CreateClientRequest) => ClientsApi.createClient(data),
    onSuccess: (response) => {
      toast.success('Client created successfully');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${response.clientId || response.resourceId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create client');
      setIsSubmitting(false);
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: (data: any) => ClientsApi.updateClient(clientId!, data),
    onSuccess: () => {
      toast.success('Client updated successfully');
      queryClient.invalidateQueries({ queryKey: ['client', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${clientId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update client');
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: ClientFormValues) => {
    setIsSubmitting(true);
    
    const formData = {
      ...values,
      dateFormat: 'yyyy-MM-dd',
      locale: 'en',
      submittedOnDate: values.submittedOnDate.toISOString().split('T')[0],
      activationDate: values.activationDate?.toISOString().split('T')[0],
      dateOfBirth: values.dateOfBirth?.toISOString().split('T')[0],
    };

    if (mode === 'create') {
      createClientMutation.mutate(formData as CreateClientRequest);
    } else {
      updateClientMutation.mutate(formData);
    }
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Link href={mode === 'edit' ? `/clients/${clientId}` : '/clients'}>
        <Button variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </Link>
      <Button 
        type="submit" 
        form="client-form" 
        disabled={isSubmitting}
        size="sm"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Client' : 'Update Client'}
      </Button>
    </div>
  );

  if (templateLoading || (mode === 'edit' && clientLoading)) {
    return (
      <div className="space-y-6">
        <Header 
          title={mode === 'create' ? 'Create Client' : 'Edit Client'}
        />
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (templateError || (mode === 'edit' && clientError)) {
    return (
      <div className="space-y-6">
        <Header title="Error Loading Form" />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              {templateError?.message || clientError?.message || 'Failed to load form data'}
            </p>
            <Link href="/clients">
              <Button>Back to Clients</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title={mode === 'create' ? 'Create New Client' : 'Edit Client'}
        actions={headerActions}
      />

      <Form {...form}>
        <form id="client-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the client's basic personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="officeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select office" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {template?.officeOptions?.map((office: any) => (
                            <SelectItem key={office.id} value={office.id.toString()}>
                              {office.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="staffId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff/Loan Officer</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {template?.staffOptions?.map((staff: any) => (
                            <SelectItem key={staff.id} value={staff.id.toString()}>
                              {staff.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middlename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mobileNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Select date of birth"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Not specified</SelectItem>
                          {template?.genderOptions?.map((gender: any) => (
                            <SelectItem key={gender.id} value={gender.id.toString()}>
                              {gender.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Type</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Not specified</SelectItem>
                          {template?.clientTypeOptions?.map((type: any) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientClassificationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Classification</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select classification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not specified</SelectItem>
                        {template?.clientClassificationOptions?.map((classification: any) => (
                          <SelectItem key={classification.id} value={classification.id.toString()}>
                            {classification.name}
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

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Configure account activation and savings product settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="submittedOnDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted On *</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Select submission date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="savingsProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Savings Product</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                        value={field.value?.toString() || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select savings product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {template?.savingProductOptions?.map((product: any) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Activate Client Immediately
                        </FormLabel>
                        <FormDescription>
                          If checked, the client will be activated immediately upon creation.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch('active') && (
                  <FormField
                    control={form.control}
                    name="activationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activation Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onDateChange={field.onChange}
                            placeholder="Select activation date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

export default ClientForm;
