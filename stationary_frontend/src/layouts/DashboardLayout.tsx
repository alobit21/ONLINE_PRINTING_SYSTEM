import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Printer, Package } from 'lucide-react';
import { cn } from '../lib/utils';

export const DashboardLayout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();

    const navItems = user?.role === 'SHOP_OWNER' ? [
        { label: 'Overview', href: '/dashboard/shop', icon: LayoutDashboard, exact: true },
        { label: 'Orders', href: '/dashboard/shop/orders', icon: ShoppingBag },
        { label: 'Products', href: '/dashboard/shop/products', icon: Package },
        { label: 'Settings', href: '/dashboard/shop/settings', icon: Settings },
    ] : user?.role === 'ADMIN' ? [
        { label: 'System Overview', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
    ] : [
        { label: 'Home', href: '/dashboard/customer', icon: LayoutDashboard },
        { label: 'My Orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
        { label: 'Profile', href: '/dashboard/customer/profile', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b border-gray-700 flex items-center gap-2">
                    <Printer className="w-6 h-6 text-brand-600" />
                    <span className="font-bold text-lg text-white tracking-tight">PrintSync</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item: any) => {
                        const Icon = item.icon;

                        // Special case for Overview to not be active when in sub-routes if exact is true
                        // actually, /dashboard/shop is the prefix for all, so we need careful matching.
                        // Let's stick to: if it's the specific path, or if it's a subpath match for others.

                        const isSelected = item.href === '/dashboard/shop'
                            ? location.pathname === '/dashboard/shop'
                            : location.pathname.includes(item.href);

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-700",
                                    isSelected
                                        ? "bg-brand-600 text-white"
                                        : "text-gray-300 hover:text-white"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className={isSelected ? "font-semibold" : ""}>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate" title={user?.email}>{user?.email}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={logout}>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};
