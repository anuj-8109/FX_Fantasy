import React from "react";
import { Route } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import SuperAdminDashboard from "../pages/superadmin/SuperAdminDashboard";
import SuperAdminHeader from "../components/superadmin/SuperAdminHeader";
import SuperAdminSidebar from "../components/superadmin/SuperAdminSidebar";
import Analytics from "../pages/superadmin/Analytics";
import Contests from "../pages/superadmin/Contests";
import Games from "../pages/superadmin/Games";
import Security from "../pages/superadmin/Security";
import Settings from "../pages/superadmin/Settings";
import Trading from "../pages/superadmin/Trading";
import Users from "../pages/superadmin/Users";
import Wallet from "../pages/superadmin/Wallet";

const SuperAdminRoutes = () => {
  return (
    <>
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route path="superadmindashboard" element={<SuperAdminDashboard />} />
        <Route path="superadminheader" element={<SuperAdminHeader />} />
        <Route path="superadminsidebar" element={<SuperAdminSidebar />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="contest" element={<Contests />} />
        <Route path="games" element={<Games />} />
        <Route path="security" element={<Security />} />
        <Route path="settings" element={<Settings />} />
        <Route path="trading" element={<Trading />} />
        <Route path="user" element={<Users />} />
        <Route path="wallet" element={<Wallet />} />
      </Route>
    </>
  );
};

export default SuperAdminRoutes;
