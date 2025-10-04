import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Wallet } from "lucide-react";
import { GetUserDetails } from "../services/User";

const UserHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails(token, userId);
        if (res?.status) {
          const data = res.data;
          setWalletBalance(data?.wamount || 0);
          setUserDetails(data);
          localStorage.setItem("walletBalance", data?.wamount || 0);
        }
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    fetchUser();
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
    <header className="header
 text-white flex items-center justify-between px-4 py-3 shadow-lg">
      
      {/* Left Section - Avatar + Name */}
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden transform hover:scale-110 transition duration-300 shadow-md">
          <img
            src={
              userDetails?.image
                ? userDetails.image
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="profile"
            className="w-11 h-11 object-cover"
          />
        </div>
        <h1 className="text-lg font-semibold drop-shadow-md">
          {userDetails?.FullName || "User"}
        </h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        {/* <button
          onClick={toggleTheme}
          className="bg-[#053e53] p-2 rounded-full text-white-500 hover:bg-gray-100 
          transition-transform duration-500 transform hover:rotate-180 shadow-md"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button> */}

        {/* Wallet Button */}
        <button
          onClick={() => navigate("/wallet")}
          className="bg-[#053e53] px-3 py-2 rounded-full flex items-center 
          text-white-500 font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          <Wallet size={18} className="mr-1" />
          ₹{walletBalance.toLocaleString("en-IN")}
        </button>

        {/* Notifications */}
        <button className="bg-[#053e53] p-2 rounded-full text-white-500 hover:bg-gray-100 relative shadow-md">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
