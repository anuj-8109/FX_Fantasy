import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetContestHistory } from "../../services/User";
import toast from "react-hot-toast";

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
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold text-center mb-4">Trade History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((trade) => (
            <div
              key={trade._id}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              {/* Stock symbol */}
              <div className="font-semibold">{trade.stock_symbol}</div>

              {/* Quantity & Price */}
              <div className="text-sm text-gray-700">
                Qty: {trade.quantity} | Price: ₹{trade.price}
              </div>

              {/* Trade Type */}
              <div
                className={`text-sm font-bold ${
                  trade.trade_type === "buy" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trade.trade_type.toUpperCase()}
              </div>

              {/* Trade Time */}
              <div className="text-xs text-gray-500">
                {trade.trade_time
                  ? new Date(trade.trade_time).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          ))}
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
