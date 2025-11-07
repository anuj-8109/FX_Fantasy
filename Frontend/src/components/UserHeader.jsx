import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, Wallet, ArrowLeft } from "lucide-react";
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
    <header className="header text-white flex items-center justify-between px-4 py-3 shadow-lg bg-gradient-to-r from-[#001f3f] to-[#003f5c]">
      {/* Left Section - Back Button + Avatar + Name */}
      <div className="flex items-center space-x-3">

    


        {/* User Avatar */}
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

      {/* Right Section - Wallet + Notifications */}
      <div className="flex items-center space-x-3">
        {/* Wallet Button */}
        <button
          onClick={() => navigate("/wallet")}
          className="bg-black px-2 py-1 rounded-full flex items-center 
          text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          <Wallet size={16} className="mr-1" />
          ₹{walletBalance.toLocaleString("en-IN")}
        </button>

        {/* Notifications */}
        <button onClick={()=>{
          navigate("/alert")
        }}
        className="bg-black p-2 rounded-full text-white relative shadow-md hover:scale-110 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 animate-pulse">
            3
          </span>
          
        </button>
            {/* <button
          onClick={() => navigate(-1)}
          className="bg-orange-600 text-white text-xs rounded-full px-2"
          title="Go Back"
        >
          <i className="fa fa-angle-left text-white text-xl"></i>
        </button> */}
      </div>
    </header>
  );
};

export default UserHeader;
