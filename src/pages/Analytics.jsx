import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Trophy, Clock, Target } from 'lucide-react';

const Analytics = () => {
  const analyticsData = [
    { date: '2024-07-01', activeUsers: 1200, newUsers: 150, revenue: 2500, contestsPlayed: 45 },
    { date: '2024-07-02', activeUsers: 1350, newUsers: 180, revenue: 2800, contestsPlayed: 52 },
    { date: '2024-07-03', activeUsers: 1100, newUsers: 120, revenue: 2200, contestsPlayed: 38 },
    { date: '2024-07-04', activeUsers: 1450, newUsers: 200, revenue: 3200, contestsPlayed: 58 },
    { date: '2024-07-05', activeUsers: 1600, newUsers: 220, revenue: 3500, contestsPlayed: 62 },
    { date: '2024-07-06', activeUsers: 1550, newUsers: 190, revenue: 3300, contestsPlayed: 59 },
    { date: '2024-07-07', activeUsers: 1700, newUsers: 250, revenue: 3800, contestsPlayed: 68 }
  ];

  const contestTypeData = [
    { name: 'Stock Trading', value: 40, fill: '#8884d8' },
    { name: 'Crypto Trading', value: 30, fill: '#82ca9d' },
    { name: 'Forex Trading', value: 20, fill: '#ffc658' },
    { name: 'Commodity Trading', value: 10, fill: '#ff7300' }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,230',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '8,450',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Contests Played',
      value: '1,234',
      change: '+15.3%',
      icon: Trophy,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Session Time',
      value: '24m 30s',
      change: '+5.1%',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Game Analytics</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className={`text-xs ${stat.color}`}>
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                          {stat.change} from last month
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* User Activity Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="activeUsers" fill="#82ca9d" />
                          <Bar dataKey="newUsers" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Contest Types Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contest Types Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={contestTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {contestTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Contests Played Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contests Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="contestsPlayed" stroke="#ff7300" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Analytics;
