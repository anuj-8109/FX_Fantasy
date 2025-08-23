import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";

const SuperAdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperAdminHeader />

      <div className="flex flex-1">
        <div className="w-64 bg-white shadow-lg sticky top-0 h-screen overflow-y-auto">
          <SuperAdminSidebar />
        </div>

        <main className="flex-1  bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
