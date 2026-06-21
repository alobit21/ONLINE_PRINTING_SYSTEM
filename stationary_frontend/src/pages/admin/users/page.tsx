'use client';

import { useQuery } from '@apollo/client/react';
import { Users } from 'lucide-react';
import { UsersTable } from '../../../components/admin/users-table';
import { GET_ALL_USERS_SIMPLE } from '../../../features/admin/api';

export default function AdminUsersPage() {
  const { data, loading, error } = useQuery(GET_ALL_USERS_SIMPLE);

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
