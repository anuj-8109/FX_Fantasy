import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Wallet } from "lucide-react";
import { GetUserDetails } from "../services/User"; // <- API function import

const UserHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await GetUserDetails(token, userId);
        if (res?.status) {
          const balance = res.data?.wamount || 0;
          setWalletBalance(balance);
          localStorage.setItem("walletBalance", balance); // localStorage update
        }
      } catch (err) {
        console.error("Wallet fetch error", err);
      }
    };

    fetchWallet();

    // हर 10 सेकंड में balance refresh
    // const interval = setInterval(fetchWallet, 10000);
    // return () => clearInterval(interval);
  }, [token, userId]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.remove(
        newMode ? "theme-trading-light" : "theme-trading-pro"
      );
      document.documentElement.classList.add(
        newMode ? "theme-trading-pro" : "theme-trading-light"
      );
      return newMode;
    });
  };

  return (
    <header className="bg-orange-500 text-white flex items-center justify-between px-4 py-2 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
        <h1 className="text-lg font-semibold">Dream Trading</h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="bg-white p-2 rounded-full text-orange-500 hover:bg-gray-100"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => navigate("/wallet")}
          className="bg-white px-3 py-2 rounded-full flex items-center text-orange-500 font-medium hover:bg-gray-100"
        >
          <Wallet size={18} className="mr-1" />
          ₹{walletBalance.toLocaleString("en-IN")}
        </button>

        <button className="bg-white p-2 rounded-full text-orange-500 hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
