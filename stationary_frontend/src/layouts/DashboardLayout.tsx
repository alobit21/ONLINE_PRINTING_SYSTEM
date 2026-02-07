import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Printer } from 'lucide-react';
import { cn } from '../components/ui/Button';

export const DashboardLayout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();

    const navItems = [
        { label: 'Overview', href: `/dashboard/${user?.role === 'CUSTOMER' ? 'customer' : 'shop'}`, icon: LayoutDashboard },
        { label: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b flex items-center gap-2">
                    <Printer className="w-6 h-6 text-brand-600" />
                    <span className="font-bold text-lg text-slate-800 tracking-tight">PrintSync</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2 text-slate-600" onClick={logout}>
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
