import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, ShoppingBag, Search, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { useAuthStore } from '../../stores/authStore';

export const LandingHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b border-fog transition-colors duration-300">
            {/* Utility Strip */}
            <div className="w-full bg-gray-900 flex items-center justify-between px-8 h-[36px] hidden md:flex">
                <div className="flex items-center gap-6">
                    <span className="text-xs text-white opacity-70">EN / USD</span>
                    <a href="#" className="text-xs text-white opacity-70 hover:opacity-100 transition">Help</a>
                    <a href="#" className="text-xs text-white opacity-70 hover:opacity-100 transition">Store Locations</a>
                </div>
                <div className="flex items-center gap-6">
                    <Link to={isAuthenticated ? "/dashboard/customer/orders" : "/orders"} className="text-xs text-white opacity-70 hover:opacity-100 transition">My Orders</Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard/customer" className="text-xs text-white opacity-70 hover:opacity-100 transition">Dashboard ({user?.email?.split('@')[0]})</Link>
                            <button onClick={logout} className="text-xs text-red-400 opacity-70 hover:opacity-100 transition">Sign out</button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-xs text-white opacity-70 hover:opacity-100 transition">Sign in</Link>
                    )}
                    <Link to="/cart" className="text-xs text-white opacity-70 flex items-center gap-1 hover:opacity-100 transition">
                        <ShoppingBag size={13} />
                        <span>Cart</span>
                    </Link>
                </div>
            </div>

            {/* Main NavBar */}
            <div className="w-full bg-canvas flex items-center justify-between px-4 md:px-8 h-[64px] transition-colors duration-300">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-hp-primary flex items-center justify-center rounded-[4px] w-7 h-7">
                        <Printer size={16} className="text-canvas" />
                    </div>
                    <Link to="/" className="font-semibold text-base text-ink tracking-tight">
                        Stationary
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/checkout" className="text-sm font-medium text-ink hover:text-hp-primary transition">Upload & Print</Link>
                    <a href="#pricing" className="text-sm font-medium text-charcoal hover:text-ink transition">Pricing</a>
                    <a href="#how-it-works" className="text-sm font-medium text-charcoal hover:text-ink transition">How It Works</a>
                    <Link to="/track" className="text-sm font-medium text-charcoal hover:text-ink transition">Track Order</Link>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <div className="hidden lg:flex items-center gap-2 bg-cloud border border-fog rounded-[4px] px-3 py-1.5 w-[180px]">
                        <Search size={14} className="text-steel" />
                        <span className="text-sm text-steel">Search...</span>
                    </div>
                    <Link
                        to="/checkout"
                        className="bg-hp-primary hover:bg-hp-primary/90 text-canvas text-xs sm:text-sm font-semibold px-3 sm:px-4 rounded-[4px] flex items-center h-8 sm:h-9 tracking-[0.7px] transition"
                    >
                        <span className="hidden sm:inline">START PRINTING</span>
                        <span className="sm:hidden">PRINT</span>
                    </Link>
                    <button 
                        className="md:hidden text-ink p-1 hover:bg-cloud rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-canvas border-b border-fog shadow-lg animate-fade-in absolute w-full left-0 top-[64px]">
                    <nav className="flex flex-col py-4 px-6 gap-4">
                        <Link 
                            to="/checkout" 
                            className="text-base font-medium text-ink hover:text-hp-primary transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Upload & Print
                        </Link>
                        <a 
                            href="/#pricing" 
                            className="text-base font-medium text-charcoal hover:text-ink transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </a>
                        <a 
                            href="/#how-it-works" 
                            className="text-base font-medium text-charcoal hover:text-ink transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            How It Works
                        </a>
                        <Link 
                            to="/track" 
                            className="text-base font-medium text-charcoal hover:text-ink transition"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Track Order
                        </Link>
                        <div className="h-[1px] w-full bg-fog my-2"></div>
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/dashboard/customer" 
                                    className="text-base font-medium text-charcoal hover:text-ink transition"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button 
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="text-base font-medium text-left text-red-500 hover:text-red-600 transition"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="text-base font-medium text-charcoal hover:text-ink transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign in
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};