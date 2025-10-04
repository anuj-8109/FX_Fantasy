import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BuySelltrade, GetMyContests } from "../../services/User";
import toast from "react-hot-toast";

function HistoryPage() {
  const location = useLocation();
  const contestId = location?.state?.contestId;
  const stocks = location?.state?.stocks || [];
  const initialWallet = Number(location?.state?.wallet_balance || 0);

  const [buySellLoadingId, setBuySellLoadingId] = useState(null);
  const [showQuantityBox, setShowQuantityBox] = useState(null);
  const [quantityMap, setQuantityMap] = useState({});
  const [walletBalance, setWalletBalance] = useState(initialWallet);
  const [pnl, setPnl] = useState(0);
  const [myContests, setMyContests] = useState([]);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

  const fetchMyContests = async () => {
    if (!token || !clientId) return;
    try {
      const data = await GetMyContests(token, clientId);
      if (data.status && data.data?.length > 0) {
        const contestWrapper = data.data.find(c => c.contest_id?._id === contestId);
        setMyContests(data.data);
        if (contestWrapper) {
          setWalletBalance(contestWrapper?.wallet_balance);
        }
      }
    } catch (err) {
      console.error("Error fetching My Contests:", err);
    }
  };

  useEffect(() => {
    fetchMyContests();
  }, []);

  const handleBuySell = async (stock_symbol, trade_type, stockId, quantity, price) => {
    if (!token || !clientId || !contestId) return toast.error("Missing info");

    const qty = Number(quantity);

    setBuySellLoadingId(stockId);
    try {
      const payload = {
        contest_id: contestId,
        client_id: clientId,
        stock_symbol,
        trade_type,
        quantity: qty,
        price: price  // ✅ add this
      };

      const res = await BuySelltrade(token, payload);
      if (res?.status) {
        toast.success("Trade successful!");
        setShowQuantityBox(null);
        setQuantityMap({ ...quantityMap, [stockId]: "" });
        await fetchMyContests();
      } else {
        toast.error(res?.message || "Trade failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Trade failed due to network error");
    } finally {
      setBuySellLoadingId(null);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Balance Section */}
      <div className="max-w-6xl mx-auto w-full mt-6 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black text-white mt-8 rounded-full w-10 h-10 flex items-center justify-center text-xl">
              ₹
            </div>
          </div>
          <h2 className="mt-6 text-lg font-semibold">
            Total Balance: <span className="text-green-600 font-bold">₹{walletBalance + pnl}</span>
          </h2>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="border rounded-lg py-3">
              <p className="text-orange-600 font-semibold">Unutilized</p>
              <p className="text-gray-500 text-xs">The Money You Add</p>
              <p className="text-lg font-bold text-orange-600">₹{walletBalance}</p>
            </div>
            <div className="border rounded-lg py-3">
              <p className="text-green-600 font-semibold">P&amp;L</p>
              <p className="text-gray-500 text-xs">The Money You Win</p>
              <p className="text-lg font-bold text-green-600">₹{pnl}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-6 flex-1">
        {stocks.length > 0 ? (
          stocks.map((s) => (
            <div key={s._id} className="bg-white shadow rounded-lg p-4 flex items-center justify-between mb-4 relative">
              <p className="font-semibold">{s.stock_name}</p>
              <div className="text-right">
                <p className="font-medium text-gray-800">{s.last_price}</p>
                <p className={`text-sm font-semibold ${s.price_change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {s.price_change >= 0 ? `+${s.price_change}%` : `${s.price_change}%`}
                </p>
              </div>

              <div className="flex space-x-2 relative">
                <button onClick={() => setShowQuantityBox({ id: s._id, type: "buy" })} className="px-4 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600">BUY</button>
                <button onClick={() => setShowQuantityBox({ id: s._id, type: "sell" })} className="px-4 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600">SELL</button>

                {showQuantityBox?.id === s._id && (
                  <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg p-4 w-64 z-10">
                    <p className="font-semibold mb-2">Enter Quantity ({showQuantityBox.type.toUpperCase()})</p>
                    <input type="number" min="1" className="w-full border rounded px-2 py-1 mb-3" value={quantityMap[s._id] || ""} onChange={(e) => setQuantityMap({ ...quantityMap, [s._id]: e.target.value })} />
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => setShowQuantityBox(null)} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                      <button
                        onClick={() =>
                          handleBuySell(
                            s.stock_name,
                            showQuantityBox.type,
                            s._id,
                            quantityMap[s._id] || "1",
                            s.last_price // ✅ pass the price
                          )
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={buySellLoadingId === s._id}
                      >
                        {buySellLoadingId === s._id ? "..." : `Confirm ${showQuantityBox.type.toUpperCase()}`}
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No stocks available</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
