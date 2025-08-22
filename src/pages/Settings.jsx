import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Shield, Mail, Database, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Dream Trading App',
    siteDescription: 'Fantasy Trading Contest Platform',
    supportEmail: 'support@dreamtrading.com',
    maintenanceMode: false,
    registrationEnabled: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    contestReminders: true,
    prizeNotifications: true,
    systemAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    passwordMinLength: 8,
    sessionTimeout: 30,
    ipWhitelist: '',
    maxLoginAttempts: 5
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    usdtEnabled: true,
    minDeposit: 10,
    maxWithdrawal: 10000,
    withdrawalFee: 2.5
  });

  const handleSaveGeneral = () => {
    toast({
      title: "General Settings Saved",
      description: "Your general settings have been updated successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Saved",
      description: "Your security settings have been updated successfully.",
    });
  };

  const handleSavePayments = () => {
    toast({
      title: "Payment Settings Saved",
      description: "Your payment settings have been updated successfully.",
    });
  };

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>

                <Tabs defaultValue="general" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <SettingsIcon className="h-5 w-5" />
                          General Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                              id="siteName"
                              value={generalSettings.siteName}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="siteDescription">Site Description</Label>
                            <Input
                              id="siteDescription"
                              value={generalSettings.siteDescription}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input
                              id="supportEmail"
                              type="email"
                              value={generalSettings.supportEmail}
                              onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Maintenance Mode</Label>
                              <p className="text-sm text-muted-foreground">
                                Temporarily disable the platform for maintenance
                              </p>
                            </div>
                            <Switch
                              checked={generalSettings.maintenanceMode}
                              onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Registration Enabled</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow new users to register
                              </p>
                            </div>
                            <Switch
                              checked={generalSettings.registrationEnabled}
                              onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                            />
                          </div>
                        </div>
                        <Button onClick={handleSaveGeneral}>Save General Settings</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5" />
                          Notification Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.emailNotifications}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications in browser
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.pushNotifications}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>SMS Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via SMS
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.smsNotifications}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Contest Reminders</Label>
                              <p className="text-sm text-muted-foreground">
                                Get reminded about upcoming contests
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.contestReminders}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, contestReminders: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Prize Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Get notified when you win prizes
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.prizeNotifications}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, prizeNotifications: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>System Alerts</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive important system updates
                              </p>
                            </div>
                            <Switch
                              checked={notificationSettings.systemAlerts}
                              onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                            />
                          </div>
                        </div>
                        <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Security Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                            <Input
                              id="passwordMinLength"
                              type="number"
                              value={securitySettings.passwordMinLength}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                            <Input
                              id="sessionTimeout"
                              type="number"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                            <Input
                              id="maxLoginAttempts"
                              type="number"
                              value={securitySettings.maxLoginAttempts}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                            <Input
                              id="ipWhitelist"
                              placeholder="192.168.1.1, 10.0.0.1"
                              value={securitySettings.ipWhitelist}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Two-Factor Authentication Required</Label>
                              <p className="text-sm text-muted-foreground">
                                Require 2FA for all users
                              </p>
                            </div>
                            <Switch
                              checked={securitySettings.twoFactorRequired}
                              onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))}
                            />
                          </div>
                        </div>
                        <Button onClick={handleSaveSecurity}>Save Security Settings</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payments">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Payment Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="minDeposit">Minimum Deposit ($)</Label>
                            <Input
                              id="minDeposit"
                              type="number"
                              value={paymentSettings.minDeposit}
                              onChange={(e) => setPaymentSettings(prev => ({ ...prev, minDeposit: parseFloat(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxWithdrawal">Maximum Withdrawal ($)</Label>
                            <Input
                              id="maxWithdrawal"
                              type="number"
                              value={paymentSettings.maxWithdrawal}
                              onChange={(e) => setPaymentSettings(prev => ({ ...prev, maxWithdrawal: parseFloat(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                            <Input
                              id="withdrawalFee"
                              type="number"
                              step="0.1"
                              value={paymentSettings.withdrawalFee}
                              onChange={(e) => setPaymentSettings(prev => ({ ...prev, withdrawalFee: parseFloat(e.target.value) }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Stripe Payments</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable Stripe payment processing
                              </p>
                            </div>
                            <Switch
                              checked={paymentSettings.stripeEnabled}
                              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, stripeEnabled: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>PayPal Payments</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable PayPal payment processing
                              </p>
                            </div>
                            <Switch
                              checked={paymentSettings.paypalEnabled}
                              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, paypalEnabled: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>USDT Payments</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable USDT cryptocurrency payments
                              </p>
                            </div>
                            <Switch
                              checked={paymentSettings.usdtEnabled}
                              onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, usdtEnabled: checked }))}
                            />
                          </div>
                        </div>
                        <Button onClick={handleSavePayments}>Save Payment Settings</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Settings;
