import React, { useState, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SuperAdminHeader from "../components/superadmin/Header";
import UserMenu from "../components/UserMenu";
import UserHeader from "../components/UserHeader";

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    const html = document.documentElement;
    if (location.pathname.startsWith("/user")) {
      html.classList.add("Usertheme");
      html.classList.remove("theme-staff-pro", "theme-trading-pro");
    } else if (location.pathname.startsWith("/staff")) {
      html.classList.add("theme-staff-pro");
      html.classList.remove("Usertheme", "theme-trading-pro");
    } else {
      html.classList.remove("Usertheme", "theme-trading-pro", "theme-staff-pro");
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen items-center Anuj333">

      <div className="w-full max-w-4xl">

        <header className="fixed top-0  left-1/2 -translate-x-1/2 w-full max-w-4xl h-16 z-50 shadow bg-white">
          <UserHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        </header>


        <main className="pt-20 pb-16  flex justify-center ">
          <div className="w-full max-w-5xl px-6  ">
            <Outlet />
          </div>
        </main>


        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 bg-white shadow">
          <UserMenu />
        </footer>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
