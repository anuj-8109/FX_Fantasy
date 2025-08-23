import React from "react";
import { NavLink } from "react-router-dom";

const SuperAdminSidebar = () => {
  const menuItems = [
    { title: "Dashboard", url: "/", icon: "📊" },
    { title: "User Management", url: "/users", icon: "👥" },
    { title: "Game Analytics", url: "/analytics", icon: "📈" },
    { title: "Trading Contests", url: "/contests", icon: "🏆" },
    { title: "Live Trading", url: "/trading", icon: "💹" },
    { title: "Game Settings", url: "/games", icon: "🎮" },
    { title: "Wallet System", url: "/wallet", icon: "💰" },
    { title: "Security", url: "/security", icon: "🛡️" },
    { title: "Settings", url: "/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen border-r p-4">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        ⚡ Super Admin
      </h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SuperAdminSidebar;
