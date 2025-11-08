import React, { useState, useEffect } from "react";
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
  Banknote,
  LifeBuoy,
  Trophy,
  Share2,
  CreditCard,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/superadmin/dashboard",
    icon: <Home />,
    slug: "dashboard", // permission key
  },
  {
    title: "Employee",
    url: "/superadmin/alluser",
    icon: <Users />,
    slug: "alluser",
  },
  {
    title: "Clients",
    url: "/superadmin/clients",
    icon: <User />,
    slug: "clients",
  },
  {
    title: "Tournament",
    url: "/superadmin/tournament",
    icon: <Trophy />,
    slug: "tournament",
  },
  {
    title: "Contest",
    url: "/superadmin/contest",
    icon: <Award />,
    slug: "contest",
  },
  {
    title: "Banner",
    url: "/superadmin/banner",
    icon: <RectangleHorizontal />,
    slug: "banner",
  },
  {
    title: "Content",
    url: "/superadmin/content",
    icon: <FileText />,
    slug: "content",
  },
  {
    title: "Blog",
    url: "/superadmin/blog",
    icon: <Quote />,
    slug: "blog",
  },
  {
    title: "News",
    url: "/superadmin/news",
    icon: <Newspaper />,
    slug: "news",
  },
  {
    title: "Coupons",
    url: "/superadmin/coupons",
    icon: <TicketPercent />,
    slug: "coupons",
  },
  {
    title: "FAQs",
    url: "/superadmin/faqs",
    icon: <BadgeHelp />,
    slug: "faqs",
  },

  {
    title: "Withdrawal",
    url: "/superadmin/withdrawal",
    icon: <Banknote />,
    slug: "withdrawal",
  },
  {
    title: "HelpDesk",
    url: "/superadmin/help",
    icon: <LifeBuoy />,
    slug: "help",
  },

  {
    title: "Basic Settings",
    icon: <Settings2 />,
    slug: "basic_settings",
    children: [
      {
        title: "Email Templates",
        url: "/superadmin/email-templates",
        icon: <Mail />,
        slug: "email_templates",
      },
      {
        title: "General Settings",
        url: "/superadmin/general-settings",
        icon: <SettingsIcon />,
        slug: "general_settings",
      },
      {
        title: "SMS Provider",
        url: "/superadmin/sms-providers",
        icon: <MessageSquare />,
        slug: "sms_providers",
      },
      {
        title: "SMS Templates",
        url: "/superadmin/sms-templates",
        icon: <MessageCircle />,
        slug: "sms_templates",
      },
      {
        title: "KYC Information",
        url: "/superadmin/kycinformation",
        icon: <CreditCard />,
        slug: "kycinformation",
      },
      {
        title: "Refer & Earn",
        url: "/superadmin/referearn",
        icon: <Share2 />,
        slug: "referearn",
      },
    ],
  },
];

const SuperAdminSidebar = ({ collapsed }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [filteredMenu, setFilteredMenu] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem("roleId");
    const storedPermissions =
      JSON.parse(localStorage.getItem("permissions")) || [];

    // Agar role 2 hai → permission ke basis par filter kare
    if (storedRole === "2") {
      const filtered = menuItems
        .map((item) => {
          if (item.children) {
            const allowedChildren = item.children.filter((child) =>
              storedPermissions.includes(child.slug)
            );
            if (
              allowedChildren.length > 0 &&
              storedPermissions.includes(item.slug)
            ) {
              return { ...item, children: allowedChildren };
            } else if (allowedChildren.length > 0) {
              return { ...item, children: allowedChildren };
            }
            return null;
          } else {
            return storedPermissions.includes(item.slug) ? item : null;
          }
        })
        .filter(Boolean);
      setFilteredMenu(filtered);
    } else {
      // Role 1 ya koi aur ho to full menu
      setFilteredMenu(menuItems);
    }
  }, []);

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
      <div className="flex flex-col h-full mt-2 p-1">
        <nav className="flex-1 space-y-2">
          {filteredMenu.map((item) => {
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isChildActive ? "bg-blue-400" : "hover:bg-blue-400"
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
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive ? "bg-blue-400" : "hover:bg-blue-400"
                      }`
                    }
                    title={collapsed ? item.title : ""}
                  >
                    <span>{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                )}

                {item.children && openMenus[item.title] && (
                  <div
                    className={`${collapsed ? "ml-0" : "ml-8"} mt-1 space-y-1`}
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.title}
                        to={child.url}
                        className={({ isActive }) =>
                          `flex items-center gap-5 text-sm px-3 py-1 rounded-md transition-colors ${
                            isActive ? "bg-blue-400" : "hover:bg-blue-400"
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
