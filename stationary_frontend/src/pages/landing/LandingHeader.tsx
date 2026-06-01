import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Printer, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                isScrolled
                    ? 'bg-gray-900/90 dark:bg-white/90 backdrop-blur-xl border-b border-gray-800/40 dark:border-gray-200/40 py-3 shadow-lg'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="section-container">
                <nav className="flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-brand-600 p-2 rounded-lg text-white">
                            <Printer size={22} />
                        </div>
                        <span className="text-lg font-bold uppercase text-white dark:text-gray-900">
                            Sationary<span className="text-brand-500">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 dark:text-gray-700 hover:text-brand-400 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/checkout"
                            className="text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                            Guest Order
                        </Link>

                        <Link
                            to="/login"
                            className="text-sm text-gray-300 dark:text-gray-700 hover:text-brand-400 transition-colors"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition"
                        >
                            Get Started
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-gray-300 dark:text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-900 dark:bg-white border-t border-gray-800 dark:border-gray-200 overflow-hidden"
                    >
                        <div className="section-container py-6 flex flex-col gap-4">

                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-semibold text-white dark:text-gray-900"
                                >
                                    {link.name}
                                </a>
                            ))}

                            <div className="pt-4 flex flex-col gap-3">
                                <Link to={"/guest-order"} className="text-green-400 font-semibold">
                                    Guest Order
                                </Link>
                                <Link to={"/login"} className="text-gray-300 dark:text-gray-700">
                                    Sign In
                                </Link>
                                <Link to={"/register"} className="bg-brand-600 text-white py-3 rounded-xl text-center font-semibold">
                                    Get Started
                                </Link>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};