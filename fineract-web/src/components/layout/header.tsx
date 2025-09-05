'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GlobalSearch } from '@/components/ui/global-search';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { Bell, Search, Sun, Moon, User, LogOut, Settings, Plus, Filter, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

export function Header({ title, showSearch = true, actions }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  // Global keyboard shortcut for search
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 transition-colors">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <MobileSidebar>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </MobileSidebar>
          </div>

          {/* Left side - Title and Breadcrumb */}
          <div className="flex items-center flex-1 min-w-0 lg:ml-0 ml-12">
            <div className="min-w-0 flex-1">
              {title ? (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h1>
                  <Breadcrumb className="mt-1" />
                </div>
              ) : (
                <Breadcrumb />
              )}
            </div>
          </div>

          {/* Center - Search */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left">Search clients, loans, accounts...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          )}

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Custom Actions */}
            {actions && (
              <>
                {actions}
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
              </>
            )}

            {/* Search Button for Mobile */}
            {showSearch && (
              <Button variant="ghost" size="sm" className="md:hidden" onClick={handleSearchClick}>
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Quick Actions */}
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>

            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Filter className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-sm">
                    <span className="text-white font-medium text-sm">
                      {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : 'U'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-3 bg-gray-50 dark:bg-gray-800/50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : 'U'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1 leading-none">
                    {user && (
                      <>
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.office?.name || 'Head Office'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                  {notifications > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {notifications}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
