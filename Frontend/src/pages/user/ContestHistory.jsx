import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { GetContestHistory } from "../../services/User";

function HistoryPage() {
  const { contestId: paramContestId } = useParams();
  const location = useLocation();
  const contestId = location?.state?.contestId || paramContestId;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dummyBalance = {
    totalBalance: 20140,
    unutilized: 3140,
    pnl: 1420,
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

        if (!token || !clientId || !contestId) {
          console.error("❌ Missing token, clientId, or contestId", {
            token,
            clientId,
            contestId,
          });
          setError("Missing token, clientId, or contestId. Please login and select a contest.");
          setLoading(false);
          return;
        }

        console.log("📡 Fetching Trade History with:", { token,  });
        const data1 = { client_id : clientId,contest_id: contestId , page : 1 }
        const data = await GetContestHistory(token,data1);

        console.log("✅ API Response:", data);

        if (data?.status) {
          setHistory(data.data || []);
        } else {
          setHistory([]);
          setError(data?.message || "No trade history found.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Network or server error occurred.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contestId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col hitstory_style">
      {/* Balance Card */}
      <div className="max-w-4xl w-full mx-auto mt-6  shadow rounded-xl p-6 text-center Card-style">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl">
            ₹
          </div>
        </div>
        <h2 className="text-lg font-semibold ">Total Balance :</h2>
        <p className="text-2xl font-bold text-green-600">
          ₹{dummyBalance.totalBalance}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-orange-600 font-medium">Unutilized</p>
            <p className=" text-sm">The Money You Add</p>
            <p className="font-bold text-orange-500">₹{dummyBalance.unutilized}</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-green-600 font-medium">P&L</p>
            <p className=" text-sm">The Money You Win</p>
            <p className="font-bold text-green-500">₹{dummyBalance.pnl}</p>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="max-w-4xl w-full mx-auto mt-6 space-y-4 px-4">
        {history.length > 0 ? (
          history.map((trade) => (
            <div
              key={trade._id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              {/* Stock */}
              <div className="w-1/3">
                <p className="font-semibold">{trade.stock_symbol}</p>
                <p className="text-gray-600 text-sm">Qty: {trade.quantity}</p>
              </div>

              {/* Price & Time */}
              <div className="w-1/3 text-center">
                <p className="text-gray-600 text-sm">Price: ₹{trade.price}</p>
                <p className="text-xs text-gray-500">
                  {trade.trade_time
                    ? new Date(trade.trade_time).toLocaleString()
                    : "N/A"}
                </p>
              </div>

              {/* Buy/Sell */}
              <div className="w-1/3 flex justify-end">
                <span
                  className={`px-4 py-2 rounded-lg text-white text-sm ${
                    trade.trade_type === "buy" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {trade.trade_type?.toUpperCase()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center ">No trade history</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
