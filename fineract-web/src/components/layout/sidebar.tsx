'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { config } from '@/lib/config';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  PiggyBank, 
  Landmark,
  RotateCcw,
  TrendingUp,
  Calculator,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Building2,
  UserCog,
  Shield,
  Package,
  MapPin,
  UserCheck,
  Table,
  Cog,
  ChevronDown,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  Landmark,
  RotateCcw,
  TrendingUp,
  Calculator,
  FileText,
  Settings,
  Building2,
  UserCog,
  Shield,
  Package,
  MapPin,
  UserCheck,
  Table,
  Cog,
};

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: keyof typeof iconMap;
  badge?: string;
  children?: MenuItem[];
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['admin']);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mainNavigation: MenuItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: 'Users',
      badge: '2,847',
    },
    {
      name: 'Loans',
      href: '/loans',
      icon: 'CreditCard',
      badge: '1,423',
      children: [
        {
          name: 'Loan Portfolio',
          href: '/loans',
          icon: 'CreditCard',
        },
        {
          name: 'Analytics',
          href: '/loans/analytics',
          icon: 'TrendingUp',
        },
      ],
    },
    {
      name: 'Savings',
      href: '/savings',
      icon: 'PiggyBank',
      badge: '3,156',
      children: [
        {
          name: 'Savings Accounts',
          href: '/savings',
          icon: 'PiggyBank',
        },
        {
          name: 'Analytics',
          href: '/savings/analytics',
          icon: 'TrendingUp',
        },
      ],
    },
    {
      name: 'Fixed Deposits',
      href: '/fixed-deposits',
      icon: 'Landmark',
    },
    {
      name: 'Recurring Deposits',
      href: '/recurring-deposits',
      icon: 'RotateCcw',
    },
    {
      name: 'Shares',
      href: '/shares',
      icon: 'TrendingUp',
    },
    {
      name: 'Accounting',
      href: '/accounting',
      icon: 'Calculator',
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: 'FileText',
    },
  ];

  const adminNavigation: MenuItem[] = [
    {
      name: 'Admin',
      href: '/admin',
      icon: 'Settings',
      children: [
        {
          name: 'Organization',
          href: '/admin/organization',
          icon: 'Building2',
        },
        {
          name: 'Users',
          href: '/admin/users',
          icon: 'UserCog',
        },
        {
          name: 'Roles & Permissions',
          href: '/admin/roles',
          icon: 'Shield',
        },
        {
          name: 'Products',
          href: '/admin/products',
          icon: 'Package',
        },
        {
          name: 'Offices',
          href: '/admin/offices',
          icon: 'MapPin',
        },
        {
          name: 'Employees',
          href: '/admin/employees',
          icon: 'UserCheck',
        },
        {
          name: 'Data Tables',
          href: '/admin/datatables',
          icon: 'Table',
        },
        {
          name: 'System Config',
          href: '/admin/system',
          icon: 'Cog',
        },
      ],
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const IconComponent = iconMap[item.icon];
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name.toLowerCase());
    const hasChildren = item.children && item.children.length > 0;

    const menuItem = (
      <div className={cn("relative", isChild && "ml-4")}>
        {hasChildren ? (
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start px-3 py-2 h-auto font-medium transition-all',
              isActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              isCollapsed && 'justify-center px-2'
            )}
            onClick={() => toggleExpanded(item.name.toLowerCase())}
          >
            <div className="flex items-center w-full">
              <IconComponent className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 truncate">{item.name}</span>
                  <div className="ml-auto flex items-center space-x-1">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </>
              )}
            </div>
          </Button>
        ) : (
          <Link href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start px-3 py-2 h-auto font-medium transition-all',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <div className="flex items-center w-full">
                <IconComponent className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 truncate">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Button>
          </Link>
        )}

        {/* Children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <div key={child.name}>
                {renderMenuItem(child, true)}
              </div>
            ))}
          </div>
        )}
      </div>
    );

    // Wrap with tooltip if collapsed
    if (isCollapsed && !isChild) {
      return (
        <TooltipProvider key={item.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              {menuItem}
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.name}>{menuItem}</div>;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  Fineract Web
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  v1.13.1
                </p>
              </div>
            )}
          </Link>
          
          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft 
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )} 
            />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {/* Main Navigation */}
            {mainNavigation.map((item) => renderMenuItem(item))}
            
            <Separator className="my-4" />
            
            {/* Admin Navigation */}
            {adminNavigation.map((item) => renderMenuItem(item))}
          </div>
        </ScrollArea>

        {/* User section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.office?.name || 'Head Office'}
                </p>
              </div>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
