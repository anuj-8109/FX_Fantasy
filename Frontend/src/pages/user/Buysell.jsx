import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetContestHistory } from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";

function TradeHistory() {
  const location = useLocation();
  const contestId = location?.state?.contestId;

  const token = localStorage.getItem("token");
  const clientId =
    localStorage.getItem("userId") || localStorage.getItem("client_id");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!token || !clientId || !contestId) {
          toast.error("Missing token, clientId, or contestId!");
          setLoading(false);
          return;
        }

        const data1 = { client_id: clientId, contest_id: contestId, page: 1 };
        const res = await GetContestHistory(token, data1);

        if (res?.status) {
          setHistory(res?.data || []);
        } else {
          setHistory([]);
          toast.error(res?.message || "No trade history found.");
        }
      } catch (err) {
        console.error("Error fetching trade history:", err);
        toast.error("Network/server error occurred.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, clientId, contestId]);

  return (
    <div className="max-w-4xl p-4 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-6 border p-1 rounded-xl shadow-sm bg-gray-100">
        <h2 className="text-xl font-bold text-center ">Trade History</h2>
      <BackButton />
      </div>
   

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((trade) => {
            const entryPrice = trade.price;
            const exitPrice = trade.exit_price || 0; // You can compute or fetch actual exit price
            const quantity = trade.quantity;
            const avg = (entryPrice + exitPrice) / 2; // Example average
            const LTP = trade.ltp || 1548; // Replace with actual LTP if available
            return (
              <div
                key={trade._id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{trade.stock_symbol}</div>
                  <div className="text-sm text-gray-700">
                    Qty: {quantity} | Avg: {avg.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      trade.trade_type === "buy" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trade.trade_type.toUpperCase()}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <div>
                    Entry price: <span className="text-red-500">{entryPrice}</span>
                  </div>
                  <div>
                    Exit price: <span className="text-green-500">{exitPrice}</span>
                  </div>
                  <div>
                    LTP: {LTP}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {trade.trade_time ? new Date(trade.trade_time).toLocaleString() : "N/A"}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No trade history available.
        </p>
      )}
    </div>
  );
}

export default TradeHistory;
