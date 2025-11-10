import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Activity, Wallet, DollarSign, ChevronLeft } from "lucide-react";

// Note: Replace these imports with your actual service imports
import { BuySelltrade, GetMyContests, getOpenTrades } from "../../services/User";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const SOCKET_URL = "https://fx.tradestreet.in:1001";

function HistoryPage() {
  // For demo, using location state simulation
  const location = useLocation();
  const navigate = useNavigate();
  const contestId = location?.state?.contestId;
  const stocks = location?.state?.stocks || [];
  const initialWallet = Number(location?.state?.wallet_balance || 0);

  // Demo data - replace with your actual data
  // const contestId = "demo-contest-123";
  // const initialStocks = [
  //   { _id: "1", stock_name: "EURUSD", last_price: 1.0856, price_change: 0.45, high: 1.0890, low: 1.0820 },
  //   { _id: "2", stock_name: "GBPUSD", last_price: 1.2734, price_change: -0.23, high: 1.2780, low: 1.2710 },
  //   { _id: "3", stock_name: "USDJPY", last_price: 149.32, price_change: 0.67, high: 149.80, low: 148.90 },
  //   { _id: "4", stock_name: "AUDUSD", last_price: 0.6543, price_change: -0.12, high: 0.6570, low: 0.6520 },
  // ];
  // const initialWallet = 100000;

  // const [stocks] = useState(initialStocks);
  const [buySellLoadingId, setBuySellLoadingId] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [walletBalance, setWalletBalance] = useState(initialWallet);
  const [pnl, setPnl] = useState(2450.50);
  const [myContests, setMyContests] = useState([]);
  const [openTrades, setOpenTrades] = useState([
    { _id: "1", stock_symbol: "EURUSD", netQty: 150 },
    { _id: "2", stock_symbol: "GBPUSD", netQty: -75 },
  ]);
  const [tradesPage, setTradesPage] = useState(1);
  const [totalTradePages, setTotalTradePages] = useState(1);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [livePrices, setLivePrices] = useState({});

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("userId") || localStorage.getItem("client_id");

  // Socket connection for live prices
  useEffect(() => {

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("forex_data", (data) => {
      const { ticker, midPrice } = data;
      setLivePrices(prev => ({
        ...prev,
        [ticker.toUpperCase()]: Number(midPrice)
      }));
    });

    return () => socket.disconnect();


    // Demo: Simulate live price updates
    // const interval = setInterval(() => {
    //   setLivePrices(prev => {
    //     const updated = { ...prev };
    //     stocks.forEach(stock => {
    //       const change = (Math.random() - 0.5) * 0.01;
    //       const currentPrice = stock.last_price;
    //       updated[stock.stock_name] = Number((currentPrice + change).toFixed(4));
    //     });
    //     return updated;
    //   });
    // }, 2000);

    // return () => clearInterval(interval);
  }, [stocks]);

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

  const fetchOpenTrades = async (page = 1) => {
    if (!token || !clientId) return;
    setLoadingTrades(true);
    try {
      // Uncomment when integrating
      const data = { client_id: clientId, contest_id: contestId, page, limit: 10 };
      const res = await getOpenTrades(token, data);
      if (res.status) {
        setOpenTrades(res.data || []);
        setTradesPage(res.page || 1);
        setTotalTradePages(Math.ceil(res.total / res.limit) || 1);
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

  const getCurrentPrice = (stockName) => {
    const normalizedName = stockName.toUpperCase();
    return livePrices[normalizedName] ||
      stocks.find(s => s.stock_name.toUpperCase() === normalizedName)?.last_price ||
      0;
  };

  const openTradeModal = (stock, type) => {
    setSelectedStock(stock);
    setTradeType(type);
    setQuantity("");
  };

  const closeTradeModal = () => {
    setSelectedStock(null);
    setTradeType(null);
    setQuantity("");
  };

  const handleBuySell = async () => {
    if (!token || !clientId || !contestId) {
      toast.error("Missing authentication info");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    const currentPrice = getCurrentPrice(selectedStock.stock_name);

    if (!currentPrice || currentPrice <= 0) {
      toast.error("Invalid stock price. Please try again.");
      return;
    }

    setBuySellLoadingId(selectedStock._id);

    try {
      // Uncomment when integrating

      const payload = {
        contest_id: contestId,
        client_id: clientId,
        stock_symbol: selectedStock.stock_name.toUpperCase(),
        trade_type: tradeType.toLowerCase(),
        quantity: qty,
        price: currentPrice
      };

      console.log("📤 Sending trade payload:", payload);

      const res = await BuySelltrade(token, payload);

      if (res?.status) {
        toast.success(`${tradeType.toUpperCase()} order successful!`);
        closeTradeModal();
        await Promise.all([
          fetchMyContests(),
          fetchOpenTrades(tradesPage)
        ]);
      } else {
        toast.error(res?.message || "Trade failed");
        console.error("❌ Trade error:", res);
      }


      // Demo success
      // console.log(`${tradeType.toUpperCase()} ${qty} ${selectedStock.stock_name} @ ${currentPrice}`);
      // toast.success(`✅ ${tradeType.toUpperCase()} order placed successfully!`);
      closeTradeModal();

    } catch (err) {
      console.error("❌ Trade exception:", err);
      toast.error(err?.message || "Trade failed due to network error");
    } finally {
      setBuySellLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Live Trading</h1>
              <p className="text-xs text-slate-500">Real-time market prices</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigate("/tradehistory", { state: { contestId } })
                console.log("Navigate to trade history");
              }}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-xs shadow-sm transition-all"
            >
              View History
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-5">

        <div className="mb-5">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow rounded-2xl p-6 mb-8">

            <h2 className="text-sm font-semibold text-slate-700 mb-4 tracking-wide">
              Account Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              {/* Wallet Balance */}
              <div className="group p-3 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Wallet Balance</p>
                  <span className="text-lg">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  ₹{Number(walletBalance).toLocaleString()}
                </h2>
              </div>

              {/* Available Margin */}
              <div className="group p-3 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Available Margin</p>
                  <span className="text-lg">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mt-2">
                  ₹{Number(walletBalance - 500).toLocaleString()}
                </h2>
              </div>

              {/* Total PNL */}
              <div className="group p-3 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Total PNL</p>
                  <span className="text-lg">
                    {pnl >= 0 ? "📈" : "📉"}
                  </span>
                </div>
                <h2
                  className={`text-2xl font-bold mt-2 ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {pnl >= 0 ? "+" : "-"}₹{Math.abs(pnl).toLocaleString()}
                </h2>
              </div>

            </div>
          </div>

          {stocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stocks.map((stock) => {
                const currentPrice = getCurrentPrice(stock.stock_name);
                const isPositive = stock.price_change >= 0;

                return (
                  <div
                    key={stock._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-200"
                  >
                    {/* Stock Header */}
                    <div className="bg-gradient-to-r from-slate-50 to-white p-3 border-b">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">{stock.stock_name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Foreign Exchange</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 ${isPositive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPositive ? '+' : ''}{stock.price_change}%
                        </div>
                      </div>

                      {/* Price Display */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          {currentPrice}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-3 flex gap-2">
                      <button
                        onClick={() => openTradeModal(stock, 'buy')}
                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-semibold text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        BUY
                      </button>
                      <button
                        onClick={() => openTradeModal(stock, 'sell')}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ArrowDownRight className="w-4 h-4" />
                        SELL
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-600 py-8 text-sm">No stocks available for trading.</p>
          )}
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-500" />
            Open Positions
          </h2>

          {loadingTrades ? (
            <p className="text-center py-6 text-slate-500 text-sm">Loading open trades...</p>
          ) : openTrades.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 font-medium text-slate-600">Symbol</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-600">Net Qty</th>
                      <th className="text-right py-2 px-3 font-medium text-slate-600">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openTrades.map((trade) => (
                      <tr key={trade._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-800">{trade.stock_symbol}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-semibold text-slate-700">{Math.abs(trade.netQty)}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${trade.netQty >= 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {trade.netQty >= 0 ? 'LONG' : 'SHORT'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalTradePages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    disabled={tradesPage === 1}
                    onClick={() => fetchOpenTrades(tradesPage - 1)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 font-medium text-slate-700 text-xs">
                    Page {tradesPage} of {totalTradePages}
                  </span>
                  <button
                    disabled={tradesPage === totalTradePages}
                    onClick={() => fetchOpenTrades(tradesPage + 1)}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-slate-500 py-4 text-sm">No open positions</p>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className={`p-4 rounded-t-xl ${tradeType === 'buy'
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : 'bg-gradient-to-r from-red-500 to-red-600'
              } text-white`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {tradeType === 'buy' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.stock_name}
                </h3>
              </div>
              <p className="text-white/90 text-xs">Live Price</p>
              <p className="text-2xl font-bold">{getCurrentPrice(selectedStock.stock_name)}</p>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all text-sm font-medium"
                  autoFocus
                />
              </div>

              {/* Order Summary */}
              {quantity > 0 && (
                <div className="bg-slate-50 rounded-md p-3 mb-4 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-600 mb-2">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-semibold text-slate-800">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price:</span>
                      <span className="font-semibold text-slate-800">{getCurrentPrice(selectedStock.stock_name)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-slate-700">Total:</span>
                      <span className="font-bold text-sm text-slate-900">
                        ₹{(getCurrentPrice(selectedStock.stock_name) * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={closeTradeModal}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-md font-semibold hover:bg-slate-50 transition-all text-sm"
                  disabled={buySellLoadingId === selectedStock._id}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuySell}
                  disabled={buySellLoadingId === selectedStock._id}
                  className={`flex-1 py-2 text-white rounded-md font-bold shadow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${tradeType === 'buy'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  {buySellLoadingId === selectedStock._id
                    ? 'Processing...'
                    : `Confirm ${tradeType === 'buy' ? 'Buy' : 'Sell'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HistoryPage;
