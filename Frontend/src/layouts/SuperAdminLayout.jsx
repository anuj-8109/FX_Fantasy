import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";

const SuperAdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header always at top */}
      <SuperAdminHeader />

      {/* Below header: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar (fixed width) */}
        <div className="w-64 bg-white shadow-lg">
          <SuperAdminSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1  bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
