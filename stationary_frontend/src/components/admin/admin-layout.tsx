'use client';

import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/sidebar';
import { AdminNavbar } from '../../components/admin/admin-navbar';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-300">
      {/* Sidebar - Full height, hidden on mobile */}
      <aside className="hidden lg:flex h-full flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Navigation */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
