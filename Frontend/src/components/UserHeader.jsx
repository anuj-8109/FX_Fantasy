import React, { useState } from "react";
import { Sun, Moon, Bell, Wallet } from "lucide-react";

const UserHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);


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
    <header className="bg-blue-500 text-white flex items-center justify-between px-6 py-4 shadow-md">
      
      <div className="flex items-center space-x-3">
        
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
        {/* Title */}
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

        
        <button className="bg-white px-3 py-2 rounded-full flex items-center text-orange-500 font-medium hover:bg-gray-100">
          <Wallet size={18} className="mr-1" />
          ₹20,140
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
