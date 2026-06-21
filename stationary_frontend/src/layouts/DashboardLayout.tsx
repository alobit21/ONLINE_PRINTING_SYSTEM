import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/LegacyButton';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Printer, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { DashboardNavbar } from './DashboardNavbar';

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
        <div className="min-h-screen bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-300">
            {/* Sidebar - Full height, hidden on mobile */}
            <aside className="hidden lg:flex w-64 flex-col bg-canvas border-r border-fog flex-shrink-0 z-50">
                <div className="h-16 border-b border-fog flex items-center gap-2 px-6 bg-paper">
                    <Printer className="w-6 h-6 text-hp-primary" />
                    <span className="font-bold text-lg text-ink tracking-tight">PrintSync</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item: any) => {
                        const Icon = item.icon;

                        const isSelected = item.href === '/dashboard/shop'
                            ? location.pathname === '/dashboard/shop'
                            : location.pathname.includes(item.href);

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-cloud",
                                    isSelected
                                        ? "bg-hp-primary text-white hover:bg-hp-primary/90"
                                        : "text-steel hover:text-ink"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className={isSelected ? "font-semibold" : ""}>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-fog bg-paper">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-hp-primary flex items-center justify-center text-white font-bold text-xs">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-ink truncate" title={user?.email}>{user?.email}</p>
                            <p className="text-[10px] text-steel uppercase tracking-wider font-semibold">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-error hover:text-error hover:bg-error/10" onClick={logout}>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                {/* Top Navigation */}
                <DashboardNavbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background transition-colors duration-300">
                    <div className="w-full p-4 lg:p-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
