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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex h-screen">
        {/* Sidebar - Full height */}
        <div className="hidden lg:block h-full">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navigation */}
          <AdminNavbar />

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-900">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
