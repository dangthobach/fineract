'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/auth-provider';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  PiggyBank, 
  TrendingUp,
  Repeat,
  Share2,
  Calculator,
  FileText,
  Settings,
  Building2,
  Shield,
  Package,
  MapPin,
  UserCheck,
  Database,
  Cog,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: Users,
    badge: '2,847',
  },
  {
    name: 'Loans',
    href: '/loans',
    icon: CreditCard,
    badge: '1,423',
  },
  {
    name: 'Savings',
    href: '/savings',
    icon: PiggyBank,
    badge: '3,156',
  },
  {
    name: 'Fixed Deposits',
    href: '/fixed-deposits',
    icon: TrendingUp,
    badge: '234',
  },
  {
    name: 'Recurring Deposits',
    href: '/recurring-deposits',
    icon: Repeat,
    badge: '89',
  },
  {
    name: 'Shares',
    href: '/shares',
    icon: Share2,
    badge: '45',
  },
  {
    name: 'Accounting',
    href: '/accounting',
    icon: Calculator,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
  },
];

const adminItems = [
  {
    name: 'Organization',
    href: '/admin/organization',
    icon: Building2,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Roles & Permissions',
    href: '/admin/roles',
    icon: Shield,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    name: 'Offices',
    href: '/admin/offices',
    icon: MapPin,
  },
  {
    name: 'Employees',
    href: '/admin/employees',
    icon: UserCheck,
  },
  {
    name: 'Data Tables',
    href: '/admin/data-tables',
    icon: Database,
  },
  {
    name: 'System Config',
    href: '/admin/system',
    icon: Cog,
  },
];

interface MobileSidebarProps {
  children?: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md border border-gray-200 dark:bg-gray-900/90 dark:border-gray-700"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fineract
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Microfinance Platform
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-1">
              {/* Main Navigation */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        active
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Admin Section */}
              <div className="pt-6">
                <div className="px-3 pb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Administration
                  </h3>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setAdminExpanded(!adminExpanded)}
                  className="w-full justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>Admin Panel</span>
                  </div>
                  {adminExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>

                {adminExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      
                      return (
                        <Link key={item.name} href={item.href}>
                          <div
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              active
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Icon className={`h-3 w-3 mr-3 flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span className="truncate">{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            {user && (
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.firstName.charAt(0) + user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.office?.name || 'Head Office'}
                  </p>
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
