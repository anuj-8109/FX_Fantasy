import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, User } from "lucide-react";
import Swal from "sweetalert2";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "custom-swal-popup",
        title: "text-xl font-semibold text-gray-800",
        htmlContainer: "text-gray-600 text-base",
        confirmButton:
          "px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-5 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });

    if (confirm.isConfirmed) {
      localStorage.clear();
      await Swal.fire({
        title: "✅ Logged Out",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 
      footer 
     shadow-lg backdrop-blur-md z-50 rounded-t-2xl">
      
      <div className="flex justify-around items-center h-16">
        
        {/* Home */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={() => navigate("/search")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        {/* Alerts */}
        <button
          onClick={() => navigate("/alert")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex flex-col items-center hover:scale-110 transition"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center justify-center text-xs shadow-md">
              {user?.FullName?.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-xs">Profile</span>
          </button>

          {showProfile && (
            <div className="absolute bottom-16 right-0 w-60 shadow-xl rounded-xl border bg-white text-gray-800 z-50 animate-slide-up">
              {/* User Info */}
              <div className="p-3 border-b text-sm">
                <p className="font-medium">{user?.FullName}</p>
                <p className="text-xs text-gray-500">{user?.Email}</p>
              </div>

              {/* Menu Links */}
              {[
                ["Profile Management", "/profile"],
                ["Help Desk", "/helpdesk"],
                ["Coupons", "/coupon"],
                ["FAQ", "/faq"],
                ["Blog", "/blog"],
                ["Content", "/content"],
                ["Contest Tracking", "/contesttracking"],
              ].map(([label, path]) => (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setShowProfile(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                >
                  {label}
                </button>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
