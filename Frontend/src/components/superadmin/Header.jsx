import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const SuperAdminHeader = ({ collapsed, setCollapsed }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const notifRef = useRef();
  const profileRef = useRef();

  const notifications = [
    { id: 1, title: "New user registered", message: "John Doe just joined", time: "2 min ago", unread: true },
    { id: 2, title: "Contest finished", message: "Weekly Trading Challenge ended", time: "1 hour ago", unread: true },
    { id: 3, title: "System maintenance", message: "Scheduled maintenance done", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Theme Toggle
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

    const handleLogout = () => {
    const roleId = localStorage.getItem("roleId");
    localStorage.removeItem("token");
    localStorage.removeItem("roleId");
    // localStorage.removeItem("user");
    // localStorage.removeItem("isLoggedIn");
    if (roleId === "1") {
      navigate("/SuperAdminLogin");      
    } else {
      navigate("/");  
    }
  };

  const toggleSidebar = () => setCollapsed(!collapsed);
  const Logout = async () => {
    const confirm = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb", 
      cancelButtonColor: "#6b7280", 
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
        customClass: {
          popup: "custom-swal-popup",
          title: "text-lg font-medium text-gray-800",
          htmlContainer: "text-gray-600",
        },
      });
      navigate("/SuperAdminLogin");
    }

  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-lg transition-colors Main-Header ">

      <div className="max-w-8xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <div
            className="cursor-pointer flex items-center gap-3"
            onClick={() => navigate("/superadmin/dashboard")}
          >
            <img src="/images/logo.png" alt="FX Fantasy" className="h-20 w-24" />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Right Side: Theme, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full  relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80  shadow-lg rounded-lg border z-50 Notification_dropdown">
                <div className="p-3 font-medium text-sm border-b ">
                  Notifications ({unreadCount} new)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b  text-sm ${n.unread ? "font-medium" : ""
                        }`}
                    >
                      <p>{n.title}</p>
                      <p className="text-xs ">{n.message}</p>
                      <p className="text-xs ">{n.time}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full text-center py-2 text-xs">
                  View all
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              {user?.FullName?.split(" ")
                .map((n) => n[0])
                .join("")}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 shadow-lg rounded-lg border z-50 profile_dropdown">
                <div className="p-3 border-b  text-sm">
                  <p className="font-medium">{user?.FullName}</p>
                  <p className="text-xs text-white-500">{user?.Email}</p>
                </div>

                <button
                  onClick={() => navigate("/superadmin/myprofile")}
                  className="block w-full text-left px-4 py-2 text-sm "
                >
                  Profile Management
                </button>

                {/* <button
                  onClick={() => navigate("/superadmin/changepassword")}
                  className="block w-full text-left px-4 py-2 text-sm "
                >
                  Reset Password
                </button> */}

                <button
                  className="block w-full text-left px-4 py-2 text-sm text-white-600 "
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
