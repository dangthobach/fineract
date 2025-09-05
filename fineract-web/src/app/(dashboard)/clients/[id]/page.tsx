'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ClientsApi } from '@/lib/api/clients';
import { Client } from '@/types/clients';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Building2, 
  CreditCard, 
  PiggyBank,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Share2,
  Download,
  Upload,
  MoreHorizontal
} from 'lucide-react';

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = parseInt(params.id as string);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch client details
  const {
    data: client,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => ClientsApi.getClient(clientId),
    enabled: !!clientId,
  });

  // Fetch client accounts
  const {
    data: clientAccounts,
    isLoading: accountsLoading
  } = useQuery({
    queryKey: ['client-accounts', clientId],
    queryFn: () => ClientsApi.getClientAccounts(clientId),
    enabled: !!clientId,
  });

  const getStatusBadge = (client: Client) => {
    const statusCode = client.status.code;
    
    if (statusCode === 'clientStatusType.active') {
      return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>;
    } else if (statusCode === 'clientStatusType.pending') {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>;
    } else if (statusCode === 'clientStatusType.closed') {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
        <XCircle className="h-3 w-3 mr-1" />
        Closed
      </Badge>;
    }
    
    return <Badge variant="outline">{client.status.value}</Badge>;
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      <Link href={`/clients/${clientId}/edit`}>
        <Button size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Client
        </Button>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header title="Loading..." />
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <Header title="Client Not Found" />
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">
              {error ? (error as Error).message : 'Client not found'}
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => refetch()}>
                Retry
              </Button>
              <Link href="/clients">
                <Button variant="outline">
                  Back to Clients
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header 
        title={client.displayName}
        actions={headerActions}
      />

      {/* Client Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {client.imagePresent ? (
                  <AvatarImage src={`/api/fineract/clients/${client.id}/images`} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {client.firstname?.charAt(0)}{client.lastname?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold">{client.displayName}</h1>
                  <p className="text-muted-foreground">
                    Account No: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{client.accountNo}</code>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(client)}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    {client.officeName}
                  </div>
                  {client.staffName && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {client.staffName}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div className="text-sm text-muted-foreground">Client ID</div>
              <div className="text-2xl font-bold">{client.id}</div>
              {client.activationDate && (
                <>
                  <div className="text-sm text-muted-foreground">Joined</div>
                  <div className="text-sm">{new Date(client.activationDate).toLocaleDateString()}</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="collateral">Collateral</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="font-medium">{client.firstname}</p>
                  </div>
                  {client.middlename && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Middle Name</label>
                      <p className="font-medium">{client.middlename}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="font-medium">{client.lastname}</p>
                  </div>
                  {client.gender && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="font-medium">{client.gender.name}</p>
                    </div>
                  )}
                  {client.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  )}
                  {client.clientType && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Client Type</label>
                      <p className="font-medium">{client.clientType.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {client.mobileNo && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{client.mobileNo}</span>
                    </div>
                  )}
                  {client.emailAddress && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{client.emailAddress}</span>
                    </div>
                  )}
                  {client.address && client.address.length > 0 && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                      <div>
                        {client.address.map((addr: any, index: number) => (
                          <div key={index} className="text-sm">
                            {[addr.street, addr.city, addr.stateProvinceId, addr.postalCode].filter(Boolean).join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">Loans</p>
                    <p className="text-2xl font-bold">{clientAccounts?.loanAccounts?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <PiggyBank className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium text-muted-foreground">Savings</p>
                    <p className="text-2xl font-bold">{clientAccounts?.savingsAccounts?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Share2 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm font-medium text-muted-foreground">Shares</p>
                    <p className="text-2xl font-bold">{clientAccounts?.shareAccounts?.length || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm font-medium text-muted-foreground">Groups</p>
                    <p className="text-2xl font-bold">{client.groups?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Client Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(client.timeline.submittedOnDate).toLocaleDateString()}
                        {client.timeline.submittedByUsername && ` by ${client.timeline.submittedByUsername}`}
                      </p>
                    </div>
                  </div>
                  {client.timeline.activatedOnDate && (
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Client Activated</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(client.timeline.activatedOnDate).toLocaleDateString()}
                          {client.timeline.activatedByUsername && ` by ${client.timeline.activatedByUsername}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {client.timeline.closedOnDate && (
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Client Closed</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(client.timeline.closedOnDate).toLocaleDateString()}
                          {client.timeline.closedByUsername && ` by ${client.timeline.closedByUsername}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {accountsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Loan Accounts */}
              {clientAccounts?.loanAccounts?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Loan Accounts ({clientAccounts.loanAccounts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientAccounts.loanAccounts.map((loan: any) => (
                        <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{loan.productName}</p>
                            <p className="text-sm text-muted-foreground">Account: {loan.accountNo}</p>
                            <Badge variant="outline" className="mt-1">
                              {loan.status.value}
                            </Badge>
                          </div>
                          <div className="text-right">
                            {loan.accountBalance && (
                              <p className="font-medium">${loan.accountBalance.toLocaleString()}</p>
                            )}
                            <Link href={`/loans/${loan.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Savings Accounts */}
              {clientAccounts?.savingsAccounts?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PiggyBank className="h-5 w-5 mr-2" />
                      Savings Accounts ({clientAccounts.savingsAccounts.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientAccounts.savingsAccounts.map((savings: any) => (
                        <div key={savings.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{savings.productName}</p>
                            <p className="text-sm text-muted-foreground">Account: {savings.accountNo}</p>
                            <Badge variant="outline" className="mt-1">
                              {savings.status.value}
                            </Badge>
                          </div>
                          <div className="text-right">
                            {savings.accountBalance && (
                              <p className="font-medium">${savings.accountBalance.toLocaleString()}</p>
                            )}
                            <Link href={`/savings/${savings.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!clientAccounts?.loanAccounts?.length && !clientAccounts?.savingsAccounts?.length) && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No accounts found</p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline">
                        Create Loan Account
                      </Button>
                      <Button variant="outline">
                        Create Savings Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Transaction history will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Document management will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Family Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.familyMembers && client.familyMembers.length > 0 ? (
                <div className="space-y-4">
                  {client.familyMembers.map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{member.firstname} {member.lastname}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.relationship?.name} • Age: {member.age || 'N/A'}
                        </p>
                      </div>
                      <Badge variant={member.isDependent ? "secondary" : "outline"}>
                        {member.isDependent ? "Dependent" : "Independent"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No family members registered.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collateral">
          <Card>
            <CardHeader>
              <CardTitle>Collateral Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Collateral management will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
