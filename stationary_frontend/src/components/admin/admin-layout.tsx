'use client';

import type { ReactNode } from 'react';
import { AdminSidebar } from '../../components/admin/sidebar';
import { AdminNavbar } from '../../components/admin/admin-navbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
          {/* Top Navigation */}
          <AdminNavbar />

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
