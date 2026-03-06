import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Printer, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-gray-900/90 border-b border-gray-800/50 py-3 shadow-2xl' : 'bg-transparent py-5'
                }`}
        >
            <div className="section-container">
                <nav className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-2.5 rounded-xl text-white group-hover:scale-110 transition-all shadow-lg shadow-brand-600/30">
                            <Printer size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase">
                            Sationary<span className="text-brand-400">.</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-gray-300 hover:text-brand-400 transition-all duration-300 hover:scale-105 relative group"
                            >
                                {link.name}
                                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-brand-600 to-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-gray-300 hover:text-brand-400 transition-all duration-300 hover:scale-105 relative group"
                        >
                            Sign In
                            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-brand-600 to-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-lg shadow-brand-600/30 flex items-center gap-2 group transform hover:scale-105 hover:shadow-xl hover:shadow-brand-600/40"
                        >
                            Get Started
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                        className="md:hidden backdrop-blur-xl bg-gray-900/95 border-t border-gray-800/50 overflow-hidden shadow-2xl"
                    >
                        <div className="section-container py-8 flex flex-col gap-5">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-white py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300 border border-transparent hover:border-gray-700/50"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-800/50">
                                <Link
                                    to="/login"
                                    className="text-center py-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-2xl text-white font-bold transition-all duration-300 border border-gray-700/50"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-center py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-brand-600/30"
                                >
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
