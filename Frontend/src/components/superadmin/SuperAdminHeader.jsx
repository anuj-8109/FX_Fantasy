import React, { useState } from "react";

const SuperAdminHeader = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const adminUser = {
    name: "Shakti Kumar",
    email: "shakti@example.com",
    role: "super-admin",
  };

  const notifications = [
    { id: 1, title: "New user registered", message: "John Doe just joined", time: "2 min ago", unread: true },
    { id: 2, title: "Contest finished", message: "Weekly Trading Challenge ended", time: "1 hour ago", unread: true },
    { id: 3, title: "System maintenance", message: "Scheduled maintenance done", time: "3 hours ago", unread: false },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-gray-500">Theme: {isDarkMode ? "Dark" : "Light"}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Toggle theme"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>

          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
            {notifications.filter((n) => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notifications.filter((n) => n.unread).length}
              </span>
            )}
            {/* Dropdown */}
            <div className="absolute hidden group-hover:block right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border">
              <div className="p-3 font-medium text-sm border-b">
                Notifications ({notifications.filter((n) => n.unread).length} new)
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b text-sm ${n.unread ? "bg-gray-50 font-medium" : ""}`}
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
          </div>

          {/* Profile */}
          <div className="relative group">
            <button className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {adminUser.name.split(" ").map((n) => n[0]).join("")}
            </button>
            {/* Dropdown */}
            <div className="absolute hidden group-hover:block right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border">
              <div className="p-3 border-b text-sm">
                <p className="font-medium">{adminUser.name}</p>
                <p className="text-xs text-gray-500">{adminUser.email}</p>
                <p className="text-xs capitalize text-gray-400">{adminUser.role}</p>
              </div>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Profile Settings</button>
              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Account Settings</button>
              <hr />
              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
