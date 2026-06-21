'use client';

import { useQuery } from '@apollo/client/react';
import { Users } from 'lucide-react';
import { UsersTable } from '../../../components/admin/users-table';
import { GET_ALL_USERS_SIMPLE } from '../../../features/admin/api';

export default function AdminUsersPage() {
  const { data, loading, error } = useQuery(GET_ALL_USERS_SIMPLE);

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-cloud border border-fog rounded-xl p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-fog rounded w-1/3"></div>
              <div className="h-6 bg-fog rounded w-1/2"></div>
              <div className="h-4 bg-fog rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Users className="h-12 w-12 text-error" />
        <h2 className="text-xl font-bold text-ink">Error loading users</h2>
        <p className="text-steel max-w-sm">{error.message}</p>
      </div>
    );
  }

  // For simple query, users are directly in data.usersSimple
  const users = data?.usersSimple || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <Users className="h-7 w-7 text-hp-primary" />
            User Management
          </h1>
          <p className="text-steel text-sm">Manage platform users and permissions</p>
        </div>
        <div className="text-sm font-medium text-steel bg-cloud border border-fog px-4 py-2 rounded-lg">
          Total: {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <UsersTable users={users} loading={loading} />
    </div>
  );
}
