import { Home, FileUp, ClipboardList, Wallet, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../../lib/utils';

const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard/customer' },
    { icon: ClipboardList, label: 'Orders', path: '/dashboard/customer/orders' },
    { icon: Wallet, label: 'Wallet', path: '/dashboard/customer/wallet' },
    { icon: User, label: 'Profile', path: '/dashboard/customer/profile' },
];

export const BottomNavigation = () => {
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 pb-safe shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between relative">
                {navItems.slice(0, 2).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1 transition-all duration-300",
                            isActive ? "text-brand-600 scale-110" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}

                {/* Floating Upload Button */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                    <NavLink
                        to="/dashboard/customer/upload"
                        className={({ isActive }) => cn(
                            "flex items-center justify-center h-14 w-14 rounded-full shadow-lg transition-all duration-300 border-4 border-slate-50",
                            isActive
                                ? "gradient-brand text-white scale-110 rotate-12"
                                : "bg-white text-brand-600 hover:bg-brand-50 hover:scale-105"
                        )}
                    >
                        <FileUp className="h-6 w-6" />
                    </NavLink>
                </div>

                {/* Placeholder for middle gap */}
                <div className="w-10" />

                {navItems.slice(2).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col items-center gap-1 transition-all duration-300",
                            isActive ? "text-brand-600 scale-110" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
