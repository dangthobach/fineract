'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, CreditCard, PiggyBank, FileText, Clock, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'client' | 'loan' | 'savings' | 'transaction';
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'client',
    title: 'John Smith',
    subtitle: 'Client ID: C001',
    badge: 'Active',
    href: '/clients/C001'
  },
  {
    id: '2',
    type: 'client',
    title: 'Maria Garcia',
    subtitle: 'Client ID: C002',
    badge: 'Active',
    href: '/clients/C002'
  },
  {
    id: '3',
    type: 'loan',
    title: 'Personal Loan #LA-2024-001',
    subtitle: 'John Smith - $15,000',
    badge: 'Active',
    href: '/loans/LA-2024-001'
  },
  {
    id: '4',
    type: 'savings',
    title: 'Savings Account #SA-001',
    subtitle: 'Maria Garcia - $5,240',
    badge: 'Active',
    href: '/savings/SA-001'
  },
  {
    id: '5',
    type: 'transaction',
    title: 'Payment Received',
    subtitle: 'Loan EMI - $1,200',
    badge: 'Today',
    href: '/transactions/TX-001'
  }
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      // Mock search - in real app, this would call API
      const filteredResults = mockSearchResults.filter(
        result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'client':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'loan':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'savings':
        return <PiggyBank className="h-4 w-4 text-purple-500" />;
      case 'transaction':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'active':
        return 'default';
      case 'today':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients, loans, accounts..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-base"
              autoFocus
            />
          </div>

          {query.trim() && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground px-1">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  {results.map((result) => (
                    <Button
                      key={result.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        // In real app, navigate to result.href
                        console.log('Navigate to:', result.href);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex-shrink-0">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {result.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.badge && (
                            <Badge variant={getBadgeVariant(result.badge)} className="text-xs">
                              {result.badge}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </Button>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">
                    Try searching for client names, loan IDs, or account numbers
                  </p>
                </div>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Recent Searches</h4>
                <div className="space-y-1">
                  {[
                    { icon: Users, text: 'John Smith', type: 'Client' },
                    { icon: CreditCard, text: 'Loan LA-2024-001', type: 'Loan' },
                    { icon: PiggyBank, text: 'Savings SA-001', type: 'Account' }
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 text-sm"
                      onClick={() => handleSearch(item.text)}
                    >
                      <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="flex-1 text-left">{item.text}</span>
                      <span className="text-xs text-muted-foreground">{item.type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Users, text: 'Add Client', shortcut: 'Ctrl+Alt+C' },
                    { icon: CreditCard, text: 'Create Loan', shortcut: 'Ctrl+Alt+L' },
                    { icon: PiggyBank, text: 'New Account', shortcut: 'Ctrl+Alt+S' },
                    { icon: FileText, text: 'Generate Report', shortcut: 'Ctrl+Alt+R' }
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex-col space-y-1"
                      onClick={() => {
                        console.log('Quick action:', action.text);
                        onOpenChange(false);
                      }}
                    >
                      <action.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded border">↓</kbd>
              <span>navigate</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded border">Enter</kbd>
              <span>select</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded border">Esc</kbd>
            <span>close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
