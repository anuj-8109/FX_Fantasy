import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getNotification,
  changeNotificationStatus,
} from "../../services/SuperAdmin";

const SuperAdminHeader = ({ collapsed, setCollapsed }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const notifRef = useRef();
  const profileRef = useRef();

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await getNotification();
      if (res.status) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // ✅ Mark notification as read
  const handleReadNotification = async (id) => {
    try {
      await changeNotificationStatus(id, 1);
      fetchNotifications(); // refresh list
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  // ✅ Toggle dropdown
  const handleNotificationToggle = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Theme toggle
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
    if (roleId === "1") {
      navigate("/superadminlogin");
    } else {
      navigate("/");
    }
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  // ✅ SweetAlert logout
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
      navigate("/superadminlogin");
    }
  };

  // ✅ Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowProfile(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm backdrop-blur-lg transition-colors Main-Header">
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

        {/* Right Side */}
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
              onClick={handleNotificationToggle}
              className="p-2 rounded-full relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 shadow-lg rounded-lg border z-50 bg-white dark:bg-gray-800">
                <div className="p-3 font-medium text-sm border-b dark:border-gray-700">
                  Notifications ({unreadCount} new)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleReadNotification(n._id)}
                        className={`p-3 border-b text-sm cursor-pointer transition ${
                          n.status === 0
                            ? "font-medium bg-blue-50"
                            : "bg-transparent"
                        }`}
                      >
                        <p>{n.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No notifications found
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate("/superadmin/notifications")}
                  className="w-full text-center py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
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
              <div className="absolute right-0 mt-2 w-56 shadow-lg rounded-lg border z-50 bg-white dark:bg-gray-800">
                <div className="p-3 border-b text-sm dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.FullName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.Email}</p>
                </div>

                <button
                  onClick={() => navigate("/superadmin/myprofile")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Profile Management
                </button>

                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
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
