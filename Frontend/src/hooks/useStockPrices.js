import { useState, useEffect } from 'react';
import { stocks as initialStocks } from '@/data/stocks.js';

export const useStockPrices = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // Generate random price change between -5% and +5%
          const changePercent = (Math.random() - 0.5) * 10;
          const change = (stock.price * changePercent) / 100;
          const newPrice = Math.max(0.01, stock.price + change);
          
          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2))
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return { stocks, isLive, setIsLive };
};
