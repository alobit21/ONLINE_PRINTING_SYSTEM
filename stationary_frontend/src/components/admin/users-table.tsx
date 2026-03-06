import { useState } from 'react';
import { MoreHorizontal, Edit, Ban, Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';
  subscriptionTier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  isVerified: boolean;
  createdAt: string;
}

interface UsersTableProps {
  users: User[];
  loading?: boolean;
}

export function UsersTable({ users, loading }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesSubscription = subscriptionFilter === 'all' || user.subscriptionTier === subscriptionFilter;
    
    return matchesSearch && matchesRole && matchesSubscription;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-red-100 text-red-800 border-red-200',
      SHOP_OWNER: 'bg-blue-100 text-blue-800 border-blue-200',
      CUSTOMER: 'bg-green-100 text-green-800 border-green-200',
    };
    return (
      <Badge className={styles[role as keyof typeof styles]}>
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  const getVerificationBadge = (isVerified: boolean) => (
    <Badge className={isVerified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
      {isVerified ? 'Verified' : 'Pending'}
    </Badge>
  );

  const getSubscriptionBadge = (tier: string) => {
    const styles = {
      FREE: 'bg-gray-100 text-gray-800 border-gray-200',
      PREMIUM: 'bg-purple-100 text-purple-800 border-purple-200',
      ENTERPRISE: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return (
      <Badge className={styles[tier as keyof typeof styles]}>
        {tier}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <Select 
          value={roleFilter} 
          onValueChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'ADMIN', label: 'Admin' },
            { value: 'SHOP_OWNER', label: 'Shop Owner' },
            { value: 'CUSTOMER', label: 'Customer' }
          ]}
        />
        <Select 
          value={subscriptionFilter} 
          onValueChange={setSubscriptionFilter}
          options={[
            { value: 'all', label: 'All Subscriptions' },
            { value: 'FREE', label: 'Free' },
            { value: 'PREMIUM', label: 'Premium' },
            { value: 'ENTERPRISE', label: 'Enterprise' }
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">First Name</TableHead>
              <TableHead className="text-gray-300">Last Name</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Subscription</TableHead>
              <TableHead className="text-gray-300">Verified</TableHead>
              <TableHead className="text-gray-300">Staff Status</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-gray-700 hover:bg-gray-750">
                <TableCell className="text-gray-100 font-medium">{user.email}</TableCell>
                <TableCell className="text-gray-300">{user.firstName || '-'}</TableCell>
                <TableCell className="text-gray-300">{user.lastName || '-'}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getSubscriptionBadge(user.subscriptionTier)}</TableCell>
                <TableCell>{getVerificationBadge(user.isVerified)}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                        <Ban className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
