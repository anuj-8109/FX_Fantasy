import React, { useState } from "react";
import { PlusCircle, ArrowUp, Clock } from "lucide-react";
import Swal from "sweetalert2";

const WalletPage = () => {
  const [activeSection, setActiveSection] = useState(""); 
  const [historyView, setHistoryView] = useState("all"); 

  const [addHistory] = useState([
    { id: 1, amount: 500, date: "2025-09-10 12:30 PM" },
    { id: 2, amount: 1000, date: "2025-09-09 03:20 PM" },
  ]);

  const [withdrawHistory] = useState([
    { id: 1, amount: 200, date: "2025-09-11 09:10 AM" },
    { id: 2, amount: 300, date: "2025-09-08 05:45 PM" },
  ]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      Swal.fire("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_22mEHcDzJbcUmz",
      amount: 50000,
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

  return (
    <div className="p-6 max-w-3xl mx-auto mt-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-orange-500">Wallet</h1>

      {/* Add Money Section */}
      <div className="border p-4 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle size={24} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-600">Add Money</h2>
        </div>
        <button
          onClick={() =>
            setActiveSection(activeSection === "add" ? "" : "add")
          }
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          {activeSection === "add" ? "Close" : "Open"}
        </button>

        {activeSection === "add" && (
          <div className="mt-3">
            <button
              onClick={handlePayment}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Proceed to Pay
            </button>
          </div>
        )}
      </div>

      {/* Withdraw Section */}
      <div className="border p-4 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUp size={24} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-600">Withdraw</h2>
        </div>
        <button
          onClick={() =>
            setActiveSection(activeSection === "withdraw" ? "" : "withdraw")
          }
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          {activeSection === "withdraw" ? "Close" : "Open"}
        </button>

        {activeSection === "withdraw" && (
          <form className="mt-3 space-y-3">
            <input
              type="text"
              placeholder="Account Number"
              className="w-full p-2 text-sm border rounded"
            />
            <input
              type="text"
              placeholder="IFSC Code"
              className="w-full p-2 text-sm border rounded"
            />
            <input
              type="text"
              placeholder="Amount"
              className="w-full p-2 text-sm border rounded"
            />
            <button
              type="submit"
              className="w-full p-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="border p-4 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} className="text-orange-600" />
          <h2 className="text-lg font-semibold text-orange-600">Transaction History</h2>
        </div>

        {/* Dropdown Buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "add", "withdraw"].map((type) => (
            <button
              key={type}
              onClick={() => setHistoryView(type)}
              className={`px-3 py-1 text-sm rounded ${
                historyView === type
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "add"
                ? "Add"
                : "Withdraw"}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {(historyView === "all"
            ? [...addHistory, ...withdrawHistory].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              )
            : historyView === "add"
            ? addHistory
            : withdrawHistory
          ).map((item) => (
            <div
              key={item.id + historyView}
              className="p-3 border rounded hover:bg-orange-50 transition"
            >
              <p className="text-sm">
                Amount: ₹{item.amount}{" "}
                <span className="text-xs text-gray-500">({item.date})</span>
              </p>
            </div>
          ))}
          {(historyView === "all"
            ? [...addHistory, ...withdrawHistory]
            : historyView === "add"
            ? addHistory
            : withdrawHistory
          ).length === 0 && (
            <p className="text-gray-500 text-sm">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
