'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Database, Globe, Save, RefreshCw } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/LegacyButton';
import { Input } from '../../../components/ui/LegacyInput';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'email';
  isEditable: boolean;
}

interface SystemLog {
  id: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  message: string;
  timestamp: string;
  user?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'logs'>('general');
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettingsData = async () => {
      setLoading(true);
      try {
        const mockSettings: SystemSetting[] = [
          {
            id: '1',
            category: 'general',
            key: 'site_name',
            value: 'PrintSync',
            description: 'The name of the platform',
            type: 'string',
            isEditable: true,
          },
          {
            id: '2',
            category: 'general',
            key: 'max_file_size',
            value: '50',
            description: 'Maximum file upload size in MB',
            type: 'number',
            isEditable: true,
          },
          {
            id: '3',
            category: 'general',
            key: 'default_currency',
            value: 'TZS',
            description: 'Default currency for pricing',
            type: 'string',
            isEditable: true,
          },
          {
            id: '4',
            category: 'security',
            key: 'session_timeout',
            value: '24',
            description: 'Session timeout in hours',
            type: 'number',
            isEditable: true,
          },
          {
            id: '5',
            category: 'security',
            key: 'require_email_verification',
            value: 'true',
            description: 'Require email verification for new users',
            type: 'boolean',
            isEditable: true,
          },
          {
            id: '6',
            category: 'notifications',
            key: 'email_notifications',
            value: 'true',
            description: 'Enable email notifications',
            type: 'boolean',
            isEditable: true,
          },
          {
            id: '7',
            category: 'notifications',
            key: 'admin_email',
            value: 'admin@printsync.com',
            description: 'Admin email for notifications',
            type: 'email',
            isEditable: true,
          },
        ];

        const mockLogs: SystemLog[] = [
          {
            id: '1',
            level: 'INFO',
            message: 'User john.doe@example.com logged in',
            timestamp: '2024-03-06T10:30:00Z',
            user: 'john.doe@example.com',
          },
          {
            id: '2',
            level: 'WARNING',
            message: 'High server load detected: 85%',
            timestamp: '2024-03-06T10:25:00Z',
          },
          {
            id: '3',
            level: 'ERROR',
            message: 'Failed to process payment for order ORD-2024-001',
            timestamp: '2024-03-06T10:20:00Z',
            user: 'system',
          },
          {
            id: '4',
            level: 'INFO',
            message: 'New shop registration: Quick Print Center',
            timestamp: '2024-03-06T10:15:00Z',
            user: 'quick@example.com',
          },
          {
            id: '5',
            level: 'DEBUG',
            message: 'Database backup completed successfully',
            timestamp: '2024-03-06T10:00:00Z',
            user: 'system',
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSettings(mockSettings);
        setLogs(mockLogs);
        
        // Initialize editing settings
        const initialEditing: Record<string, string> = {};
        mockSettings.forEach(setting => {
          initialEditing[setting.id] = setting.value;
        });
        setEditingSettings(initialEditing);
      } catch (error) {
        console.error('Failed to fetch settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const getLogLevelBadge = (level: string) => {
    const styles = {
      INFO: 'bg-blue-100 text-blue-800 border-blue-200',
      WARNING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ERROR: 'bg-red-100 text-red-800 border-red-200',
      DEBUG: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return (
      <Badge className={styles[level as keyof typeof styles]}>
        {level}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSettingChange = (settingId: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', editingSettings);
    // In real implementation, this would make an API call
  };

  if (loading) {
    return (
      <div className="space-y-4">
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1 flex items-center gap-3">
            <Settings className="h-7 w-7 text-hp-primary" />
            System Settings
          </h1>
          <p className="text-steel text-sm">Configure platform settings and preferences</p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          className="bg-hp-primary hover:bg-hp-primary/90 text-white rounded-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-cloud border border-fog p-1 rounded-xl max-w-[800px] overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'general'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <Globe className="h-4 w-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'security'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <Shield className="h-4 w-4" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'notifications'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            activeTab === 'logs'
              ? 'bg-paper text-ink shadow-sm'
              : 'text-steel hover:bg-paper/50'
          }`}
        >
          <Database className="h-4 w-4" />
          System Logs
        </button>
      </div>

      {/* Settings Content */}
      {(activeTab === 'general' || activeTab === 'security' || activeTab === 'notifications') && (
        <div className="bg-cloud border border-fog rounded-xl p-6">
          <div className="space-y-6">
            {settings
              .filter(setting => setting.category === activeTab)
              .map((setting) => (
                <div key={setting.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-ink uppercase tracking-wide">
                      {setting.key.replace('_', ' ').toUpperCase()}
                    </label>
                    <Badge variant="outline" className="border-fog text-steel bg-paper">
                      {setting.type}
                    </Badge>
                  </div>
                  <Input
                    value={editingSettings[setting.id] || ''}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    disabled={!setting.isEditable}
                    className="bg-cloud border-fog text-ink placeholder-steel focus-visible:ring-hp-primary"
                    placeholder={setting.value}
                  />
                  <p className="text-sm text-steel">{setting.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-cloud border border-fog rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-fog flex items-center justify-between bg-paper">
            <h3 className="text-lg font-semibold text-ink">System Logs</h3>
            <Button variant="outline" size="sm" className="border-fog text-ink hover:bg-cloud">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-fog bg-paper">
                <TableHead className="text-graphite font-semibold">Level</TableHead>
                <TableHead className="text-graphite font-semibold">Message</TableHead>
                <TableHead className="text-graphite font-semibold">User</TableHead>
                <TableHead className="text-graphite font-semibold">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-fog hover:bg-paper/50 transition-colors">
                  <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                  <TableCell className="text-ink font-medium">{log.message}</TableCell>
                  <TableCell className="text-steel">{log.user || 'System'}</TableCell>
                  <TableCell className="text-steel">{formatDate(log.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
