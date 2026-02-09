import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { client } from './lib/apollo/client';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerDashboard } from './pages/dashboard/CustomerDashboard';
import { ShopDashboard } from './pages/dashboard/ShopDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { useAuthStore } from './stores/authStore';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/landing/LandingPage';

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
                <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
                {/* Add more nested routes here */}
              </Route>
            </Route>

          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
