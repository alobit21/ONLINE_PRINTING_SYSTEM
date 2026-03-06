'use client';

import { AdminSidebar } from '../../../components/admin/sidebar-simple';

export default function TestAdminPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-4">Test Admin Page</h1>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <p className="text-gray-300">
                  If you can see the sidebar on the left with 7 menu items (Dashboard, Users, Shops, Orders, Documents, Pricing, Settings), 
                  then the sidebar is working correctly.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-green-400">✅ Check left sidebar for menu items</p>
                  <p className="text-blue-400">🔍 Current path: {window.location.pathname}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
