import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import AdminHeader from '@/components/AdminHeader.jsx';
import AdminDashboard from '@/components/AdminDashboard.jsx';

const Index = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-auto">
              <AdminDashboard />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Index;
