'use client';

import { useQuery } from '@apollo/client/react';
import { Users } from 'lucide-react';
import { UsersTable } from '../../../components/admin/users-table';
import { GET_ALL_USERS_SIMPLE, GET_ME } from '../../../features/admin/api';
import { useAuthStore } from '../../../stores/authStore';

export default function AdminUsersPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { data: meData, loading: meLoading, error: meError } = useQuery(GET_ME);
  const { data, loading, error } = useQuery(GET_ALL_USERS_SIMPLE, {
    // Skip the users query if we're not authenticated or not admin
    skip: !meData?.me || meData?.me?.role !== 'ADMIN'
  });

  // Debug authentication status
  console.log('AuthStore User:', user);
  console.log('AuthStore Token:', token ? token.substring(0, 20) + '...' : 'none');
  console.log('AuthStore IsAuthenticated:', isAuthenticated);
  
  console.log('GraphQL ME Data:', meData);
  console.log('GraphQL ME Loading:', meLoading);
  console.log('GraphQL ME Error:', meError);
  
  console.log('GraphQL Users Data:', data);
  console.log('GraphQL Users Loading:', loading);
  console.log('GraphQL Users Error:', error);

  if (meLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (meError) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Authentication Error</p>
        <p className="text-sm">{meError.message}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login Again
        </button>
      </div>
    );
  }

  const currentUser = meData?.me;

  if (!currentUser) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Not Authenticated</p>
        <p className="text-sm">Please login to access this page.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Access Denied</p>
        <p className="text-sm">You don't have admin permissions to view this page.</p>
        <p className="text-sm">Your role: {currentUser.role}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg font-medium">Error loading users</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  // For simple query, users are directly in data.usersSimple
  const users = data?.usersSimple || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            User Management
          </h1>
          <p className="text-gray-400">Manage platform users and permissions</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users} loading={loading} />
    </div>
  );
}
