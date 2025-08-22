import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

const Security = () => {
  const securityLogs = [
    { id: 1, event: 'Failed Login Attempt', user: 'trader@game.com', severity: 'medium', time: '2 minutes ago' },
    { id: 2, event: 'Suspicious Trading Pattern', user: 'crypto@game.com', severity: 'high', time: '15 minutes ago' },
    { id: 3, event: 'Password Changed', user: 'stocks@game.com', severity: 'low', time: '1 hour ago' },
    { id: 4, event: 'Multiple Device Login', user: 'portfolio@game.com', severity: 'medium', time: '3 hours ago' }
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
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Security Center</h2>
                  <p className="text-muted-foreground">Monitor and manage platform security</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                      <Shield className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">94%</div>
                      <p className="text-xs text-muted-foreground">Excellent security</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-500">3</div>
                      <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
                      <Lock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127</div>
                      <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Status</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">Online</div>
                      <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Events</CardTitle>
                    <CardDescription>Recent security activities and alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${
                              log.severity === 'high' ? 'bg-red-500' : 
                              log.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                            }`} />
                            <div>
                              <p className="font-medium">{log.event}</p>
                              <p className="text-sm text-muted-foreground">{log.user}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm text-muted-foreground">{log.time}</p>
                            <Badge variant={log.severity === 'high' ? 'destructive' : log.severity === 'medium' ? 'secondary' : 'default'}>
                              {log.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Security;
