import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import StockSelector from './StockSelector';

const ContestForm = ({ contest, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contest?.name || '',
    description: contest?.description || '',
    entryFee: contest?.entryFee || 0,
    prizePool: contest?.prizePool || 0,
    maxParticipants: contest?.maxParticipants || 100,
    startDate: contest?.startDate || '',
    endDate: contest?.endDate || '',
    status: contest?.status || 'upcoming',
    selectedStocks: contest?.selectedStocks || [],
    contestType: contest?.contestType || 'stock_trading',
    rules: {
      maxStockSelection: contest?.rules?.maxStockSelection || 5,
      initialBudget: contest?.rules?.initialBudget || 100000,
      tradingHours: contest?.rules?.tradingHours || '9:30 AM - 4:00 PM EST',
      allowShortSelling: contest?.rules?.allowShortSelling || false
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      participants: contest?.participants || 0,
      createdAt: contest?.createdAt || new Date().toISOString()
    });
  };

  const handleChange = (field, value) => {
    if (field.startsWith('rules.')) {
      const ruleField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        rules: { ...prev.rules, [ruleField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleStockToggle = (stockId) => {
    setFormData(prev => ({
      ...prev,
      selectedStocks: prev.selectedStocks.includes(stockId)
        ? prev.selectedStocks.filter(id => id !== stockId)
        : [...prev.selectedStocks, stockId]
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{contest ? 'Edit Contest' : 'Create New Contest'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Contest Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contestType">Contest Type</Label>
                  <Select value={formData.contestType} onValueChange={(value) => handleChange('contestType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contest type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock_trading">Stock Trading</SelectItem>
                      <SelectItem value="crypto_trading">Crypto Trading</SelectItem>
                      <SelectItem value="forex_trading">Forex Trading</SelectItem>
                      <SelectItem value="commodity_trading">Commodity Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.entryFee}
                    onChange={(e) => handleChange('entryFee', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prizePool">Prize Pool ($)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.prizePool}
                    onChange={(e) => handleChange('prizePool', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the contest..."
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="stocks" className="space-y-4">
              <div>
                <Label>Select Stocks</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which stocks/cryptocurrencies will be available for trading in this contest
                </p>
                <StockSelector
                  selectedStocks={formData.selectedStocks}
                  onStockToggle={handleStockToggle}
                />
              </div>
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxStockSelection">Max Stock Selection</Label>
                  <Input
                    id="maxStockSelection"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.rules.maxStockSelection}
                    onChange={(e) => handleChange('rules.maxStockSelection', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="initialBudget">Initial Budget ($)</Label>
                  <Input
                    id="initialBudget"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.rules.initialBudget}
                    onChange={(e) => handleChange('rules.initialBudget', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tradingHours">Trading Hours</Label>
                  <Input
                    id="tradingHours"
                    value={formData.rules.tradingHours}
                    onChange={(e) => handleChange('rules.tradingHours', e.target.value)}
                    placeholder="e.g., 9:30 AM - 4:00 PM EST"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowShortSelling"
                    checked={formData.rules.allowShortSelling}
                    onCheckedChange={(checked) => handleChange('rules.allowShortSelling', checked)}
                  />
                  <Label htmlFor="allowShortSelling">Allow Short Selling</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {contest ? 'Update Contest' : 'Create Contest'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContestForm;
