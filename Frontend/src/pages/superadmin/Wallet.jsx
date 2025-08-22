import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Wallet = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  const transactions = [
    {
      id: '1',
      userId: 'user123',
      type: 'deposit',
      amount: 250.00,
      status: 'completed',
      date: '2024-07-06T10:30:00',
      description: 'USDT Deposit via Binance'
    },
    {
      id: '2',
      userId: 'user456',
      type: 'withdrawal',
      amount: 150.00,
      status: 'pending',
      date: '2024-07-06T09:15:00',
      description: 'Withdrawal to Bank Account'
    },
    {
      id: '3',
      userId: 'user789',
      type: 'contest_entry',
      amount: 25.00,
      status: 'completed',
      date: '2024-07-06T08:45:00',
      description: 'Entry fee for Weekly Stock Challenge'
    },
    {
      id: '4',
      userId: 'user321',
      type: 'prize_payout',
      amount: 500.00,
      status: 'completed',
      date: '2024-07-05T18:30:00',
      description: 'Prize payout - Crypto Tournament Winner'
    },
    {
      id: '5',
      userId: 'user654',
      type: 'withdrawal',
      amount: 75.00,
      status: 'failed',
      date: '2024-07-05T15:20:00',
      description: 'Withdrawal failed - Insufficient KYC'
    }
  ];

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length;
  const completedToday = transactions.filter(t => t.status === 'completed' && new Date(t.date).toDateString() === new Date().toDateString()).length;

  const handleApproveWithdrawal = (transactionId) => {
    toast({
      title: "Withdrawal Approved",
      description: `Transaction ${transactionId} has been approved for processing.`,
    });
  };

  const handleRejectWithdrawal = (transactionId) => {
    toast({
      title: "Withdrawal Rejected",
      description: `Transaction ${transactionId} has been rejected.`,
      variant: "destructive"
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'prize_payout':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
      case 'contest_entry':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <WalletIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'default', text: 'Completed', icon: CheckCircle },
      pending: { variant: 'secondary', text: 'Pending', icon: Clock },
      failed: { variant: 'destructive', text: 'Failed', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
                <div>
                  <h1 className="text-3xl font-bold">Wallet Management</h1>
                  <p className="text-muted-foreground">
                    Monitor and manage user wallet transactions
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                      <WalletIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
                      <p className="text-xs text-muted-foreground">All time transactions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
                      <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingWithdrawals}</div>
                      <p className="text-xs text-muted-foreground">Requires approval</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{completedToday}</div>
                      <p className="text-xs text-muted-foreground">Successful transactions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Transactions */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Transaction History</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Monitor all wallet activities and manage withdrawals
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={filter === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilter('all')}
                        >
                          All
                        </Button>
                        <Button
                          variant={filter === 'pending' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilter('pending')}
                        >
                          Pending
                        </Button>
                        <Button
                          variant={filter === 'completed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilter('completed')}
                        >
                          Completed
                        </Button>
                        <Button
                          variant={filter === 'failed' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilter('failed')}
                        >
                          Failed
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                User: {transaction.userId} • {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className={`font-semibold ${
                                transaction.type === 'deposit' || transaction.type === 'prize_payout' 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {transaction.type === 'deposit' || transaction.type === 'prize_payout' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {transaction.type.replace('_', ' ')}
                              </p>
                            </div>
                            {getStatusBadge(transaction.status)}
                            {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveWithdrawal(transaction.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectWithdrawal(transaction.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
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

export default Wallet;
