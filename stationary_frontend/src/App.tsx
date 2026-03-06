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

import { LandingPage } from './pages/landing/LandingPage';

// Import admin pages
import AdminDashboardPage from './pages/admin/dashboard/page';
import AdminUsersPage from './pages/admin/users/page';
import AdminShopsPage from './pages/admin/shops/page';
import AdminOrdersPage from './pages/admin/orders/page';
import AdminDocumentsPage from './pages/admin/documents/page';
import AdminPricingPage from './pages/admin/pricing/page';
import AdminSettingsPage from './pages/admin/settings/page';

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
        <div className="min-h-screen bg-slate-50 font-sans antialiased">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'SHOP_OWNER', 'ADMIN']} />}>
              <Route path="/dashboard/customer/*" element={<CustomerDashboard />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard/shop/*" element={<ShopDashboard />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/shops" element={<AdminShopsPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/documents" element={<AdminDocumentsPage />} />
                <Route path="/admin/pricing" element={<AdminPricingPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
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
