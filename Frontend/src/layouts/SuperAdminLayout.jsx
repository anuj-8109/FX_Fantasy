import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import { SidebarProvider } from "../components/ui/sidebar";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";

const SuperAdminLayout = () => {
  return (
    <>
      <SidebarProvider>
        <div>
          <SuperAdminSidebar />
          <div>
            <SuperAdminHeader />
            <main>
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default SuperAdminLayout;
