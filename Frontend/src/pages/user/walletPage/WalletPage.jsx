import React, { useState, useEffect } from "react";
import { Clock, Plus, Minus, TrendingUp, Calendar, Wallet, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import {
  addMoneyInWallet,
  WalletHistory,
  withdrolmoney,
  withdrolHistory,
  GetUserDetails,
  getBankdetalis,
} from "../../../services/User";
import BackButton from "../../../pages/user/Backbutton";
import { useNavigate } from "react-router-dom";

const WalletPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [addMoneyHistory, setAddMoneyHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [buySellHistory, setBuySellHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const kycVerified = userDetails?.kyc_verification === 1;

  const tabs = [
    { key: "all", label: "All Transactions", icon: Wallet },
    { key: "add", label: "Add Money", icon: Plus },
    { key: "withdraw", label: "Withdrawals", icon: Minus },
    { key: "buysell", label: "Buy/Sell", icon: TrendingUp },
  ];

  /** Razorpay Script */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /** Add Money */
  const handleAddMoney = async () => {
    const { value: amount } = await Swal.fire({
      title: "Add Money to Wallet",
      input: "number",
      inputLabel: "Amount (₹)",
      inputPlaceholder: "Enter amount",
      showCancelButton: true,
      confirmButtonText: "Add Money",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value <= 0) return "Enter valid amount!";
        if (value < 10) return "Minimum amount is ₹10";
      },
    });

    if (!amount) return;

    const loaded = await loadRazorpayScript();
    if (!loaded) return Swal.fire("Error", "Razorpay failed to load", "error");

    const options = {
      key: "rzp_test_22mEHcDzJbcUmz",
      amount: amount * 100,
      currency: "INR",
      name: "Dream Trading",
      description: "Add Money",
      handler: async (response) => {
        try {
          const result = await addMoneyInWallet(token, {
            client_id: userId,
            amount: parseInt(amount),
            remark: "Add Money via Razorpay",
            payment_id: response.razorpay_payment_id,
            type: "add",
            date: new Date().toISOString(),
          });
          if (result.status) Swal.fire("Success", "Money added!", "success");
          fetchAllHistories();
        } catch {
          Swal.fire("Error", "Failed to add money", "error");
        }
      },
      prefill: { name: "User", email: "user@example.com", contact: "" },
      theme: { color: "#F97316" },
    };

    new window.Razorpay(options).open();
  };

  /** Fetch User */
  const fetchUser = async () => {
    try {
      const res = await GetUserDetails(token, userId);
      if (res?.status) setUserDetails(res.data);
    } catch (error) {
      console.error("Failed fetching user", error);
    }
  };

  /** Fetch Bank Details */
  useEffect(() => {
    const fetchBank = async () => {
      try {
        const res = await getBankdetalis(token, userId);
        if (res?.status && Array.isArray(res.data)) {
          setBankDetails(res.data);
          if (res.data.length === 1) setSelectedBank(res.data[0]);
        } else setBankDetails([]);
      } catch {
        setBankDetails([]);
      }
    };
    fetchBank();
    fetchUser();
  }, []);

  /** Withdraw */
  const handleWithdraw = async (bank) => {
    const { value: formValues } = await Swal.fire({
      title: "Withdraw Money",
      html: `<input id="swal-amount" type="number" class="swal2-input" placeholder="Amount (₹)">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const amount = document.getElementById("swal-amount").value;
        if (!amount || amount <= 0) Swal.showValidationMessage("Enter valid amount");
        if (amount < 100) Swal.showValidationMessage("Minimum ₹100");
        return { amount };
      },
    });

    if (!formValues || !bank) return;

    try {
      const result = await withdrolmoney(token, {
        clientId: userId,
        amount: parseInt(formValues.amount),
        remark: `Withdraw to ${bank.name} (A/C ${bank.accountno.slice(-4)})`,
        type: "withdraw",
        date: new Date().toISOString(),
      });
      if (result.status) Swal.fire("Success", "Withdrawal requested", "success");
      fetchAllHistories();
    } catch {
      Swal.fire("Error", "Withdrawal failed", "error");
    }
  };

  /** Fetch Histories */
  const fetchAddMoneyHistory = async () => {
    try {
      const res = await WalletHistory(token, { client_id: userId });
      if (res?.status) setAddMoneyHistory(res.data.filter(i => i.type?.toLowerCase() === "credit"));
    } catch { setAddMoneyHistory([]); }
  };

  const fetchWithdrawHistory = async () => {
    try {
      const res = await withdrolHistory(token, { id: userId });
      if (res?.status) setWithdrawHistory(res.data);
    } catch { setWithdrawHistory([]); }
  };

  const fetchBuySellHistory = async () => {
    try {
      const res = await WalletHistory(token, { client_id: userId });
      if (res?.status) {
        const data = res.data.filter(
          i => i.type?.toLowerCase() === "debit" &&
            i.remark &&
            ["buy", "sell", "trade"].some(w => i.remark.toLowerCase().includes(w))
        );
        setBuySellHistory(data);
      }
    } catch { setBuySellHistory([]); }
  };

  const fetchAllHistories = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchAddMoneyHistory(), fetchWithdrawHistory(), fetchBuySellHistory()]);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAllHistories(); }, []);

  const getAllHistory = () => [...addMoneyHistory, ...withdrawHistory, ...buySellHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filterByDate = (data) => {
    let filtered = [...data];
    if (startDate) filtered = filtered.filter(i => new Date(i.created_at || i.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter(i => new Date(i.created_at || i.date) <= new Date(endDate));
    return filtered.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
  };

  const getCurrentData = () => {
    let data = activeTab === "add" ? addMoneyHistory
      : activeTab === "withdraw" ? withdrawHistory
        : activeTab === "buysell" ? buySellHistory
          : getAllHistory();
    return filterByDate(data);
  };

  const TransactionItem = ({ item }) => {
    const isPositive = item.type === "credit" || item.type === "add";
    const isNegative = item.type === "debit" || item.type === "withdraw";
    const itemDate = item.created_at || item.date;

    return (
      <div className="p-4 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors duration-200 flex justify-between items-center  gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className={`p-2 rounded-full ${isPositive ? "bg-green-100 text-green-600" : isNegative ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {isPositive && <Plus size={16} />}
            {isNegative && <Minus size={16} />}
            {!isPositive && !isNegative && <TrendingUp size={16} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-700"}`}>
                {isPositive ? "+" : isNegative ? "-" : ""}₹{Math.abs(item.amount)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.remark || "No remark"}</p>
            {item.payment_id && <p className="text-xs text-gray-500">Payment ID: {item.payment_id}</p>}
          </div>
        </div>
        <div className="text-right min-w-[100px]">
          <p className="text-sm text-gray-500">{itemDate ? new Date(itemDate).toLocaleDateString("en-IN") : "N/A"}</p>
          <p className="text-xs text-gray-400">{itemDate ? new Date(itemDate).toLocaleTimeString("en-IN") : "N/A"}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 w-full md:w-auto border p-2 rounded-xl justify-between ">

        <h1 className="text-lg sm:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-2 whitespace-nowrap">
          <Wallet size={8} />
          Wallet
        </h1>
        <BackButton showText={true} />
      </div>

      <div className="p-4 mt-4 mb-4 bg-gray-100 rounded-xl shadow-md w-full max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
        {/* Add Money Text */}
        <span
          onClick={handleAddMoney}
          className="cursor-pointer text-black font-medium text-sm hover:underline"
        >
          + Add Money
        </span>

        {/* Withdraw Text */}
        <span
          onClick={() => {
            if (!kycVerified)
              return Swal.fire("KYC required", "Please complete KYC.", "warning").then(() =>
                navigate("/kycdetail")
              );
            if (!bankDetails.length)
              return Swal.fire("Bank Missing", "Add bank details.", "warning").then(() =>
                navigate("/bankdetail")
              );
            if (bankDetails.length > 1 && !selectedBank) {
              Swal.fire({
                title: "Select Bank",
                input: "select",
                inputOptions: bankDetails.reduce((acc, b, i) => {
                  acc[i] = `${b.name} (${b.accountno.slice(-4)})`;
                  return acc;
                }, {}),
                showCancelButton: true,
                confirmButtonText: "Select",
              }).then((res) => res.isConfirmed && handleWithdraw(bankDetails[res.value]));
              return;
            }
            handleWithdraw(selectedBank || bankDetails[0]);
          }}
          className={`cursor-pointer text-sm font-medium ${kycVerified && bankDetails.length ? "text-black hover:underline" : "text-gray-400 cursor-not-allowed"}`}
        >
          - Withdraw
        </span>

        {/* Tab Dropdown */}
        <div className="relative">
          <span
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer text-xs font-medium text-black flex items-center gap-1 hover:underline"
          >
            {React.createElement(tabs.find(t => t.key === activeTab).icon, { size: 16 })}
            {tabs.find(t => t.key === activeTab).label}
            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </span>

          {dropdownOpen && (
            <div className="absolute w-40 mt-1 bg-white border rounded-md shadow-lg z-10">
              {tabs.map(t => (
                <span
                  key={t.key}
                  onClick={() => {
                    setActiveTab(t.key);
                    setDropdownOpen(false);
                  }}
                  className={`block px-3 py-2 text-sm flex gap-3 cursor-pointer ${activeTab === t.key ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-orange-50"}`}
                >
                  {React.createElement(t.icon, { size: 14 })} {t.label}
                </span>
              ))}
            </div>
          )}

          {dropdownOpen && <div className="fixed inset-0 z-0" onClick={() => setDropdownOpen(false)} />}
        </div>
      </div>



      <div className="mb-4 p-4 rounded-xl border bg-gradient-to-r from-gray-50 to-gray-100 flex flex-wrap items-center justify-between shadow-sm gap-4">
        {/* Bank Info */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <img src="https://cdn-icons-png.flaticon.com/512/3094/3094830.png" alt="Bank" className="w-8 h-8" />
          {bankDetails.length ? (
            <div>
              <p className="text-sm text-green-600 font-semibold">✅ Bank Verified</p>
              <p className="text-gray-600 text-sm">{bankDetails[0]?.name} - A/C ending {bankDetails[0]?.accountno.slice(-4)}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-red-500 font-semibold">⚠️ No Bank Added</p>
              <button
                onClick={() => navigate("/bankdetail")}
                className="text-xs text-orange-600 underline hover:text-orange-700 mt-1"
              >
                Add Bank
              </button>
            </div>
          )}
        </div>

        {/* KYC Info */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <img src="https://cdn-icons-png.flaticon.com/512/2910/2910765.png" alt="KYC" className="w-8 h-8" />
          {kycVerified ? (
            <div>
              <p className="text-sm text-green-600 font-semibold">✅ KYC Verified</p>
              <p className="text-gray-600 text-sm">You are fully verified</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-red-500 font-semibold">⚠️ KYC Pending</p>
              <button
                onClick={() => navigate("/kycdetail")}
                className="text-xs text-orange-600 underline hover:text-orange-700 mt-1"
              >
                Complete KYC
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 border rounded-xl">
        {/* Calendar Label */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <Calendar size={18} className="text-orange-500" />
          <span className="font-medium text-gray-700">Filter by Date:</span>
        </div>

        {/* Date Inputs */}
        <div className="flex gap-2 flex-1 min-w-[0] w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full sm:w-auto flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="text-gray-500 flex-shrink-0 self-center">to</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full sm:w-auto flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Clear Button */}
        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto flex-shrink-0"
          >
            Clear
          </button>
        )}
      </div>



      {/* Transaction History */}
      <div className="bg-white border rounded-2xl  sm:p-4 shadow-sm w-full max-w-full">
        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="flex space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-300 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[500px] overflow-y-auto ">
            {getCurrentData().map((item, idx) => (
              <TransactionItem key={item._id || idx} item={item} />
            ))}

            {getCurrentData().length === 0 && (
              <div className="text-center py-8 sm:py-12 px-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                  alt="No Data"
                  className="w-16 sm:w-24 mx-auto opacity-70 mb-3"
                />
                <p className="text-gray-500 text-sm sm:text-lg font-medium">
                  No transactions found
                </p>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default WalletPage;
