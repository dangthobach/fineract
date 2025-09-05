import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  // Mock data - would be fetched from APIs
  const stats = [
    {
      title: 'Total Clients',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Active Loans',
      value: '1,423',
      change: '+8%',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Savings Accounts',
      value: '3,156',
      change: '+15%',
      icon: PiggyBank,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Portfolio Value',
      value: '$2.4M',
      change: '+6%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'loan_approved',
      message: 'Loan application #LA-2024-001 approved for John Doe',
      time: '2 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'client_created',
      message: 'New client Sarah Johnson registered',
      time: '15 minutes ago',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'payment_overdue',
      message: 'Payment overdue for loan #LN-2023-245',
      time: '1 hour ago',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      id: 4,
      type: 'deposit_made',
      message: 'Deposit of $500 made to savings account #SA-001',
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      id: 5,
      type: 'meeting_scheduled',
      message: 'Group meeting scheduled for Tomorrow 10:00 AM',
      time: '3 hours ago',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your microfinance operations.
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>
              Latest activities and notifications from your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${activity.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full">
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Create Loan Application
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PiggyBank className="mr-2 h-4 w-4" />
              Open Savings Account
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio Health</CardTitle>
            <CardDescription>Overview of loan performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Loans</span>
                <span className="font-semibold">98.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.2%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">At Risk (30+ days)</span>
                <span className="font-semibold text-orange-600">1.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '1.5%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Non-Performing (90+ days)</span>
                <span className="font-semibold text-red-600">0.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '0.3%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Targets</CardTitle>
            <CardDescription>Progress towards monthly goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">New Clients</span>
                  <span className="font-semibold">150/200</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loan Disbursements</span>
                  <span className="font-semibold">$180K/$250K</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</span>
                  <span className="font-semibold">96%/95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
