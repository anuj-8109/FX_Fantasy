import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Home,
  Users,
  Award,
  UserCheck,
  RectangleHorizontal,
  FileText,
  Quote,
  Newspaper,
  BadgeHelp,
  TicketPercent,
  Settings2,
  Mail,
  Settings as SettingsIcon,
  MessageSquare,
  MessageCircle,
  User,
  ChevronRight,
  ChevronDown,
  Banknote ,
  LifeBuoy,
  Trophy 
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/superadmin/dashboard",
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
    title: "Clients",
    url: "/superadmin/clients",
    icon: <User />,
  },
  {
    title: "Tournament",
    url: "/superadmin/tournament",
    icon: <Trophy />,
  },
  {
    title: "Contest",
    url: "/superadmin/contest",
    icon: <Award />,
  },
  {
    title: "Banner",
    url: "/superadmin/banner",
    icon: <RectangleHorizontal />,
  },
  {
    title: "Content",
    url: "/superadmin/content",
    icon: <FileText />,
  },
  {
    title: "Blog",
    url: "/superadmin/blog",
    icon: <Quote />,
  },
  {
    title: "News",
    url: "/superadmin/news",
    icon: <Newspaper />,
  },
  {
    title: "Withdrawal ",
    url: "/superadmin/withdrawal",
    icon: <Banknote />,
  },
  {
    title: "HelpDesk",
    url: "/superadmin/help",
    icon: <LifeBuoy />,
  },
  {
    title: "FAQs",
    url: "/superadmin/faqs",
    icon: <BadgeHelp />,
  },
  {
    title: "Coupons",
    url: "/superadmin/coupons",
    icon: <TicketPercent />,
  },
  {
    title: "Basic Settings",
    icon: <Settings2 />,
    children: [
      {
        title: "Email Templates",
        url: "/superadmin/email-templates",
        icon: <Mail />,
      },
      {
        title: "General Settings",
        url: "/superadmin/general-settings",
        icon: <SettingsIcon />,
      },
      {
        title: "SMS Provider",
        url: "/superadmin/sms-providers",
        icon: <MessageSquare />,
      },
      {
        title: "SMS Templates",
        url: "/superadmin/sms-templates",
        icon: <MessageCircle />,
      },
    ],
  },
];

const SuperAdminSidebar = ({ collapsed }) => {
  const location = useLocation();


  const [openMenus, setOpenMenus] = useState(() => {
    const initial = {};
    menuItems.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) =>
          location.pathname.startsWith(child.url)
        )
      ) {
        initial[item.title] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"}
        fixed top-16 left-0 h-[calc(100vh-64px)] 
        overflow-y-auto hide-scrollbar 
        transition-all z-40`}
    >
      <div className="flex flex-col h-full mt-2  p-1">
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isChildActive =
              item.children &&
              item.children.some((child) =>
                location.pathname.startsWith(child.url)
              );

            return (
              <div key={item.title}>
                {item.children ? (
                  <div
                    onClick={() => toggleMenu(item.title)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${isChildActive
                      ? "bg-blue-400 "
                      : "hover:bg-blue-400"
                      }`}
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
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${isActive
                        ? "bg-blue-400 "
                        : "text-white-700"
                      }`
                    }
                    title={collapsed ? item.title : ""}
                  >
                    <span>{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                )}

                {/* Submenu */}
                {item.children && openMenus[item.title] && (
                  <div className={`${collapsed ? "ml-0" : "ml-8"} mt-1 space-y-1 anuj`}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.title}
                        to={child.url}
                        className={({ isActive }) =>
                          `flex items-center gap-5 text-sm px-3 py-1 rounded-md transition-colors duration-200 ${isActive ? "bg-blue-400 text-blue-100" : "text-white-400"
                          }`
                        }
                      >
                        <span>{child.icon}</span>
                        <span>{child.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
