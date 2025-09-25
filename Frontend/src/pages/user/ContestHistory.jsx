import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BuySelltrade } from "../../services/User";
import BackButton from "../../pages/user/Backbutton";

function HistoryPage() {
  const location = useLocation();
  const contestId = location?.state?.contestId;
  const stocks = location?.state?.stocks || [];

  console.log("contestId", contestId);
  console.log("stocks", stocks);

  const [buySellLoadingId, setBuySellLoadingId] = useState(null);
  const [quantityMap, setQuantityMap] = useState({});

  const token = localStorage.getItem("token");
  const clientId =
    localStorage.getItem("userId") || localStorage.getItem("client_id");

  const handleBuySell = async (stock_symbol, trade_type, stockId) => {
    if (!token || !clientId || !contestId) {
      alert("Missing required info. Please login and select a contest.");
      return;
    }

    const quantity = quantityMap[stockId] || 1;

    if (
      !window.confirm(
        `Are you sure you want to ${trade_type} ${quantity} ${stock_symbol}?`
      )
    )
      return;

    setBuySellLoadingId(stockId);

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
        setQuantityMap((prev) => ({ ...prev, [stockId]: "" }));
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

  const handleQuantityChange = (stockId, value) => {
    if (!/^\d*$/.test(value)) return; // only allow numbers
    setQuantityMap((prev) => ({ ...prev, [stockId]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col hitstory_style">
      <BackButton />

      {/* Stocks List */}
      <div className="max-w-4xl w-full mx-auto mt-6 space-y-4 px-4">
        {stocks.length > 0 ? (
          stocks.map((s) => (
            <div
              key={s._id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div className="w-1/3">
                <p className="font-semibold">{s.stock_name}</p>
                <p className="text-gray-600 text-sm">Qty: 0</p>
              </div>

              <div className="w-1/3 text-center">
                <p className="text-gray-600 text-sm">Price: -</p>
                <p className="text-xs text-gray-500">No trade yet</p>
              </div>

              <div className="w-1/3 flex flex-col items-end space-y-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={quantityMap[s._id] || ""}
                  onChange={(e) => handleQuantityChange(s._id, e.target.value)}
                  className="border p-1 w-20 text-sm rounded-md"
                />
                <div className="flex space-x-2">
                  <button
                    disabled={buySellLoadingId === s._id}
                    onClick={() => handleBuySell(s.stock_name, "buy", s._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                  >
                    {buySellLoadingId === s._id ? "Processing..." : "Buy"}
                  </button>
                  <button
                    disabled={buySellLoadingId === s._id}
                    onClick={() => handleBuySell(s.stock_name, "sell", s._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    {buySellLoadingId === s._id ? "Processing..." : "Sell"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No stocks available.</p>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
