import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Play, Pause, RefreshCw, Eye } from 'lucide-react';

const Trading = () => {
  const [isLiveMode, setIsLiveMode] = useState(true);

  const liveContests = [
    {
      id: '1',
      name: 'Stock Masters Weekly',
      participants: 1247,
      timeRemaining: '2d 14h 23m',
      status: 'active',
      prizePool: 5000,
      topPerformer: { name: 'TraderPro99', profit: '+$1,247.50' }
    },
    {
      id: '2',
      name: 'Crypto Challenge',
      participants: 892,
      timeRemaining: '4h 15m',
      status: 'ending-soon',
      prizePool: 2500,
      topPerformer: { name: 'CoinMaster', profit: '+$892.30' }
    }
  ];

  const tradingData = [
    { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35, volume: '2.4M' },
    { symbol: 'GOOGL', price: 2734.21, change: -15.67, changePercent: -0.57, volume: '1.8M' },
    { symbol: 'MSFT', price: 348.10, change: 5.20, changePercent: 1.52, volume: '3.1M' },
    { symbol: 'TSLA', price: 245.67, change: -8.90, changePercent: -3.50, volume: '5.2M' },
    { symbol: 'AMZN', price: 3234.45, change: 12.80, changePercent: 0.40, volume: '1.9M' },
    { symbol: 'BTC', price: 43567.80, change: 1234.50, changePercent: 2.91, volume: '890K' },
    { symbol: 'ETH', price: 2891.30, change: -45.20, changePercent: -1.54, volume: '1.2M' },
    { symbol: 'ADA', price: 0.67, change: 0.02, changePercent: 3.08, volume: '450K' }
  ];

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? TrendingUp : TrendingDown;
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
                  <h1 className="text-3xl font-bold">Live Trading Dashboard</h1>
                  <div className="flex gap-2">
                    <Button
                      variant={isLiveMode ? "default" : "outline"}
                      onClick={() => setIsLiveMode(!isLiveMode)}
                    >
                      {isLiveMode ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isLiveMode ? 'Pause Live' : 'Start Live'}
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Live Contest Status */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Active Contests</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveContests.map((contest) => (
                      <Card key={contest.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{contest.name}</CardTitle>
                            <Badge variant={contest.status === 'ending-soon' ? 'destructive' : 'default'}>
                              {contest.status === 'ending-soon' ? 'Ending Soon' : 'Active'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Participants</span>
                              <span className="font-semibold">{contest.participants.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Time Remaining</span>
                              <span className="font-semibold">{contest.timeRemaining}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Prize Pool</span>
                              <span className="font-semibold">${contest.prizePool.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Top Performer</span>
                              <div className="text-right">
                                <div className="font-semibold">{contest.topPerformer.name}</div>
                                <div className="text-sm text-green-600">{contest.topPerformer.profit}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Live Market Data */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Live Market Data</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tradingData.map((stock) => {
                      const ChangeIcon = getChangeIcon(stock.change);
                      return (
                        <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                              <ChangeIcon className={`h-4 w-4 ${getChangeColor(stock.change)}`} />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-2xl font-bold">${stock.price.toLocaleString()}</div>
                            <div className={`text-sm font-medium ${getChangeColor(stock.change)}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Volume: {stock.volume}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Trading Activity */}
                <div className="grid gap-4">
                  <h2 className="text-xl font-semibold">Recent Trading Activity</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Live trading activity will appear here</p>
                        <p className="text-sm">Monitor real-time trades and market movements</p>
                      </div>
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

export default Trading;
