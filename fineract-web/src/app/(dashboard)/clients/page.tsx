'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientsApi } from '@/lib/api/clients';
import { Client, ClientSearchParams } from '@/types/clients';
import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  MoreHorizontal,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientListPageProps {}

export default function ClientListPage({}: ClientListPageProps) {
  const [searchParams, setSearchParams] = useState<ClientSearchParams>({
    search: '',
    offset: 0,
    limit: 50,
    orderBy: 'displayName',
    sortOrder: 'ASC'
  });

  const [selectedClients, setSelectedClients] = useState<number[]>([]);

  // Fetch clients data
  const {
    data: clientsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients', searchParams],
    queryFn: () => ClientsApi.getAllClients(searchParams),
    staleTime: 30000, // 30 seconds
  });

  // Calculate stats
  const stats = useMemo(() => {
    if (!clientsData?.pageItems) return null;
    
    const clients = clientsData.pageItems;
    const totalClients = clientsData.totalFilteredRecords || clients.length;
    const activeClients = clients.filter((c: Client) => c.active).length;
    const pendingClients = clients.filter((c: Client) => c.status.code === 'clientStatusType.pending').length;
    const closedClients = clients.filter((c: Client) => c.status.code === 'clientStatusType.closed').length;

    return {
      totalClients,
      activeClients,
      pendingClients,
      closedClients
    };
  }, [clientsData]);

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      offset: 0
    }));
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({
      ...prev,
      filters: status === 'all' ? {} : { status },
      offset: 0
    }));
  };

  const handleOfficeFilter = (officeId: string) => {
    setSearchParams(prev => ({
      ...prev,
      officeId: officeId === 'all' ? undefined : parseInt(officeId),
      offset: 0
    }));
  };

  const handleSort = (field: string) => {
    setSearchParams(prev => ({
      ...prev,
      orderBy: field,
      sortOrder: prev.orderBy === field && prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      offset: 0
    }));
  };

  const handlePageChange = (newOffset: number) => {
    setSearchParams(prev => ({
      ...prev,
      offset: newOffset
    }));
  };

  const handleClientSelection = (clientId: number, selected: boolean) => {
    if (selected) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

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
        Import
      </Button>
      <Link href="/clients/new">
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </Link>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <Header title="Clients" actions={headerActions} />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading clients: {(error as Error).message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header title="Clients" actions={headerActions} />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold">{stats.totalClients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.activeClients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingClients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Closed</p>
                  <p className="text-2xl font-bold">{stats.closedClients.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients by name, account number, or phone..."
                className="pl-10"
                value={searchParams.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                Manage your client portfolio and relationships
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {clientsData?.totalFilteredRecords && (
                <>Showing {clientsData.pageItems?.length || 0} of {clientsData.totalFilteredRecords} clients</>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClients(clientsData?.pageItems?.map((c: Client) => c.id) || []);
                        } else {
                          setSelectedClients([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('displayName')}>
                    Client Name
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('accountNo')}>
                    Account No
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('activationDate')}>
                    Joined Date
                  </TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={9}>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : clientsData?.pageItems?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No clients found</p>
                        <p className="text-sm">Get started by adding your first client</p>
                        <Link href="/clients/new">
                          <Button className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Client
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  clientsData?.pageItems?.map((client: Client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedClients.includes(client.id)}
                          onChange={(e) => handleClientSelection(client.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            {client.imagePresent ? (
                              <AvatarImage src={`/api/fineract/clients/${client.id}/images`} />
                            ) : (
                              <AvatarFallback>
                                {client.firstname?.charAt(0)}{client.lastname?.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <Link href={`/clients/${client.id}`}>
                              <p className="font-medium hover:text-blue-600 cursor-pointer">
                                {client.displayName}
                              </p>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              ID: {client.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {client.accountNo}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{client.officeName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.mobileNo && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {client.mobileNo}
                            </div>
                          )}
                          {client.emailAddress && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.emailAddress}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{client.staffName || 'Unassigned'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {client.activationDate ? new Date(client.activationDate).toLocaleDateString() : 'Not activated'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${client.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${client.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Client
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Client
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
          {clientsData?.totalFilteredRecords && clientsData.totalFilteredRecords > searchParams.limit! && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(searchParams.offset || 0) + 1} to {Math.min((searchParams.offset || 0) + (searchParams.limit || 50), clientsData.totalFilteredRecords)} of {clientsData.totalFilteredRecords} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(searchParams.offset || 0) === 0}
                  onClick={() => handlePageChange((searchParams.offset || 0) - (searchParams.limit || 50))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(searchParams.offset || 0) + (searchParams.limit || 50) >= clientsData.totalFilteredRecords}
                  onClick={() => handlePageChange((searchParams.offset || 0) + (searchParams.limit || 50))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedClients.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {selectedClients.length} client{selectedClients.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="outline" size="sm">
                Bulk Actions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClients([])}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
