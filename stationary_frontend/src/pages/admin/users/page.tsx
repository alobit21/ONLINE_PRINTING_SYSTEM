'use client';

import { useQuery } from '@apollo/client/react';
import { Users, UserPlus, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';
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

  const activeUsers = users.filter((u: any) => u.isActive !== false).length;
  const adminUsers = users.filter((u: any) => u.role === 'ADMIN').length;
  const unverifiedUsers = users.filter((u: any) => u.isVerified === false).length;

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

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-hp-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="h-6 w-6 text-hp-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Total Users</p>
            <p className="text-2xl font-bold text-ink leading-tight">{users.length}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Active Users</p>
            <p className="text-2xl font-bold text-ink leading-tight">{activeUsers}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Unverified</p>
            <p className="text-2xl font-bold text-ink leading-tight">{unverifiedUsers}</p>
          </div>
        </div>
        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center gap-4 hover:border-steel transition-colors">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-steel uppercase tracking-wide">Staff & Admins</p>
            <p className="text-2xl font-bold text-ink leading-tight">{adminUsers}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main / Centered Content */}
        <div className="xl:col-span-3 space-y-6">
          <UsersTable users={users} loading={loading} />
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-start gap-2 bg-hp-primary hover:bg-hp-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <UserPlus className="h-4 w-4" />
                Invite User
              </button>
              <button className="w-full flex items-center justify-start gap-2 border border-fog hover:bg-paper text-ink px-4 py-2 rounded-lg font-medium transition-colors">
                <ShieldAlert className="h-4 w-4 text-warning" />
                Review Unverified
              </button>
            </div>
          </div>

          {/* User Activity Summary */}
          <div className="bg-cloud border border-fog rounded-xl p-5">
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wide mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Active Rate</span>
                  <span className="font-medium text-ink">
                    {users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${users.length > 0 ? (activeUsers / users.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-steel">Verification Issues</span>
                  <span className="font-medium text-warning">
                    {users.length > 0 ? Math.round((unverifiedUsers / users.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-warning h-2 rounded-full" 
                    style={{ width: `${users.length > 0 ? (unverifiedUsers / users.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
