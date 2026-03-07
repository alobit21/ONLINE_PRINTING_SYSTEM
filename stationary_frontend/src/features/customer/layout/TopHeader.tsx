import { Bell, User, Home, ClipboardList, Wallet, FileUp, LogOut, Menu, Settings, HelpCircle, Moon, Sun, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useCustomerStore } from '../../../stores/customerStore';
import { cn } from '../../../lib/utils';
import { useState } from 'react';
import { GuestVerificationModal } from '../guest/GuestVerificationModal';
import { useGuestVerification } from '../../../hooks/useGuestVerification';

export const TopHeader = () => {
    const { user, logout } = useAuthStore();
    const { files, resetWorkflow } = useCustomerStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { requireVerification, getVerificationModalProps } = useGuestVerification();

    // Check if user is logged in or guest
    const isLoggedIn = !!user;

    // Dynamic navigation items based on user status
    const navItems = isLoggedIn ? [
        { icon: Home, label: 'Home', path: '/dashboard/customer' },
        { icon: ClipboardList, label: 'Orders', path: '/dashboard/customer/orders' },
        { icon: FileUp, label: 'Upload', path: '/dashboard/customer/upload' },
        { icon: Wallet, label: 'Wallet', path: '/dashboard/customer/wallet' },
        { icon: User, label: 'Profile', path: '/dashboard/customer/profile' },
    ] : [
        { icon: Home, label: 'Home', path: '/' },
        { icon: FileUp, label: 'Upload', path: '/checkout' },
        { icon: ClipboardList, label: 'Orders', path: '/guest/orders' },
        { icon: Wallet, label: 'Wallet', path: '/guest/wallet' },
        { icon: User, label: 'Profile', path: '/guest/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleQuickUpload = () => {
        resetWorkflow();
        if (isLoggedIn) {
            navigate('/dashboard/customer/upload');
        } else {
            navigate('/checkout');
        }
    };

    const handleNavigation = (path: string, feature: string) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            const canProceed = requireVerification(feature);
            if (canProceed) {
                // Guest user already verified, navigate directly
                navigate(path);
            }
            // If canProceed is false, verification modal will open
        }
    };

    const handleMobileNavigation = (path: string, feature: string) => {
        setIsMobileMenuOpen(false);
        handleNavigation(path, feature);
    };

    const handleHome = () => {
        if (isLoggedIn) {
            navigate('/dashboard/customer');
        } else {
            navigate('/');
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Add theme toggle logic here
        document.documentElement.classList.toggle('dark');
    };

    return (
        <>
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer" onClick={handleHome}>
                                <span className="text-lg">P</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">PrintSync</span>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">{isLoggedIn ? 'Customer Portal' : 'Guest Portal'}</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        if (item.label === 'Home') {
                                            handleHome();
                                        } else if (item.label === 'Upload') {
                                            handleQuickUpload();
                                        } else {
                                            handleNavigation(item.path, item.label.toLowerCase());
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium",
                                        "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2">
                            {/* Quick Actions */}
                            <div className="hidden sm:flex items-center gap-1">
                                <button
                                    onClick={handleQuickUpload}
                                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FileUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">Quick Upload</span>
                                </button>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                                <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                {files.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-gradient-to-r from-brand-500 to-blue-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                                )}
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                                title="Toggle theme"
                            >
                                {isDarkMode ? (
                                    <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                                ) : (
                                    <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                                )}
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                                {isLoggedIn ? (
                                    <>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {user?.email?.split('@')[0]}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                Customer
                                            </p>
                                        </div>
                                        <div className="relative group">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform">
                                                {user?.email?.charAt(0).toUpperCase()}
                                            </div>
                                            
                                            {/* Dropdown Menu */}
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="p-2">
                                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <Settings className="h-4 w-4" />
                                                        Settings
                                                    </button>
                                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                        <HelpCircle className="h-4 w-4" />
                                                        Help & Support
                                                    </button>
                                                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm font-medium">Sign In</span>
                                    </button>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 py-4">
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => {
                                            if (item.label === 'Home') {
                                                handleHome();
                                            } else if (item.label === 'Upload') {
                                                handleQuickUpload();
                                            } else {
                                                handleMobileNavigation(item.path, item.label.toLowerCase());
                                            }
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </header>
            
            {/* Guest Verification Modal - Rendered outside header */}
            <GuestVerificationModal {...getVerificationModalProps()} />
        </>
    );
};
