import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function HistoryPage() {
  const { contestId } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  const dummyHistory = {
    totalBalance: 20140,
    unutilized: 3140,
    pnl: 1420,
    stocks: [
      { _id: "1", stock_name: "Maruti Sec.", change: 85.25, value: 16125 },
      { _id: "2", stock_name: "Monotype India", change: 12.25, value: 26125 },
      { _id: "3", stock_name: "Tata Motors", change: -5.12, value: 10320 },
      { _id: "4", stock_name: "Reliance", change: 7.5, value: 18750 },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setHistory(dummyHistory);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!history) return <p className="text-center mt-10">No history available</p>;

  return (
    <div className="bg-gray-50  min-h-screen flex flex-col">
    
      <div className="max-w-4xl w-full mx-auto mt-6 bg-white shadow rounded-xl p-6 text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl">
            ₹
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-600">Total Balance :</h2>
        <p className="text-2xl font-bold text-green-600">₹{history.totalBalance}</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-orange-600 font-medium">Unutilized</p>
            <p className="text-gray-600 text-sm">The Money You Add</p>
            <p className="font-bold text-orange-500">₹{history.unutilized}</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-green-600 font-medium">P&L</p>
            <p className="text-gray-600 text-sm">The Money You Win</p>
            <p className="font-bold text-green-500">₹{history.pnl}</p>
          </div>
        </div>
      </div>

 
      <div className="max-w-4xl w-full mx-auto mt-6 space-y-4 px-4">
        {history.stocks.map((stock) => (
          <div
            key={stock._id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{stock.stock_name}</p>
              <p className="text-gray-600 text-sm">{stock.value.toLocaleString()}</p>
              <p
                className={`text-sm font-medium ${
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change}%
              </p>
            </div>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm">
                BUY
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">
                SELL
              </button>
            </div>
          </div>
        ))}
      </div>

  
      
    </div>
  );
}

export default HistoryPage;
