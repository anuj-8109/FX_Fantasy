import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { GetContestHistory, BuySelltrade } from "../../services/User";

function HistoryPage() {

  const location = useLocation();
  const contestId = location?.state?.contestId;

  console.log("contestId",contestId)

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buySellLoadingId, setBuySellLoadingId] = useState(null);
  const [quantityMap, setQuantityMap] = useState({}); // Store custom quantity for each trade

  const dummyBalance = {
    totalBalance: 20140,
    unutilized: 3140,
    pnl: 1420,
  };

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!token || !clientId || !contestId) {
          setError("Missing token, clientId, or contestId. Please login and select a contest.");
          setLoading(false);
          return;
        }

        const data1 = { client_id: clientId, contest_id: contestId, page: 1 };
        const data = await GetContestHistory(token, data1);

        if (data?.status) {
          setHistory(data.data || []);
        } else {
          setHistory([]);
          setError(data?.message || "No trade history found.");
        }
      } catch (err) {
        setError("Network or server error occurred.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contestId, token, clientId]);

  const handleBuySell = async (stock_symbol, trade_type, tradeId) => {
    if (!token || !clientId || !contestId) return;

    const quantity = quantityMap[tradeId] || 1;

    if (!window.confirm(`Are you sure you want to ${trade_type} ${quantity} ${stock_symbol}?`)) return;

    setBuySellLoadingId(tradeId);

    try {
      const payload = {
        contest_id: contestId,
        client_id: clientId,
        stock_symbol,
        trade_type,
        quantity: quantity.toString(),
      };

      const res = await BuySelltrade(token, payload);
      if (res?.status) {
        alert("Trade successful!");
        setHistory((prev) => [res.data, ...prev]);
        setQuantityMap((prev) => ({ ...prev, [tradeId]: "" })); 
      } else {
        alert(res?.message || "Trade failed");
      }
    } catch (err) {
      console.error(err);
      alert("Trade failed due to network/server error.");
    } finally {
      setBuySellLoadingId(null);
    }
  };

  const handleQuantityChange = (tradeId, value) => {
    if (!/^\d*$/.test(value)) return; // only allow numbers
    setQuantityMap((prev) => ({ ...prev, [tradeId]: value }));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col hitstory_style">
      {/* Balance Card */}
      <div className="max-w-4xl w-full mx-auto mt-6 shadow rounded-xl p-6 text-center Card-style">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl">₹</div>
        </div>
        <h2 className="text-lg font-semibold">Total Balance :</h2>
        <p className="text-2xl font-bold text-green-600">₹{dummyBalance.totalBalance}</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-orange-600 font-medium">Unutilized</p>
            <p className="text-sm">The Money You Add</p>
            <p className="font-bold text-orange-500">₹{dummyBalance.unutilized}</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-green-600 font-medium">P&L</p>
            <p className="text-sm">The Money You Win</p>
            <p className="font-bold text-green-500">₹{dummyBalance.pnl}</p>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="max-w-4xl w-full mx-auto mt-6 space-y-4 px-4">
        {history.length > 0 ? (
          history.map((trade) => (
            <div key={trade._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
              <div className="w-1/3">
                <p className="font-semibold">{trade.stock_symbol}</p>
                <p className="text-gray-600 text-sm">Qty: {trade.quantity}</p>
              </div>

              <div className="w-1/3 text-center">
                <p className="text-gray-600 text-sm">Price: ₹{trade.price}</p>
                <p className="text-xs text-gray-500">{trade.trade_time ? new Date(trade.trade_time).toLocaleString() : "N/A"}</p>
              </div>

              <div className="w-1/3 flex flex-col items-end space-y-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={quantityMap[trade._id] || ""}
                  onChange={(e) => handleQuantityChange(trade._id, e.target.value)}
                  className="border p-1 w-20 text-sm rounded-md"
                />
                <div className="flex space-x-2">
                  <button
                    disabled={buySellLoadingId === trade._id}
                    onClick={() => handleBuySell(trade.stock_symbol, "buy", trade._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                  >
                    {buySellLoadingId === trade._id ? "Processing..." : "Buy"}
                  </button>
                  <button
                    disabled={buySellLoadingId === trade._id}
                    onClick={() => handleBuySell(trade.stock_symbol, "sell", trade._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    {buySellLoadingId === trade._id ? "Processing..." : "Sell"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No trade history</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
