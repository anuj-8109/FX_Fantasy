import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users as UsersIcon, Shield, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([
    { id: 1, name: 'Trading Master', email: 'trader@game.com', contests: 15, winRate: '68%', status: 'active' },
    { id: 2, name: 'Crypto King', email: 'crypto@game.com', contests: 23, winRate: '72%', status: 'active' },
    { id: 3, name: 'Stock Guru', email: 'stocks@game.com', contests: 8, winRate: '45%', status: 'pending' },
    { id: 4, name: 'Portfolio Pro', email: 'portfolio@game.com', contests: 31, winRate: '81%', status: 'vip' }
  ]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      status: "active",
    },
  });

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsAddMode(false);
    form.reset({
      name: user.name,
      email: user.email,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsAddMode(true);
    form.reset({
      name: "",
      email: "",
      status: "active",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    });
  };

  const onSubmit = (data) => {
    if (isAddMode) {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: data.name,
        email: data.email,
        status: data.status,
        contests: 0,
        winRate: "0%",
      };
      setUsers([...users, newUser]);
      toast({
        title: "User added",
        description: "The user has been successfully added.",
      });
    } else {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, name: data.name, email: data.email, status: data.status }
          : user
      ));
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
    }
    setIsEditDialogOpen(false);
    form.reset();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'default', text: 'Active' },
      pending: { variant: 'secondary', text: 'Pending' },
      vip: { variant: 'outline', text: 'VIP' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      active: 'text-green-600',
      pending: 'text-yellow-600',
      vip: 'text-purple-600'
    };
    return statusColors[status] || 'text-gray-600';
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
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                      Manage user accounts and permissions
                    </p>
                  </div>
                  <Button onClick={handleAddUser} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {users.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription className="text-sm">{user.email}</CardDescription>
                          </div>
                          {getStatusBadge(user.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span>{user.contests} contests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>{user.winRate} win rate</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {isAddMode ? 'Add New User' : 'Edit User'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter user name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter user email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {isAddMode ? 'Add User' : 'Update User'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Users;
