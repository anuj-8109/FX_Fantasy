import React, { useState } from 'react';
import { useStockPrices } from '@/hooks/useStockPrices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';

const StockSelector = ({ 
  selectedStocks, 
  onStockToggle, 
  maxSelection = 10 
}) => {
  const { stocks, isLive, setIsLive } = useStockPrices();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  const sectors = ['All', ...Array.from(new Set(stocks.map(stock => stock.sector)))];
  
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'All' || stock.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            Select Stocks ({selectedStocks.length}/{maxSelection})
            {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Live Prices' : 'Static Prices'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Stock List */}
        <div className="max-h-96 overflow-auto space-y-2">
          {filteredStocks.map((stock) => {
            const ChangeIcon = getChangeIcon(stock.change);
            const isSelected = selectedStocks.includes(stock.id);
            const canSelect = selectedStocks.length < maxSelection || isSelected;

            return (
              <div
                key={stock.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                  isSelected ? 'bg-primary/10 border-primary' : ''
                } ${!canSelect ? 'opacity-50' : ''}`}
                onClick={() => canSelect && onStockToggle(stock.id)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => canSelect && onStockToggle(stock.id)}
                  disabled={!canSelect}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm ${getChangeColor(stock.change)}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {stock.sector}
                    </Badge>
                    <ChangeIcon className={`h-4 w-4 ${getChangeColor(stock.change)}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No stocks found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockSelector;
