import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { currentAppType, currentTheme, adminUser } = useTheme();

  const getStatsForAppType = () => {
    switch (currentAppType.id) {
      case 'ecommerce':
        return [
          { title: 'Total Sales', value: '$45,231', icon: DollarSign, change: '+20.1%', changeType: 'positive' },
          { title: 'Orders', value: '1,234', icon: ShoppingCart, change: '+12.5%', changeType: 'positive' },
          { title: 'Customers', value: '8,642', icon: Users, change: '+8.2%', changeType: 'positive' },
          { title: 'Revenue', value: '$12,234', icon: TrendingUp, change: '+15.3%', changeType: 'positive' },
        ];
      case 'trading':
        return [
          { title: 'Active Traders', value: '2,543', icon: Users, change: '+18.7%', changeType: 'positive' },
          { title: 'Trading Volume', value: '$1.2M', icon: BarChart3, change: '+25.4%', changeType: 'positive' },
          { title: 'Profit/Loss', value: '+$45,123', icon: TrendingUp, change: '+12.1%', changeType: 'positive' },
          { title: 'Active Positions', value: '456', icon: Activity, change: '-2.3%', changeType: 'negative' },
        ];
      default:
        return [
          { title: 'Total Users', value: '12,345', icon: Users, change: '+14.2%', changeType: 'positive' },
          { title: 'Active Sessions', value: '3,456', icon: Activity, change: '+8.9%', changeType: 'positive' },
          { title: 'Revenue', value: '$23,456', icon: DollarSign, change: '+22.1%', changeType: 'positive' },
          { title: 'Growth Rate', value: '15.8%', icon: TrendingUp, change: '+5.2%', changeType: 'positive' },
        ];
    }
  };

  const stats = getStatsForAppType();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {adminUser.name}! Here's what's happening with your {currentAppType.name.toLowerCase()}.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {currentTheme.name} Theme
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* App Type Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">{currentAppType.icon}</span>
              {currentAppType.name} Features
            </CardTitle>
            <CardDescription>
              Key capabilities of your current application type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentAppType.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{feature}</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Current system health and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>84%</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'User registration', time: '2 minutes ago', type: 'success' },
                { action: 'Database backup', time: '15 minutes ago', type: 'info' },
                { action: 'Security scan', time: '1 hour ago', type: 'warning' },
                { action: 'System update', time: '3 hours ago', type: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span>{activity.action}</span>
                  </div>
                  <span className="text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for {currentAppType.name.toLowerCase()} management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {currentAppType.features.map((feature, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="font-medium text-sm">{feature}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Manage {feature.toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
