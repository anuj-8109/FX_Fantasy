import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/Header";
import SuperAdminSidebar from "../components/superadmin/Sidebar";
import UserMenu from "../components/UserMenu";

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <div
        className={`fixed top-16 z-50 left-0 h-[calc(100vh-64px)] ${collapsed ? "w-20" : "w-64"
          }`}
      >
        <SuperAdminSidebar collapsed={collapsed} />
      </div>


      <div className={`flex-1 ${collapsed ? "ml-20" : "ml-64"}`}>

        <div className="fixed top-0 left-0 right-0 h-16 z-50 shadow">
          <SuperAdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>


        <main
          className={`fixed top-16 right-0 p-4 overflow-y-auto transition-all duration-300
    ${collapsed ? "w-[calc(100%-5rem)]" : "w-[calc(100%-16rem)]"}
    h-[calc(100vh-64px)]`}
        >
          <Outlet />
        </main>
        <UserMenu />

      </div>
    </div>
  );
};

export default SuperAdminLayout;
