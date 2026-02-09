import { Bell, Search, User, Home, ClipboardList, Wallet, FileUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';

const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard/customer' },
    { icon: ClipboardList, label: 'Orders', path: '/dashboard/customer/orders' },
    { icon: FileUp, label: 'Upload', path: '/dashboard/customer/upload' },
    { icon: Wallet, label: 'Wallet', path: '/dashboard/customer/wallet' },
    { icon: User, label: 'Profile', path: '/dashboard/customer/profile' },
];

export const TopHeader = () => {
    const { user } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/20 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 gradient-brand rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        P
                    </div>
                    <span className="text-lg font-bold text-gradient-brand">PrintSync</span>
                </div>

                {/* Desktop Navigation - Hidden on mobile */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard/customer'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-brand-50 text-brand-600 font-medium"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white" />
                    </button>
                    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                        <span className="hidden sm:inline text-sm font-medium text-slate-700">
                            {user?.email?.split('@')[0]}
                        </span>
                        <div className="h-8 w-8 rounded-full gradient-brand border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
