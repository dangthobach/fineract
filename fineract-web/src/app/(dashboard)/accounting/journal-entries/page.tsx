'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, FileText, Eye, Trash2, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { accountingApi } from '@/lib/api/accounting';
import type { JournalEntry } from '@/types/accounting';
import { format } from 'date-fns';

export default function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOffice, setFilterOffice] = useState('');
  const [filterAccount, setFilterAccount] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setLoading(true);
      const data = await accountingApi.journalEntries.getAll();
      setEntries(data.pageItems || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReverseEntry = async (entryId: number) => {
    try {
      await accountingApi.journalEntries.reverse(entryId, 'Reversed by user');
      await loadJournalEntries(); // Reload data
    } catch (error) {
      console.error('Error reversing entry:', error);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.glAccountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOffice = !filterOffice || entry.officeName === filterOffice;
    const matchesAccount = !filterAccount || entry.glAccountName.includes(filterAccount);
    return matchesSearch && matchesOffice && matchesAccount;
  });

  const totalDebits = filteredEntries
    .filter(e => e.entryType === 'DEBIT')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCredits = filteredEntries
    .filter(e => e.entryType === 'CREDIT')
    .reduce((sum, e) => sum + e.amount, 0);

  const getEntryTypeColor = (type: string) => {
    return type === 'DEBIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-600 mt-1">Manage general ledger journal entries and transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Trial Balance
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center text-gray-500">
                Journal entry creation form will be implemented here
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Debits</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalDebits.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-red-600">
                  ${totalCredits.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Difference</p>
                <p className={`text-2xl font-bold ${Math.abs(totalDebits - totalCredits) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(totalDebits - totalCredits).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Journal Entries</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterOffice} onValueChange={setFilterOffice}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Offices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Offices</SelectItem>
                  {/* Add office options here */}
                </SelectContent>
              </Select>
              <Select value={filterAccount} onValueChange={setFilterAccount}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Accounts</SelectItem>
                  {/* Add account options here */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading journal entries...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>GL Account</TableHead>
                    <TableHead>Entry Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {format(new Date(entry.transactionDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-mono">{entry.transactionId}</TableCell>
                      <TableCell>{entry.officeName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.glAccountName}</p>
                          <p className="text-sm text-gray-500">{entry.glAccountCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEntryTypeColor(entry.entryType)}>
                          {entry.entryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.reversed ? 'destructive' : 'default'}>
                          {entry.reversed ? 'Reversed' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!entry.reversed && entry.manualEntry && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-orange-600"
                              onClick={() => handleReverseEntry(entry.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                          {!entry.reversed && entry.manualEntry && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEntries.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No journal entries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Details Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Journal Entry Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                  <p className="font-mono">{selectedEntry.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p>{format(new Date(selectedEntry.transactionDate), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Office</label>
                  <p>{selectedEntry.officeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entry Type</label>
                  <Badge className={getEntryTypeColor(selectedEntry.entryType)}>
                    {selectedEntry.entryType}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">GL Account</label>
                  <p>{selectedEntry.glAccountName} ({selectedEntry.glAccountCode})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="font-mono text-lg">${selectedEntry.amount.toLocaleString()}</p>
                </div>
              </div>
              {selectedEntry.comments && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Comments</label>
                  <p className="mt-1 text-gray-800">{selectedEntry.comments}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Created by {selectedEntry.createdByUserName} on {format(new Date(selectedEntry.createdDate), 'MMM dd, yyyy HH:mm')}
                </div>
                {selectedEntry.reversed && (
                  <Badge variant="destructive">Reversed</Badge>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
