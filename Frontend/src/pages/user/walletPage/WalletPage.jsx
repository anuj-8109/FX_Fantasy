import React, { useState } from "react";
import { PlusCircle, ArrowUp, Clock, Gift, Lock } from "lucide-react";
import Swal from "sweetalert2";

const WalletPage = () => {
  const tabs = [
    { id: "add", title: "Add Money", icon: <PlusCircle size={20} /> },
    { id: "withdraw", title: "Withdraw", icon: <ArrowUp size={20} /> },
    { id: "history", title: "Transaction History", icon: <Clock size={20} /> },
    { id: "offers", title: "Offers & Rewards", icon: <Gift size={20} /> },
    { id: "security", title: "Security Settings", icon: <Lock size={20} /> },
  ];

  const [activeTab, setActiveTab] = useState("add");


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

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add Money</h2>
            <p className="mb-4">Choose a payment method to add funds to your wallet.</p>
            <div className="space-y-3">
              <button 
                onClick={handlePayment}
                className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Click To Add Money
              </button>
              {/* <button 
                onClick={handlePayment}
                className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Debit / Credit Card
              </button>
              <button className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                Wallet Transfer
              </button> */}
            </div>
          </div>
        );
      case "withdraw":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Withdraw</h2>
            <p className="mb-4">Enter your bank details to withdraw funds.</p>
            <form className="space-y-4">
              <input type="text" placeholder="Account Number" className="w-full p-3 border rounded" />
              <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded" />
              <input type="text" placeholder="Amount" className="w-full p-3 border rounded" />
              <button type="submit" className="w-full p-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                Submit
              </button>
            </form>
          </div>
        );
      case "history":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <p>No transactions yet.</p>
          </div>
        );
      case "offers":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Offers & Rewards</h2>
            <p>Check out our latest offers and reward schemes!</p>
          </div>
        );
      case "security":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <p>Update your password or enable 2FA for more security.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">Wallet</h1>

      <div className="flex border-b border-orange-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent hover:text-orange-500"
            } transition`}
          >
            {tab.icon}
            {tab.title}
          </button>
        ))}
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default WalletPage;
