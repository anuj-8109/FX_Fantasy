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
  Settings,
} from "lucide-react";

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

const SuperAdminSidebar = ({ collapsed }) => {
  return (
    <aside
      className={`bg-white border-r shadow-lg min-h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col p-4 h-full">
        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              title={collapsed ? item.title : ""}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
