import { cn } from '../../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  Settings
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Shops',
    href: '/admin/shops',
    icon: Store,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Documents',
    href: '/admin/documents',
    icon: FileText,
  },
  {
    title: 'Pricing',
    href: '/admin/pricing',
    icon: DollarSign,
  },
  {
    title: 'System Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const SidebarContent = () => (
    <div className={cn('flex flex-col h-full w-64 bg-gray-800 border-r border-gray-700', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">PrintSync</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.includes(item.href.split('/').pop() || '');
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>Admin Dashboard v1.0</p>
          <p>© 2024 PrintSync</p>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarContent />
  );
}
