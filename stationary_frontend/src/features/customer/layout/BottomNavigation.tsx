import { Home, FileUp, ClipboardList, Wallet, User, Bell, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useCustomerStore } from '../../../stores/customerStore';
import { cn } from '../../../lib/utils';
import { useState } from 'react';

const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard/customer' },
    { icon: ClipboardList, label: 'Orders', path: '/dashboard/customer/orders' },
    { icon: Wallet, label: 'Wallet', path: '/dashboard/customer/wallet' },
    { icon: User, label: 'Profile', path: '/dashboard/customer/profile' },
];

export const BottomNavigation = () => {
    const { user, logout } = useAuthStore();
    const { files, resetWorkflow } = useCustomerStore();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleQuickUpload = () => {
        resetWorkflow();
        navigate('/dashboard/customer/upload');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-700/50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.08)]">
                <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between relative">
                    {/* Left Navigation Items */}
                    {navItems.slice(0, 2).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1.5 transition-all duration-300 py-1",
                                isActive ? "text-brand-600 scale-110" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            <div className="relative">
                                <item.icon className="h-6 w-6" />
                                {item.label === 'Orders' && files.length > 0 && (
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-gradient-to-r from-brand-500 to-blue-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                                )}
                            </div>
                            <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* Floating Upload Button */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                        <button
                            onClick={handleQuickUpload}
                            className="group relative flex items-center justify-center h-16 w-16 rounded-2xl shadow-xl transition-all duration-300 border-4 border-white dark:border-slate-900 bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white hover:scale-110 active:scale-95"
                        >
                            <FileUp className="h-7 w-7" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Quick Upload
                            </span>
                        </button>
                    </div>

                    {/* Right Navigation Items */}
                    {navItems.slice(2).map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex flex-col items-center gap-1.5 transition-all duration-300 py-1",
                                isActive ? "text-brand-600 scale-110" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="text-[11px] font-medium leading-tight">{item.label}</span>
                        </NavLink>
                    ))}

                    {/* User Profile Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex flex-col items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-1"
                        >
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white text-sm font-bold">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] font-medium leading-tight">Profile</span>
                        </button>

                        {/* User Menu Dropdown */}
                        {showUserMenu && (
                            <div className="absolute bottom-24 right-0 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {user?.email?.split('@')[0]}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {user?.email}
                                    </p>
                                    <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">
                                        Customer Account
                                    </p>
                                </div>
                                
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                        <Bell className="h-4 w-4" />
                                        Notifications
                                        {files.length > 0 && (
                                            <span className="ml-auto h-2 w-2 bg-brand-500 rounded-full"></span>
                                        )}
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>
                                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Safe Area */}
                <div className="h-safe w-full bg-white dark:bg-slate-900"></div>
            </nav>

            {/* Overlay for user menu */}
            {showUserMenu && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </>
    );
};
