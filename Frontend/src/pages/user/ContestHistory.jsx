import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BuySelltrade, GetMyContests, getOpenTrades } from "../../services/User";
import toast from "react-hot-toast";
import BackButton from "../../pages/user/Backbutton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {useSheetData} from '../../utils/data';

function HistoryPage() {
  const sheetCSVUrl = "https://docs.google.com/spreadsheets/d/1CZoeoUXH__2UrFfldIMvczrMuKDIU5ZYdoTrjPplTLI/edit?gid=0#gid=0";
  const location = useLocation();
  const navigate = useNavigate();
  const contestId = location?.state?.contestId;
  const stocks = location?.state?.stocks || [];
  const initialWallet = Number(location?.state?.wallet_balance || 0);

  const [buySellLoadingId, setBuySellLoadingId] = useState(null);
  const [showQuantityBox, setShowQuantityBox] = useState(null);
  const [quantityMap, setQuantityMap] = useState({});
  const [walletBalance, setWalletBalance] = useState(initialWallet);
  const [pnl, setPnl] = useState(0);
  const [myContests, setMyContests] = useState([]);

  // Open trades state
  const [openTrades, setOpenTrades] = useState([]);
  const [tradesPage, setTradesPage] = useState(1);
  const [totalTradePages, setTotalTradePages] = useState(1);
  const [loadingTrades, setLoadingTrades] = useState(false);

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

  // Fetch My Contests
  const fetchMyContests = async () => {
    if (!token || !clientId) return;
    try {
      const data = await GetMyContests(token, clientId);
      if (data.status && data.data?.length > 0) {
        const contestWrapper = data.data.find((c) => c.contest_id?._id === contestId);
        setMyContests(data.data);
        if (contestWrapper) setWalletBalance(contestWrapper?.wallet_balance);
      }
    } catch (err) {
      console.error("Error fetching My Contests:", err);
    }
  };

  // Fetch Open Trades
  const fetchOpenTrades = async (page = 1) => {
    if (!token || !clientId) return;
    setLoadingTrades(true);
    try {
      const data = { client_id: clientId, contest_id: contestId, page, limit: 10 };
      const res = await getOpenTrades(token, data);

      if (res.status) {
        // Update table data
        setOpenTrades(res.data || []);
        setTradesPage(res.page || 1);
        setTotalTradePages(Math.ceil(res.total / res.limit) || 1);

        // Optional: scroll to table top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.message || "Failed to fetch open trades");
      }
    } catch (err) {
      console.error("Error fetching open trades:", err);
      toast.error("Network error while fetching trades");
    } finally {
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    fetchMyContests();
    fetchOpenTrades();
  }, []);

  // Buy/Sell handler
  const handleBuySell = async (stock_symbol, trade_type, stockId, quantity, price) => {
    if (!token || !clientId || !contestId) return toast.error("Missing info");

    const qty = Number(quantity);
    setBuySellLoadingId(stockId);

    try {
      const payload = { contest_id: contestId, client_id: clientId, stock_symbol, trade_type, quantity: qty, price };
      const res = await BuySelltrade(token, payload);
      if (res?.status) {
        toast.success("Trade successful!");
        setShowQuantityBox(null);
        setQuantityMap({ ...quantityMap, [stockId]: "" });
        await fetchMyContests();
        await fetchOpenTrades(tradesPage);
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
    <div className="bg-gray-100 min-h-screen flex flex-col p-2">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-100 text-black px-5 py-3 shadow-md rounded-b-2xl">
        <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">Trading</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/tradehistory", { state: { contestId } })}
            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-400 rounded-lg font-semibold text-sm shadow-sm transition-all"
          >
            View History
          </button>
          <BackButton />
        </div>
      </header>

      {/* Wallet Summary */}
      <div className="max-w-6xl mx-auto w-full mt-4">
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Wallet Summary</h2>
            <span className="text-sm text-gray-500">Updated just now</span>
          </div>
          <div className="text-center mb-5">
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold text-green-600">₹{walletBalance + pnl}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg text-center">
              <p className="text-xs text-orange-700 font-medium">Unutilized Balance</p>
              <p className="text-lg font-bold text-orange-600 mt-1">₹{walletBalance}</p>
            </div>
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
              <p className="text-xs text-green-700 font-medium">Profit & Loss</p>
              <p className="text-lg font-bold text-green-600 mt-1">₹{pnl}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="max-w-6xl mx-auto w-full mt-4 flex-1">
        {stocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {stocks.map((s) => (
              <div
                key={s._id}
                className="relative bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-2xl p-5 transition-all duration-300 overflow-hidden group"
              >
                {/* Stock Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{s.stock_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-700 font-medium">₹{s.last_price}</span>
                      <span
                        className={`flex items-center text-sm font-semibold ${
                          s.price_change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {s.price_change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {s.price_change >= 0 ? `+${s.price_change}%` : `${s.price_change}%`}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      s.price_change >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.price_change >= 0 ? "Bullish" : "Bearish"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => setShowQuantityBox({ id: s._id, type: "buy" })}
                    className="flex-1 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all shadow-sm hover:scale-105"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setShowQuantityBox({ id: s._id, type: "sell" })}
                    className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm hover:scale-105"
                  >
                    SELL
                  </button>
                </div>

                {/* Quantity Box */}
                {showQuantityBox?.id === s._id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 animate-fadeIn">
                    <div className="bg-white p-5 rounded-2xl shadow-2xl w-72 border border-gray-200">
                      <p className="font-semibold mb-2 text-gray-800 text-center">
                        {showQuantityBox.type === "buy" ? "Buy" : "Sell"} Quantity
                      </p>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                        value={quantityMap[s._id] || ""}
                        onChange={(e) => setQuantityMap({ ...quantityMap, [s._id]: e.target.value })}
                      />
                      <div className="flex justify-between mt-3">
                        <button
                          onClick={() => setShowQuantityBox(null)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleBuySell(
                              s.stock_name,
                              showQuantityBox.type,
                              s._id,
                              quantityMap[s._id] || "1",
                              s.last_price
                            )
                          }
                          className={`px-4 py-1.5 rounded-lg text-sm text-white font-medium ${
                            showQuantityBox.type === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                          }`}
                          disabled={buySellLoadingId === s._id}
                        >
                          {buySellLoadingId === s._id ? "Processing..." : `Confirm ${showQuantityBox.type.toUpperCase()}`}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-12 text-lg">No stocks available for trading.</p>
        )}
      </div>

      {/* Open Trades Table */}
      <div className="max-w-6xl mx-auto w-full mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Open Trades</h2>

        {loadingTrades ? (
          <p>Loading open trades...</p>
        ) : openTrades.length > 0 ? (
          <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contest</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {openTrades.map((trade) => (
                  <tr key={trade._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800 font-medium">{trade.stock_symbol}</td>
                    <td className={`px-4 py-2 font-medium ${trade.netQty >= 0 ? 'text-green-600' : 'text-red-600'}`}>{trade.netQty}</td>
                    <td className="px-4 py-2 text-gray-600">{trade.contest_id?.name || "-"}</td>
                    <td className="px-4 py-2 text-gray-600">{trade.client_id?.FullName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No open trades available.</p>
        )}

        {/* Pagination */}
        {totalTradePages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={tradesPage === 1}
              onClick={() => fetchOpenTrades(tradesPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">{tradesPage} / {totalTradePages}</span>
            <button
              disabled={tradesPage === totalTradePages}
              onClick={() => fetchOpenTrades(tradesPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
