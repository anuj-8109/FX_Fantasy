import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Swal from "sweetalert2";
import { addMoneyInWallet, WalletHistory } from "../../../services/User";

const WalletPage = () => {
  const [historyView, setHistoryView] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment Handler
  const handlePayment = async (amount) => {
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
      handler: function (response) {
        Swal.fire("Payment successful! ID: " + response.razorpay_payment_id);
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
          const data = {
            client_id: "68c28a592059c3c6846682b4",
            amount: parseInt(amount),
            remark: "Add Money via Razorpay",
            payment_id: response.razorpay_payment_id,
          };

          const result = await addMoneyInWallet(token, data);
          if (result.status) {
            Swal.fire("Wallet updated!", result.message || "Money added successfully.");
            fetchWalletHistory(); // refresh history
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
      Swal.fire(
        "Withdraw Requested",
        `Account: ${formValues.account}<br>IFSC: ${formValues.ifsc}<br>Amount: ₹${formValues.amount}`,
        "success"
      );
    }
  };

  // Fetch Wallet History
  const fetchWalletHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = {
        client_id: "68c28a592059c3c6846682b4", // TODO: replace with dynamic client id
      };
      const result = await WalletHistory(token, data);
      if (result?.status) {
        setHistoryData(result.data || []);
      } else {
        Swal.fire("Error", result.message || "Failed to fetch history", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while fetching history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletHistory();
  }, []);

  // Filter history by view
  const getDisplayedHistory = () => {
    let data = [...historyData];

    if (historyView === "add") {
      data = data.filter((item) => item.type === "add");
    } else if (historyView === "withdraw") {
      data = data.filter((item) => item.type === "withdraw");
    } else if (historyView === "buysell") {
      data = data.filter((item) => item.type === "buysell");
    }

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-2 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-orange-500">Transaction History</h1>

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
                className="p-3 border rounded hover:bg-orange-50 transition flex justify-between"
              >
                <span>
                  {item.type === "withdraw" ? "-" : "+"} ₹{item.amount}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
            ))}
            {getDisplayedHistory().length === 0 && (
              <p className="text-gray-500">No transactions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
