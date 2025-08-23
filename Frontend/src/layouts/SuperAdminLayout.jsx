import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
   <div className="flex flex-col min-h-screen">
  {/* Header at top */}
  <SuperAdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

  {/* Below header: sidebar + content */}
  <div className="flex flex-1">
    <SuperAdminSidebar collapsed={collapsed} />
    <main className="flex-1 ">
      <Outlet />
    </main>
  </div>
</div>

  );
};

export default SuperAdminLayout;
