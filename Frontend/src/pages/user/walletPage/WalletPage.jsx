import React, { useState, useEffect } from "react";
import { Clock, Plus, Minus, TrendingUp, Calendar, Filter, Wallet, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import {
  addMoneyInWallet,
  WalletHistory,
  withdrolmoney,
  withdrolHistory,
  GetUserDetails,
  getBankdetalis
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
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);


  const kycVerified = userDetails?.kyc_verification === 1;


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handleAddMoney = async () => {
    const { value: amount } = await Swal.fire({
      title: "Add Money to Wallet",
      input: "number",
      inputLabel: "Amount to Add (₹)",
      inputPlaceholder: "Enter amount",
      showCancelButton: true,
      confirmButtonText: "Add Money",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "Please enter a valid amount!";
        }
        if (value < 10) {
          return "Minimum amount is ₹10";
        }
      },
    });

    if (amount) {
      const res = await loadRazorpayScript();
      if (!res) {
        Swal.fire("Error!", "Razorpay SDK failed to load.", "error");
        return;
      }

      const options = {
        key: "rzp_test_22mEHcDzJbcUmz",
        amount: amount * 100,
        currency: "INR",
        name: "Dream Trading",
        description: "Add Money to Wallet",
        handler: async function (response) {


          const data = {
            client_id: userId,
            amount: parseInt(amount),
            remark: "Add Money via Razorpay",
            payment_id: response.razorpay_payment_id,
            type: "add",
            date: new Date().toISOString(),
          };

          try {
            const result = await addMoneyInWallet(token, data);
            if (result.status) {
              Swal.fire("Success!", result.message || "Money added successfully.", "success");
              fetchAddMoneyHistory();
            } else {
              Swal.fire("Error", result.message || "Failed to add money.", "error");
            }
          } catch (error) {
            Swal.fire("Error", "Something went wrong!", "error");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "",
        },
        theme: {
          color: "#F97316",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  };

  const fetchUser = async () => {
    try {
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const res = await GetUserDetails(token, id); // aapka API function
      if (res?.status) setUserDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };


  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const id = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const res = await getBankdetalis(token, id);

        if (res?.status && Array.isArray(res.data)) {
          setBankDetails(res.data);
          if (res.data.length === 1) {
            setSelectedBank(res.data[0]); // auto-select if only one bank
          }
        } else {
          setBankDetails([]);
          setSelectedBank(null);
        }
      } catch (error) {
        console.error("Failed to fetch bank details:", error);
        setBankDetails([]);
      }
    };
    fetchBankDetails();
  }, []);



  useEffect(() => {
    fetchUser();
  }, []);


  // Withdraw Function
 const handleWithdraw = async (bank) => {
  const { value: formValues } = await Swal.fire({
    title: "Withdraw Money",
    html: `<input id="swal-amount" type="number" class="swal2-input" placeholder="Amount (₹)" style="margin-bottom: 10px;">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit Withdrawal",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const amount = document.getElementById("swal-amount").value;
      if (!amount || amount <= 0) {
        Swal.showValidationMessage("Please enter a valid amount");
        return null;
      }
      if (amount < 100) {
        Swal.showValidationMessage("Minimum withdrawal amount is ₹100");
        return null;
      }
      return { amount };
    },
  });

  if (formValues && bank) {
    const data = {
      clientId: userId,
      amount: parseInt(formValues.amount),
      remark: `Withdraw to ${bank.name} (${bank.accountno.slice(-4)}), IFSC: ${bank.ifsc}`,
      type: "withdraw",
      date: new Date().toISOString(),
    };

    try {
      const result = await withdrolmoney(token, data);
      if (result.status) {
        Swal.fire("Success!", result.message || "Withdrawal request submitted successfully.", "success");
        fetchWithdrawHistory();
      } else {
        Swal.fire("Error", result.message || "Failed to request withdrawal.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  }
};


  // Fetch Add Money History
  const fetchAddMoneyHistory = async () => {
    try {


      console.log("Fetching add money history...", { token: !!token, userId });

      const data = { client_id: userId };
      const walletRes = await WalletHistory(token, data);

      console.log("Add money API response:", walletRes);

      if (walletRes?.status) {
        const allData = walletRes.data || [];
        console.log("All wallet data:", allData);

        // Filter for "credit" type transactions (Add Money)
        const addTransactions = allData.filter(
          item => item.type?.toLowerCase() === "credit"
        );

        console.log("Filtered add transactions:", addTransactions);
        setAddMoneyHistory(addTransactions);
      } else {
        console.log("Add money API failed:", walletRes);
        setAddMoneyHistory([]);
      }
    } catch (error) {
      console.error("Error fetching add money history:", error);
      setAddMoneyHistory([]);
    }
  };

  // Fetch Withdraw History
  const fetchWithdrawHistory = async () => {
    try {

      const data = { id: userId };
      const withdrawRes = await withdrolHistory(token, data);
      console.log("Withdraw :", withdrawRes);

      if (withdrawRes?.status) {
        const withdrawData = withdrawRes.data || [];
        console.log("Withdraw data:", withdrawData);
        setWithdrawHistory(withdrawData);
      } else {
        console.log("Withdraw API failed:", withdrawRes);
        setWithdrawHistory([]);
      }
    } catch (error) {
      console.error("Error fetching withdraw history:", error);
      setWithdrawHistory([]);
    }
  };

  // Fetch Buy/Sell History (from wallet history)
  const fetchBuySellHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      console.log("Fetching buy/sell history...", { token: !!token, userId });

      const data = { client_id: userId };
      const walletRes = await WalletHistory(token, data);

      console.log("Buy/Sell API response:", walletRes);

      if (walletRes?.status) {
        const allData = walletRes.data || [];

        // Filter for "debit" type transactions (Buy/Sell or other deductions)
        const buySellTransactions = allData.filter(
          item => item.type?.toLowerCase() === "debit" &&
            item.remark &&
            (item.remark.toLowerCase().includes("buy") ||
              item.remark.toLowerCase().includes("sell") ||
              item.remark.toLowerCase().includes("trade"))
        );

        console.log("Filtered buy/sell transactions:", buySellTransactions);
        setBuySellHistory(buySellTransactions);
      } else {
        console.log("Buy/Sell API failed:", walletRes);
        setBuySellHistory([]);
      }
    } catch (error) {
      console.error("Error fetching buy/sell history:", error);
      setBuySellHistory([]);
    }
  };

  // Fetch All Histories
  const fetchAllHistories = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAddMoneyHistory(),
        fetchWithdrawHistory(),
        fetchBuySellHistory()
      ]);
    } catch (error) {
      console.error("Error fetching all histories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHistories();
  }, []);

  // Get Combined History for "All" tab
  const getAllHistory = () => {
    const combined = [
      ...addMoneyHistory,
      ...withdrawHistory,
      ...buySellHistory
    ];
    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Filter by Date
  const filterByDate = (data) => {
    let filtered = [...data];

    if (startDate) {
      filtered = filtered.filter((item) => {
        const itemDate = item.created_at || item.date;
        return itemDate && new Date(itemDate) >= new Date(startDate);
      });
    }
    if (endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = item.created_at || item.date;
        return itemDate && new Date(itemDate) <= new Date(endDate);
      });
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date);
      const dateB = new Date(b.created_at || b.date);
      return dateB - dateA;
    });
  };

  // Get Current Display Data
  const getCurrentData = () => {
    let data = [];
    switch (activeTab) {
      case "add":
        data = addMoneyHistory;
        break;
      case "withdraw":
        data = withdrawHistory;
        break;
      case "buysell":
        data = buySellHistory;
        break;
      default:
        data = getAllHistory();
    }

    console.log("Current tab:", activeTab, "Data:", data);
    const filteredData = filterByDate(data);
    console.log("Filtered data:", filteredData);

    return filteredData;
  };

  // Transaction Item Component
  const TransactionItem = ({ item }) => {

    const isPositive = item.type === "credit" || item.type === "add";
    const isNegative = item.type === "debit" || item.type === "withdraw";
    const itemDate = item.created_at || item.date;

    return (
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isPositive ? 'bg-green-100 text-green-600' :
              isNegative ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
              {(item.type === "credit" || item.type === "add") && <Plus size={16} />}
              {(item.type === "debit" || item.type === "withdraw") && <Minus size={16} />}
              {item.type === "buysell" && <TrendingUp size={16} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-lg ${isPositive ? 'text-green-600' :
                  isNegative ? 'text-red-600' :
                    'text-gray-700'
                  }`}>
                  {isPositive ? "+" : isNegative ? "-" : ""}₹{Math.abs(item.amount)}
                </span>
                {/* {item.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === true || item.status === "completed" ? "bg-green-100 text-green-700" :
                    item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                    {item.status === true ? "Completed" : item.status}
                  </span>
                )} */}
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.remark || "No remark"}</p>
              {item.payment_id && (
                <p className="text-xs text-gray-500 mt-1">Payment ID: {item.payment_id}</p>
              )}
              {item._id && (
                <p className="text-xs text-gray-400 mt-1">Transaction ID: {item._id}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {itemDate ? new Date(itemDate).toLocaleDateString('en-IN') : 'N/A'}
            </p>
            <p className="text-xs text-gray-400">
              {itemDate ? new Date(itemDate).toLocaleTimeString('en-IN') : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { key: "all", label: "All Transactions", icon: Wallet },
    { key: "add", label: "Add Money", icon: Plus },
    { key: "withdraw", label: "Withdrawals", icon: Minus },
    // { key: "buysell", label: "Buy/Sell", icon: TrendingUp },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto  bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Left: Back button + Heading */}
        <div className="flex items-center ">
          <BackButton showText={false} />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent flex items-center gap-2">
            <Wallet size={20} />
            Wallet Management
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddMoney}
            className="px-3 py-2 rounded-xl shadow-md flex items-center gap-2 font-medium text-white transition-all duration-200
  bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105"
          >
            <Plus size={18} />
            Add Money
          </button>


          <button
            onClick={() => {
              if (!kycVerified) {
                Swal.fire({
                  icon: "warning",
                  title: "KYC Verification Required",
                  text: "Please complete your KYC to withdraw funds.",
                  confirmButtonText: "Go to KYC",
                }).then(() => navigate("/kycdetail"));
                return;
              }

              if (!bankDetails.length) {
                Swal.fire({
                  icon: "warning",
                  title: "Bank Details Missing",
                  text: "Please add and verify your bank account before withdrawing.",
                  confirmButtonText: "Add Bank",
                }).then(() => navigate("/bankdetail"));
                return;
              }

              // If multiple banks, prompt user to select
              if (bankDetails.length > 1 && !selectedBank) {
                Swal.fire({
                  title: "Select Bank Account",
                  input: "select",
                  inputOptions: bankDetails.reduce((acc, bank, index) => {
                    acc[index] = `${bank.name} (${bank.accountno.slice(-4)}) - ${bank.ifsc}`;
                    return acc;
                  }, {}),
                  inputPlaceholder: "Choose bank",
                  showCancelButton: true,
                  confirmButtonText: "Select",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const chosenBank = bankDetails[result.value];
                    setSelectedBank(chosenBank);
                    handleWithdraw(chosenBank); // pass selected bank
                  }
                });
                return;
              }

              // If single or already selected bank
              handleWithdraw(selectedBank || bankDetails[0]);
            }}
            className={`px-3 py-2 rounded-xl shadow-md flex items-center gap-2 font-medium text-white transition-all duration-200
    ${kycVerified && bankDetails.length
                ? "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-lg hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            <Minus size={18} />
            Withdraw
          </button>




        </div>
      </div>



      {/* ✅ Bank Status Section */}
      <div className="mb-6 p-4 rounded-xl border bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3094/3094830.png"
            alt="Bank Icon"
            className="w-8 h-8"
          />
          {bankDetails ? (
            <div>
              <p className="text-sm text-green-600 font-semibold">✅ Bank Verified</p>
              <p className="text-gray-600 text-sm">
                {bankDetails.bankName} — A/C ending in{" "}
                {bankDetails.accountNumber?.slice(-4)}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-red-500 font-semibold">⚠️ No Bank Details Added</p>
              <button
                onClick={() => navigate("/bankdetail")}
                className="text-xs text-orange-600 underline hover:text-orange-700 mt-1"
              >
                Add Bank Details
              </button>
            </div>
          )}
        </div>
      </div>




      {/* Tabs */}
      {/* Dropdown for Tabs */}
      <div className="relative mb-8 w-64">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className=" px-2 py-2 bg-orange-500 text-white rounded-xl shadow-md flex items-center justify-between font-medium hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            {tabs.find(t => t.key === activeTab)?.icon &&
              React.createElement(tabs.find(t => t.key === activeTab).icon, { size: 18 })}
            {tabs.find(t => t.key === activeTab)?.label}
          </div>
          <ChevronDown size={18} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setDropdownOpen(false); }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-2 transition-colors duration-200
              ${activeTab === tab.key ? "bg-orange-100 text-orange-600 font-medium" : "text-gray-700 hover:bg-orange-50"}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {dropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>


      <div className="flex flex-wrap gap-4 items-center mb-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-orange-500" />
          <span className="text-sm font-semibold text-gray-700">Filter by Date:</span>
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {(startDate || endDate) && (
          <button
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Clock size={24} className="text-orange-600" />
          <h2 className="text-xl font-bold text-gray-800">
            {tabs.find(t => t.key === activeTab)?.label} History
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-3 h-3 bg-orange-300 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {getCurrentData().map((item, idx) => (
              <TransactionItem key={item.id || idx} item={item} />
            ))}

            {getCurrentData().length === 0 && (
              <div className="text-center py-12">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                  alt="No Data"
                  className="w-24 mx-auto opacity-70 mb-3"
                />
                <p className="text-gray-500 text-lg font-medium">No transactions found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {activeTab === "all"
                    ? "Start by adding money or making a transaction"
                    : `No ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()} history yet`}
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