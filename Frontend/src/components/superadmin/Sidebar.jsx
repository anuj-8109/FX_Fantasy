import React, { useState } from "react";
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
  ChevronRight,
  ChevronDown,
  UserCheck,
  Settings2,
  Mail,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/superadmin/superadmindashboard",
    icon: <Home />,
  },
  {
    title: "User Management",
    icon: <Users />,
    children: [
      { title: "All Users", url: "/superadmin/alluser", icon: <Users /> },
      {
        title: "Active Users",
        url: "/superadmin/activeuser",
        icon: <UserCheck />,
      },
    ],
  },
  {
    title:"Basic Settings",
    url: "/superadmin/basicsettings",
    icon: <Settings2 />,
    children: [
      { title:"Email Templates", url: "/superadmin/email-templates", icon: <Mail /> },
     
    ],
  },
  {
    title: "Game Analytics",
    url: "/superadmin/analytics",
    icon: <BarChart2 />,
  },
  { title: "Trading Contests", url: "/superadmin/contest", icon: <Award /> },
  { title: "Live Trading", url: "/superadmin/trading", icon: <Activity /> },
  { title: "Game Settings", url: "/superadmin/games", icon: <Gamepad /> },
  { title: "Wallet System", url: "/superadmin/wallet", icon: <CreditCard /> },
  { title: "Security", url: "/superadmin/security", icon: <Shield /> },
  { title: "Settings", url: "/superadmin/settings", icon: <Settings /> },
];

const SuperAdminSidebar = ({ collapsed }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={`bg-white border-r shadow-lg min-h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col p-4 h-full">
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {/* Parent Item */}
              {item.children ? (
                <div
                  onClick={() => toggleMenu(item.title)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-100"
                  title={collapsed ? item.title : ""}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                  {!collapsed &&
                    (openMenus[item.title] ? (
                      <ChevronDown />
                    ) : (
                      <ChevronRight />
                    ))}
                </div>
              ) : (
                <NavLink
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
              )}

              {/* Submenu */}
              {item.children && openMenus[item.title] && !collapsed && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.title}
                      to={child.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 text-sm px-3 py-1 rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                    >
                      {/* 👇 child icon */}
                      <span>{child.icon}</span>
                      <span>{child.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
