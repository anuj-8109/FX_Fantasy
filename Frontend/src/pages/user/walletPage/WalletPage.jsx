import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Swal from "sweetalert2";
import {
  addMoneyInWallet,
  WalletHistory,
  withdrolmoney,
  withdrolHistory,
} from "../../../services/User";

const WalletPage = () => {
  const [historyView, setHistoryView] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Add Money
  const handleAddMoney = async () => {
    const { value: amount } = await Swal.fire({
      title: "Enter Amount",
      input: "number",
      inputLabel: "Amount to Add",
      inputPlaceholder: "Enter amount",
      showCancelButton: true,
      confirmButtonText: "Add Money",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "Please enter a valid amount!";
        }
      },
    });

    if (amount) {
      const res = await loadRazorpayScript();
      if (!res) {
        Swal.fire("Razorpay SDK failed to load.");
        return;
      }

      const options = {
        key: "rzp_test_22mEHcDzJbcUmz",
        amount: amount * 100,
        currency: "INR",
        name: "Dream Trading",
        description: "Add Money Payment",
        handler: async function (response) {
          Swal.fire("Payment successful! ID: " + response.razorpay_payment_id);

          const token = localStorage.getItem("token");
          const userId = localStorage.getItem("userId");

          const data = {
            client_id: userId,
            amount: parseInt(amount),
            remark: "Add Money via Razorpay",
            payment_id: response.razorpay_payment_id,
            type: "add",
            date: new Date().toISOString(),
          };

          const result = await addMoneyInWallet(token, data);
          if (result.status) {
            Swal.fire("Wallet updated!", result.message || "Money added successfully.");
            fetchWalletHistory();
          } else {
            Swal.fire("Error", result.message || "Failed to add money.", "error");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
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

  // Withdraw
  const handleWithdraw = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Enter Withdrawal Details",
      html:
        `<input id="swal-account" class="swal2-input" placeholder="Account Number">` +
        `<input id="swal-ifsc" class="swal2-input" placeholder="IFSC Code">` +
        `<input id="swal-amount" type="number" class="swal2-input" placeholder="Amount">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Withdraw",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const account = document.getElementById("swal-account").value;
        const ifsc = document.getElementById("swal-ifsc").value;
        const amount = document.getElementById("swal-amount").value;
        if (!account || !ifsc || !amount || amount <= 0) {
          Swal.showValidationMessage("Please fill all fields with valid data");
          return null;
        }
        return { account, ifsc, amount };
      },
    });

    if (formValues) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const data = {
        client_id: userId,
        amount: parseInt(formValues.amount),
        remark: `Withdraw to A/C ${formValues.account}, IFSC ${formValues.ifsc}`,
        type: "withdraw",
        date: new Date().toISOString(),
      };

      const result = await withdrolmoney(token, data);
      if (result.status) {
        Swal.fire("Withdraw Requested", result.message || "Withdrawal request submitted.");
        fetchWalletHistory();
      } else {
        Swal.fire("Error", result.message || "Failed to request withdrawal.", "error");
      }
    }
  };

  // Fetch Wallet History
  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const data = { client_id: userId };

      const [walletRes, withdrawRes] = await Promise.all([
        WalletHistory(token, data),
        withdrolHistory(token, data),
      ]);

      let combined = [];
      if (walletRes?.status) {
        combined = [...combined, ...(walletRes.data || [])];
      }
      if (withdrawRes?.status) {
        combined = [...combined, ...(withdrawRes.data || [])];
      }

      setHistoryData(combined);
    } catch (err) {
      Swal.fire("Error", "Something went wrong while fetching history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletHistory();
  }, []);

  // Filter
  const getDisplayedHistory = () => {
    let data = [...historyData];

    if (historyView === "add") {
      data = data.filter((item) => item.type?.toLowerCase() === "add");
    } else if (historyView === "withdraw") {
      data = data.filter((item) => item.type?.toLowerCase() === "withdraw");
    } else if (historyView === "buysell") {
      data = data.filter((item) => item.type?.toLowerCase() === "buysell");
    }

    if (startDate) {
      data = data.filter((item) => new Date(item.date) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter((item) => new Date(item.date) <= new Date(endDate));
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-2 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-orange-500">Wallet Transactions</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleAddMoney}
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Add Money
        </button>

        <button
          onClick={handleWithdraw}
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Withdraw
        </button>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Transaction ▾
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
              {[
                { key: "all", label: "All History" },
                { key: "add", label: "Add Money History" },
                { key: "withdraw", label: "Withdraw History" },
                { key: "buysell", label: "Buy/Sell History" },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => {
                    setHistoryView(item.key);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-orange-100 cursor-pointer"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date Filters */}
      <div className="flex gap-4 items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      {/* History List */}
      <div className="border p-4 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-600">Transaction History</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {getDisplayedHistory().map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3 border rounded hover:bg-orange-50 transition"
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-medium ${item.type === "withdraw" ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {item.type === "withdraw" ? "-" : "+"} ₹{item.amount}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleString()}
                  </span>
                </div>

                {/* Remark */}
                <p className="text-xs text-gray-600 mt-1">{item.remark || "No remark"}</p>

                {/* Payment ID agar hai toh */}
                {item.payment_id && (
                  <p className="text-xs text-gray-500">Payment ID: {item.payment_id}</p>
                )}
              </div>
            ))}

            {/* Agar empty hai toh */}
            {getDisplayedHistory().length === 0 && (
              <p className="text-gray-500 text-center py-4">No transactions found.</p>
            )}
          </div>

        )}
      </div>
    </div>
  );
};

export default WalletPage;
