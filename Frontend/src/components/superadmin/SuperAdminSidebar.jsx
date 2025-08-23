import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  BarChart2,
  Award,
  Activity,
  Gamepad,
  CreditCard,
  Shield,
  Settings
} from "lucide-react";

const SuperAdminSidebar = () => {
  const menuItems = [
  { title: "Dashboard", url: "/superadmin/superadmindashboard", icon: <Home /> },
  { title: "User Management", url: "/superadmin/user", icon: <Users /> },
  { title: "Game Analytics", url: "/superadmin/analytics", icon: <BarChart2 /> },
  { title: "Trading Contests", url: "/superadmin/contest", icon: <Award /> },
  { title: "Live Trading", url: "/superadmin/trading", icon: <Activity /> },
  { title: "Game Settings", url: "/superadmin/games", icon: <Gamepad /> },
  { title: "Wallet System", url: "/superadmin/wallet", icon: <CreditCard /> },
  { title: "Security", url: "/superadmin/security", icon: <Shield /> },
  { title: "Settings", url: "/superadmin/settings", icon: <Settings /> },
];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen border-r p-4">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
       Super Admin
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
