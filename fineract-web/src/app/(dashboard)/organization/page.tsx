'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { organizationApi } from '@/lib/api/organization';
import type { Office, Staff, Teller, Holiday } from '@/types/organization';
import { Building2, Users, Calculator, Calendar, Plus, Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function OrganizationPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [tellers, setTellers] = useState<Teller[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'offices' | 'staff' | 'tellers' | 'holidays'>('offices');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [officesRes, staffRes, tellersRes, holidaysRes] = await Promise.all([
        organizationApi.offices.getOffices(),
        organizationApi.staff.getStaff(),
        organizationApi.tellers.getTellers(),
        organizationApi.holidays.getHolidays(),
      ]);

      setOffices(officesRes);
      setStaff(staffRes);
      setTellers(tellersRes);
      setHolidays(holidaysRes);
    } catch (error) {
      console.error('Failed to load organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Office columns
  const officeColumns: ColumnDef<Office>[] = [
    {
      accessorKey: 'name',
      header: 'Office Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'externalId',
      header: 'External ID',
    },
    {
      accessorKey: 'parentName',
      header: 'Parent Office',
      cell: ({ row }) => row.getValue('parentName') || 'Head Office',
    },
    {
      accessorKey: 'openingDate',
      header: 'Opening Date',
      cell: ({ row }) => new Date(row.getValue('openingDate')).toLocaleDateString(),
    },
    {
      accessorKey: 'hierarchy',
      header: 'Hierarchy Level',
      cell: ({ row }) => {
        const hierarchy = row.getValue('hierarchy') as string;
        const level = hierarchy ? hierarchy.split('.').length - 1 : 0;
        return <Badge variant="outline">Level {level}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      ),
    },
  ];

  // Staff columns
  const staffColumns: ColumnDef<Staff>[] = [
    {
      accessorKey: 'displayName',
      header: 'Staff Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('displayName')}</div>
      ),
    },
    {
      accessorKey: 'officeName',
      header: 'Office',
    },
    {
      accessorKey: 'isLoanOfficer',
      header: 'Loan Officer',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isLoanOfficer') ? 'default' : 'secondary'}>
          {row.getValue('isLoanOfficer') ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('isActive') ? 'default' : 'destructive'}>
          {row.getValue('isActive') ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'joiningDate',
      header: 'Joining Date',
      cell: ({ row }) => {
        const date = row.getValue('joiningDate');
        return date ? new Date(date as string).toLocaleDateString() : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Profile
          </Button>
        </div>
      ),
    },
  ];

  // Teller columns
  const tellerColumns: ColumnDef<Teller>[] = [
    {
      accessorKey: 'name',
      header: 'Teller Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'officeName',
      header: 'Office',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = status === 'ACTIVE' ? 'default' : 
                      status === 'INACTIVE' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => new Date(row.getValue('startDate')).toLocaleDateString(),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => {
        const date = row.getValue('endDate');
        return date ? new Date(date as string).toLocaleDateString() : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Manage
          </Button>
          <Button variant="outline" size="sm">
            Cashiers
          </Button>
        </div>
      ),
    },
  ];

  // Holiday columns
  const holidayColumns: ColumnDef<Holiday>[] = [
    {
      accessorKey: 'name',
      header: 'Holiday Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'fromDate',
      header: 'From Date',
      cell: ({ row }) => new Date(row.getValue('fromDate')).toLocaleDateString(),
    },
    {
      accessorKey: 'toDate',
      header: 'To Date',
      cell: ({ row }) => new Date(row.getValue('toDate')).toLocaleDateString(),
    },
    {
      accessorKey: 'offices',
      header: 'Applicable Offices',
      cell: ({ row }) => {
        const offices = row.getValue('offices') as Office[];
        return <span>{offices?.length || 0} offices</span>;
      },
    },
    {
      accessorKey: 'processed',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('processed') ? 'default' : 'secondary'}>
          {row.getValue('processed') ? 'Processed' : 'Pending'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Activate
          </Button>
        </div>
      ),
    },
  ];

  // Filter data based on search term
  const filterData = (data: any[], searchFields: string[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      searchFields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredOffices = filterData(offices, ['name', 'externalId', 'parentName']);
  const filteredStaff = filterData(staff, ['displayName', 'officeName']);
  const filteredTellers = filterData(tellers, ['name', 'officeName']);
  const filteredHolidays = filterData(holidays, ['name']);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
        <p className="text-muted-foreground">
          Manage offices, staff, tellers, and organizational settings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offices</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offices.length}</div>
            <p className="text-xs text-muted-foreground">
              +{offices.filter(o => new Date(o.openingDate) > new Date(Date.now() - 30*24*60*60*1000)).length} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.filter(s => s.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              {staff.filter(s => s.isLoanOfficer).length} loan officers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tellers</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tellers.filter(t => t.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">
              {tellers.reduce((acc, t) => acc + (t.cashiers?.length || 0), 0)} cashiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidays.filter(h => new Date(h.fromDate) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {holidays.filter(h => !h.processed).length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { id: 'offices', name: 'Offices', icon: Building2 },
            { id: 'staff', name: 'Staff', icon: Users },
            { id: 'tellers', name: 'Tellers', icon: Calculator },
            { id: 'holidays', name: 'Holidays', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Data Tables */}
      <div className="space-y-4">
        {activeTab === 'offices' && (
          <Card>
            <CardHeader>
              <CardTitle>Offices</CardTitle>
              <CardDescription>
                Manage office hierarchy and branch locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={officeColumns} data={filteredOffices} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'staff' && (
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                Manage staff profiles and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={staffColumns} data={filteredStaff} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'tellers' && (
          <Card>
            <CardHeader>
              <CardTitle>Tellers</CardTitle>
              <CardDescription>
                Manage tellers and cashier assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={tellerColumns} data={filteredTellers} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'holidays' && (
          <Card>
            <CardHeader>
              <CardTitle>Holidays</CardTitle>
              <CardDescription>
                Configure holidays and repayment rescheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={holidayColumns} data={filteredHolidays} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
