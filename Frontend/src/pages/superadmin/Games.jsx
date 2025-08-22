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
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Settings, Clock, Trophy, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Games = () => {
  const { toast } = useToast();
  const [gameSettings, setGameSettings] = useState({
    maxContestsPerUser: 5,
    minEntryFee: 1,
    maxEntryFee: 1000,
    contestDuration: 7,
    autoApproveWithdrawals: false,
    enableReferralSystem: true,
    referralBonus: 10,
    maxPlayersPerContest: 1000
  });

  const gameTypes = [
    {
      id: 'stock-trading',
      name: 'Stock Trading',
      description: 'Fantasy stock trading contests',
      isActive: true,
      players: 5420,
      avgDuration: '7 days',
      avgPrize: '$500'
    },
    {
      id: 'crypto-trading',
      name: 'Crypto Trading',
      description: 'Cryptocurrency trading contests',
      isActive: true,
      players: 3210,
      avgDuration: '3 days',
      avgPrize: '$250'
    },
    {
      id: 'forex-trading',
      name: 'Forex Trading',
      description: 'Foreign exchange trading contests',
      isActive: false,
      players: 1890,
      avgDuration: '5 days',
      avgPrize: '$300'
    },
    {
      id: 'commodity-trading',
      name: 'Commodity Trading',
      description: 'Commodity futures trading contests',
      isActive: true,
      players: 980,
      avgDuration: '14 days',
      avgPrize: '$750'
    }
  ];

  const handleSettingChange = (key, value) => {
    setGameSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Game settings have been successfully updated.",
    });
  };

  const toggleGameType = (gameId) => {
    toast({
      title: "Game Type Updated",
      description: `Game type has been ${gameTypes.find(g => g.id === gameId)?.isActive ? 'disabled' : 'enabled'}.`,
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
                <h1 className="text-3xl font-bold">Game Settings</h1>

                {/* Game Types */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      Game Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {gameTypes.map((gameType) => (
                        <div key={gameType.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{gameType.name}</h3>
                              <Badge variant={gameType.isActive ? 'default' : 'secondary'}>
                                {gameType.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {gameType.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {gameType.players.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {gameType.avgDuration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {gameType.avgPrize}
                              </span>
                            </div>
                          </div>
                          <Switch
                            checked={gameType.isActive}
                            onCheckedChange={() => toggleGameType(gameType.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      General Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="maxContests">Max Contests Per User</Label>
                        <Input
                          id="maxContests"
                          type="number"
                          value={gameSettings.maxContestsPerUser}
                          onChange={(e) => handleSettingChange('maxContestsPerUser', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contestDuration">Contest Duration (days)</Label>
                        <Input
                          id="contestDuration"
                          type="number"
                          value={gameSettings.contestDuration}
                          onChange={(e) => handleSettingChange('contestDuration', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minEntryFee">Minimum Entry Fee ($)</Label>
                        <Input
                          id="minEntryFee"
                          type="number"
                          value={gameSettings.minEntryFee}
                          onChange={(e) => handleSettingChange('minEntryFee', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxEntryFee">Maximum Entry Fee ($)</Label>
                        <Input
                          id="maxEntryFee"
                          type="number"
                          value={gameSettings.maxEntryFee}
                          onChange={(e) => handleSettingChange('maxEntryFee', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxPlayers">Max Players Per Contest</Label>
                        <Input
                          id="maxPlayers"
                          type="number"
                          value={gameSettings.maxPlayersPerContest}
                          onChange={(e) => handleSettingChange('maxPlayersPerContest', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referralBonus">Referral Bonus (%)</Label>
                        <Input
                          id="referralBonus"
                          type="number"
                          value={gameSettings.referralBonus}
                          onChange={(e) => handleSettingChange('referralBonus', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-approve Withdrawals</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically approve withdrawal requests
                          </p>
                        </div>
                        <Switch
                          checked={gameSettings.autoApproveWithdrawals}
                          onCheckedChange={(checked) => handleSettingChange('autoApproveWithdrawals', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Referral System</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to refer friends and earn bonuses
                          </p>
                        </div>
                        <Switch
                          checked={gameSettings.enableReferralSystem}
                          onCheckedChange={(checked) => handleSettingChange('enableReferralSystem', checked)}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings} className="w-full">
                      Save Settings
                    </Button>
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

export default Games;
