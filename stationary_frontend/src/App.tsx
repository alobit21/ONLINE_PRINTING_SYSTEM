import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './lib/apollo/client';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { ShopDashboard } from './pages/dashboard/ShopDashboard';
import { useAuthStore } from './stores/authStore';
import { DashboardLayout } from './layouts/DashboardLayout';
import AdminLayout from './components/admin/admin-layout';
import { GuestWorkflowManager } from './features/customer/guest/GuestWorkflowManager';
import { GuestOrdersPage } from './features/customer/guest/GuestOrdersPage';
import { GuestLayout } from './layouts/GuestLayout';
import { ThemeToggle } from './components/ui/ThemeToggle';

import { LandingPage } from './pages/landing/LandingPage';

// Import admin pages
import AdminDashboardPage from './pages/admin/dashboard/page';
import AdminUsersPage from './pages/admin/users/page';
import AdminShopsPage from './pages/admin/shops/page';
import AdminOrdersPage from './pages/admin/orders/page';
import AdminDocumentsPage from './pages/admin/documents/page';
import AdminPricingPage from './pages/admin/pricing/page';
import AdminSettingsPage from './pages/admin/settings/page';
import AdminProfilePage from './pages/admin/profile/page';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or forbidden page
  }

  return <Outlet />;
};


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans antialiased transition-colors duration-200">
          <ThemeToggle />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<GuestWorkflowManager />} />
            
            {/* Guest Routes - No authentication required */}
            <Route element={<GuestLayout />}>
                <Route path="/guest/orders" element={<GuestOrdersPage />} />
                <Route path="/guest/wallet" element={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Guest Wallet Page (Coming Soon)</h1></div></div>} />
                <Route path="/guest/profile" element={<div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8"><div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold">Guest Profile Page (Coming Soon)</h1></div></div>} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'SHOP_OWNER', 'ADMIN']} />}>
              <Route path="/dashboard/customer/*" element={<CustomerDashboard />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard/shop/*" element={<ShopDashboard />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="shops" element={<AdminShopsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="documents" element={<AdminDocumentsPage />} />
                <Route path="pricing" element={<AdminPricingPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>
            </Route>

            {/* Legacy redirect for old admin routes */}
            <Route path="/dashboard/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard/admin/*" element={<Navigate to="/admin/*" replace />} />

          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
