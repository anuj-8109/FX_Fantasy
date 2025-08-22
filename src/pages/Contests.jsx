import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import ContestForm from '@/components/ContestForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, DollarSign, Calendar, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contests = () => {
  const { toast } = useToast();
  const [contests, setContests] = useState([
    {
      id: '1',
      name: 'Weekly Stock Challenge',
      description: 'Pick your top 5 stocks for the week and compete for prizes',
      entryFee: 25,
      prizePool: 1000,
      participants: 45,
      maxParticipants: 100,
      startDate: '2024-07-08T09:00',
      endDate: '2024-07-14T17:00',
      status: 'active',
      createdAt: '2024-07-01T10:00:00',
      selectedStocks: ['1', '2', '3', '4', '5'],
      contestType: 'stock_trading',
      rules: {
        maxStockSelection: 5,
        initialBudget: 100000,
        tradingHours: '9:30 AM - 4:00 PM EST',
        allowShortSelling: false
      }
    },
    {
      id: '2',
      name: 'Crypto Trading Tournament',
      description: 'Trade the top cryptocurrencies in this high-stakes tournament',
      entryFee: 50,
      prizePool: 2500,
      participants: 23,
      maxParticipants: 50,
      startDate: '2024-07-15T09:00',
      endDate: '2024-07-22T17:00',
      status: 'upcoming',
      createdAt: '2024-07-02T14:00:00',
      selectedStocks: ['6', '7', '8'],
      contestType: 'crypto_trading',
      rules: {
        maxStockSelection: 3,
        initialBudget: 50000,
        tradingHours: '24/7',
        allowShortSelling: true
      }
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingContest, setEditingContest] = useState();

  const handleCreateContest = () => {
    setEditingContest(undefined);
    setShowForm(true);
  };

  const handleEditContest = (contest) => {
    setEditingContest(contest);
    setShowForm(true);
  };

  const handleDeleteContest = (contestId) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      setContests(contests.filter(c => c.id !== contestId));
      toast({
        title: "Contest Deleted",
        description: "The contest has been successfully deleted.",
      });
    }
  };

  const handleSaveContest = (contestData) => {
    if (editingContest) {
      setContests(contests.map(c => 
        c.id === editingContest.id 
          ? { ...contestData, id: editingContest.id }
          : c
      ));
      toast({
        title: "Contest Updated",
        description: "The contest has been successfully updated.",
      });
    } else {
      const newContest = {
        ...contestData,
        id: Date.now().toString()
      };
      setContests([...contests, newContest]);
      toast({
        title: "Contest Created",
        description: "The contest has been successfully created.",
      });
    }
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'default', text: 'Active' },
      upcoming: { variant: 'secondary', text: 'Upcoming' },
      completed: { variant: 'outline', text: 'Completed' },
      cancelled: { variant: 'destructive', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.upcoming;
    return <Badge variant={config.variant}>{config.text}</Badge>;
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
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Contests</h1>
                    <p className="text-muted-foreground">
                      Manage trading contests and tournaments
                    </p>
                  </div>
                  <Button onClick={handleCreateContest} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Contest
                  </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contests.map((contest) => (
                    <Card key={contest.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{contest.name}</CardTitle>
                          {getStatusBadge(contest.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contest.description}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>Entry: {formatCurrency(contest.entryFee)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span>Prize: {formatCurrency(contest.prizePool)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>{contest.participants}/{contest.maxParticipants}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span>{formatDate(contest.startDate)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContest(contest)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContest(contest.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {showForm && (
                  <ContestForm
                    contest={editingContest}
                    onSave={handleSaveContest}
                    onCancel={() => setShowForm(false)}
                  />
                )}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Contests;
