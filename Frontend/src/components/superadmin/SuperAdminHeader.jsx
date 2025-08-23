import React, { useState } from "react";
import { Sun, Moon, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuperAdminHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const adminUser = {
    name: "Shakti Kumar",
    email: "shakti@example.com",
    role: "super-admin",
  };

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "John Doe just joined",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Contest finished",
      message: "Weekly Trading Challenge ended",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System maintenance",
      message: "Scheduled maintenance done",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/superadmin/superadmindashboard")}
        >
          {/* <img src="/images/logo.png" alt="FX Fantasy" className="w-8 h-8" />{" "} */}
          {/* apna logo yaha */}
          <div>
            <h1 className="font-bold text-lg">FX Fantasy</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
                <div className="p-3 font-medium text-sm border-b">
                  Notifications ({unreadCount} new)
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b text-sm ${
                        n.unread ? "bg-gray-50 font-medium" : ""
                      }`}
                    >
                      <p>{n.title}</p>
                      <p className="text-xs text-gray-500">{n.message}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full text-center py-2 text-xs hover:bg-gray-100">
                  View all
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              {adminUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border z-50">
                <div className="p-3 border-b text-sm">
                  <p className="font-medium">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
                <button
                  onClick={() => navigate("/superadmin/profile")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile Management
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
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
