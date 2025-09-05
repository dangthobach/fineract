import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, CreditCard, PiggyBank, Calculator, FileText, Settings, Building } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Get a comprehensive view of your microfinance operations',
      href: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Client Management', 
      description: 'Manage clients, groups, and centers with ease',
      href: '/clients',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: CreditCard,
      title: 'Loan Management',
      description: 'Handle loan applications, approvals, and collections',
      href: '/loans', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: PiggyBank,
      title: 'Savings Accounts',
      description: 'Manage savings accounts and fixed deposits',
      href: '/savings',
      color: 'text-orange-600', 
      bgColor: 'bg-orange-50',
    },
    {
      icon: Calculator,
      title: 'Accounting',
      description: 'Complete accounting and financial reporting',
      href: '/accounting',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: FileText,
      title: 'Reports',
      description: 'Generate detailed reports and analytics',
      href: '/reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Settings,
      title: 'Administration',
      description: 'System configuration and user management', 
      href: '/admin',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      icon: Building,
      title: 'Organization',
      description: 'Manage offices, staff, and organizational structure',
      href: '/admin/organization',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fineract Web</h1>
                <p className="text-xs text-gray-500">Microfinance Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Microfinance
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Management System
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Built on Apache Fineract, our modern web interface provides a comprehensive solution
            for microfinance institutions to manage clients, loans, savings, and operations efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Microfinance Solution
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful microfinance institution,
              from client management to financial reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-0 shadow-md">
                    <CardHeader className="text-center pb-3">
                      <div className={`w-16 h-16 mx-auto mb-4 ${feature.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}>
                        <IconComponent className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-center text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">800+</div>
              <div className="text-blue-100">API Endpoints</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-blue-100">Core Modules</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">Fineract Web</span>
            </div>
            <p className="text-gray-400 mb-6">
              Built with ❤️ using Apache Fineract, Next.js 14, and modern web technologies
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/api" className="text-gray-400 hover:text-white transition-colors">
                API Reference
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                Support
              </Link>
              <Link href="https://github.com/apache/fineract" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
