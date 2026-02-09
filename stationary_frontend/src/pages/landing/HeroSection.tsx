import { motion } from 'framer-motion';
import { ChevronRight, Play, Upload, Zap, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl -z-10" />
            <div className="absolute top-40 -right-20 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 px-4 py-1.5 rounded-full text-brand-700 text-sm font-semibold mb-6">
                                <Zap size={16} fill="currentColor" />
                                <span>The Future of Printing is Here</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                                Print <span className="text-gradient-brand">Smarter.</span><br />
                                Faster. Closer.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Upload documents, auto-analyze costs, and find the nearest print shop in seconds.
                                Everything you need to print reliably, managed in one smart platform.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-2 group transform hover:scale-[1.02]"
                                >
                                    Get Started Free
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/register?role=shop"
                                    className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    Register Shop
                                </Link>
                            </div>

                            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>Free for Customers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>500+ Local Shops</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>Instant Quote</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Dashboard Mockup Shadow */}
                            <div className="absolute inset-0 bg-brand-600/20 blur-[100px] rounded-full" />

                            {/* Main Dashboard UI Mockup */}
                            <div className="relative glass border-white/40 shadow-2xl rounded-3xl overflow-hidden p-2">
                                <div className="bg-slate-900 rounded-[1.25rem] overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200"
                                        alt="Dashboard UI"
                                        className="w-full opacity-90 transition-transform duration-700 hover:scale-110"
                                    />
                                    {/* Overlay UI Elements */}
                                    <div className="absolute top-10 -left-10 glass-dark p-4 rounded-2xl shadow-xl flex items-center gap-4 float">
                                        <div className="bg-brand-500 p-2 rounded-xl text-white">
                                            <Upload size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium lowercase">uploading</p>
                                            <p className="text-sm text-white font-bold tracking-tight">Report_2024.pdf</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 -right-10 glass p-5 rounded-2xl shadow-xl border-white/50 flex flex-col gap-3 min-w-[200px] animate-pulse">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500">Processing Cost</span>
                                            <span className="text-sm font-bold text-brand-600">$4.50</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-brand-600 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 left-10 flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                        alt="User"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    +2.4k
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
