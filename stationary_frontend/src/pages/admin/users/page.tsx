'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { UsersTable } from '../../../components/admin/users-table';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';
  subscriptionTier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  isVerified: boolean;
  isStaff: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Replace with actual GraphQL query
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@printsync.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            subscriptionTier: 'ENTERPRISE',
            isVerified: true,
            isStaff: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            email: 'shop.owner@example.com',
            firstName: 'Shop',
            lastName: 'Owner',
            role: 'SHOP_OWNER',
            subscriptionTier: 'PREMIUM',
            isVerified: true,
            isStaff: false,
            createdAt: '2024-01-15T00:00:00Z',
          },
          {
            id: '3',
            email: 'customer@example.com',
            firstName: 'Customer',
            lastName: 'User',
            role: 'CUSTOMER',
            subscriptionTier: 'FREE',
            isVerified: false,
            isStaff: false,
            createdAt: '2024-02-01T00:00:00Z',
          },
          {
            id: '4',
            email: 'premium.user@example.com',
            firstName: 'Premium',
            lastName: 'User',
            role: 'CUSTOMER',
            subscriptionTier: 'PREMIUM',
            isVerified: true,
            isStaff: false,
            createdAt: '2024-02-10T00:00:00Z',
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
