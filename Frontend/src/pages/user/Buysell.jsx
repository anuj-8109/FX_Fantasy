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
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-xl mt-4">
      <div className="flex justify-between items-center mb-6 border p-2 rounded-xl shadow-sm bg-gray-100">
        <h2 className="text-xl font-bold text-orange-600">Trade History</h2>
        <BackButton />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((trade) => {
            let entryPrice = trade.price || 0;
            let exitPrice = trade.exit_price || trade.ltp || 0;
            const quantity = trade.quantity || 0;
            const tradeType = trade.trade_type?.toLowerCase();

            // 🔁 If sell, reverse entry/exit prices for accurate P&L
            if (tradeType === "sell") {
              [entryPrice, exitPrice] = [exitPrice, entryPrice];
            }

            // 💰 Calculate Profit & Loss
            const pnl =
              tradeType === "buy"
                ? (exitPrice - entryPrice) * quantity
                : (entryPrice - exitPrice) * quantity;

            const isProfit = pnl >= 0;

            return (
              <div
                key={trade._id}
                className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-800 uppercase">
                    {trade.stock_symbol}
                  </div>
                  <div className="text-sm text-gray-700">
                    Qty: {quantity}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      tradeType === "buy" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tradeType.toUpperCase()}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <div>
                    Entry Price:{" "}
                    <span className="font-semibold text-blue-600">
                      {entryPrice.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    Exit Price:{" "}
                    <span className="font-semibold text-purple-600">
                      {exitPrice.toFixed(3)}
                    </span>
                  </div>
                  {/* <div>
                    P&L:{" "}
                    <span
                      className={`font-bold ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {pnl.toFixed(3)}
                    </span>
                  </div> */}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {trade.trade_time
                    ? new Date(trade.trade_time).toLocaleString()
                    : "N/A"}
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
