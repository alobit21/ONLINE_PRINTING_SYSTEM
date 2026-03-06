'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/badge';
import { useAuthStore } from '../../../stores/authStore';

interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Mock data - in real implementation, this would fetch from API
        const mockProfile: AdminProfile = {
          id: user?.id || '1',
          email: user?.email || 'admin@printsync.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: user?.role || 'ADMIN',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: new Date().toISOString(),
          permissions: [
            'Manage Users',
            'Manage Shops', 
            'Manage Orders',
            'System Settings',
            'View Analytics',
            'Manage Documents'
          ]
        };
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfile(mockProfile);
        setEditForm({
          firstName: mockProfile.firstName,
          lastName: mockProfile.lastName,
          email: mockProfile.email,
        });
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    }
  };

  const handleSave = () => {
    // Simulate saving profile
    console.log('Saving profile:', editForm);
    if (profile) {
      setProfile({
        ...profile,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
      });
    }
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Profile Not Found</h2>
          <p className="text-gray-400">Unable to load admin profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <User className="h-8 w-8 text-blue-400" />
            Admin Profile
          </h1>
          <p className="text-gray-400">Manage your administrator account information</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  {editing ? (
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded">{profile.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  {editing ? (
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded">{profile.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                {editing ? (
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-white bg-gray-700 px-3 py-2 rounded">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {profile.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-900/50 text-red-400 border-red-700">
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Created
                </label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Login
                </label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded">
                  {formatDate(profile.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Permissions
            </h2>
            <div className="space-y-2">
              {profile.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Actions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Change Password
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
