import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { BuySelltrade } from "../../services/User";
import toast from "react-hot-toast";


function BuySell() {
  const location = useLocation();
  const contestId = location?.state?.contestId;

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

  const [stockSymbol, setStockSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrade = async (trade_type) => {
    if (!token || !clientId || !contestId) {
      alert("Missing token, clientId, or contestId!");
      return;
    }
    if (!stockSymbol || !quantity) {
      alert("Please enter stock symbol and quantity.");
      return;
    }

    if (!window.confirm(`Are you sure you want to ${trade_type} ${quantity} ${stockSymbol}?`)) return;

    setLoading(true);
    try {
      const payload = {
        contest_id: contestId,
        client_id: clientId,
        stock_symbol: stockSymbol,
        trade_type,
        quantity: quantity.toString(),
      };

      const res = await BuySelltrade(token, payload);
      if (res?.status) {
        toast.success("Trade successful!");
        setStockSymbol("");
        setQuantity("");
      } else {
        toast.error(res?.message || "Trade failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network/server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center ">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">Buy / Sell Trade</h2>

        <input
          type="text"
          placeholder="Stock Symbol (e.g. TCS)"
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
          className="w-full border rounded-lg p-2 text-sm"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
        />

        <div className="flex space-x-4">
          <button
            onClick={() => handleTrade("buy")}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy"}
          </button>
          <button
            onClick={() => handleTrade("sell")}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuySell;
