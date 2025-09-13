import React, { useState } from "react";
import { PlusCircle, ArrowUp, Clock } from "lucide-react";
import Swal from "sweetalert2";

const WalletPage = () => {
  const [historyView, setHistoryView] = useState("all"); // all | add | withdraw | buysell
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addHistory = [
    { id: 1, amount: 500, date: "2025-09-10 12:30 PM" },
    { id: 2, amount: 1000, date: "2025-09-09 03:20 PM" },
  ];

  const withdrawHistory = [
    { id: 1, amount: 200, date: "2025-09-11 09:10 AM" },
    { id: 2, amount: 300, date: "2025-09-08 05:45 PM" },
  ];

  const buySellHistory = [
    { id: 1, amount: 1500, date: "2025-09-07 02:00 PM" },
    { id: 2, amount: 800, date: "2025-09-06 11:30 AM" },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
      handlePayment(amount);
    }
  };

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

  const getDisplayedHistory = () => {
    let data = [];
    if (historyView === "all") {
      data = [...addHistory, ...withdrawHistory, ...buySellHistory];
    } else if (historyView === "add") {
      data = addHistory;
    } else if (historyView === "withdraw") {
      data = withdrawHistory;
    } else if (historyView === "buysell") {
      data = buySellHistory;
    }
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-2 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-orange-500">Transaction History</h1>

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

        {/* Transaction Dropdown */}
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

      {/* Transaction History */}
      <div className="border p-4 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-600">Transaction History</h2>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {getDisplayedHistory().map((item, idx) => (
            <div
              key={item.id + idx}
              className="p-3 border rounded hover:bg-orange-50 transition flex justify-between"
            >
              <span>₹{item.amount}</span>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
          ))}
          {getDisplayedHistory().length === 0 && (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
