import { motion } from 'framer-motion';
import { ChevronRight, Upload, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDashboard from '../../assets/hero-dashboard.png';

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-brand-100/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-brand-50/50 rounded-full blur-[100px]" />
            </div>

            <div className="section-container">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                    {/* Left Side: Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex flex-col items-center lg:items-start mb-10 lg:mb-14">
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-brand-600 mb-6 block lg:ml-1">Future of Workflow.</span>
                                <h1 className="text-5xl md:text-7xl xl:text-[8rem] font-black text-slate-900 leading-[0.8] tracking-tighter uppercase mb-8">
                                    Print <br className="hidden xl:block" />
                                    <span className="text-gradient-brand">Smarter.</span>
                                </h1>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-5">
                                    <span className="text-xl md:text-4xl font-black text-slate-300 italic tracking-tight">Faster.</span>
                                    <div className="h-1.5 w-1.5 bg-brand-400 rounded-full opacity-50" />
                                    <span className="text-xl md:text-4xl font-black text-slate-300 italic tracking-tight">Closer.</span>
                                    <div className="h-1.5 w-1.5 bg-brand-400 rounded-full opacity-50" />
                                    <span className="text-xl md:text-4xl font-black text-slate-900 italic tracking-tight underline decoration-brand-200 decoration-8 underline-offset-4">Reliable.</span>
                                </div>
                            </div>

                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-semibold mb-12 max-w-[640px] mx-auto lg:mx-0">
                                The all-in-one platform to upload, analyze, and print your documents
                                at the nearest professional shop. Save time, reduce costs, and
                                experience high-quality printing on demand.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-16">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-3 group transform hover:scale-[1.02] hover:-translate-y-1"
                                >
                                    Get Started Free
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/register?role=shop"
                                    className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] hover:-translate-y-1 shadow-sm"
                                >
                                    Register Shop
                                </Link>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>Cloud Optimized</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>500+ Local Partners</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                                    <CheckCircle2 size={18} className="text-success" />
                                    <span>Zero Latency</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Graphic */}
                    <div className="flex-1 relative w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-brand-600/10 blur-[100px] rounded-full scale-75" />

                            <div className="relative glass p-2 lg:p-3 rounded-[2.5rem] shadow-2xl border-white/40 overflow-hidden transform hover:rotate-1 transition-transform duration-700">
                                <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
                                    <img
                                        src={heroDashboard}
                                        alt="Sationary Dashboard Interface"
                                        className="w-full h-auto object-cover opacity-95 hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute -top-6 -left-6 lg:-left-12 glass p-4 rounded-2xl shadow-xl flex items-center gap-4 float z-20">
                                <div className="bg-brand-500 p-2.5 rounded-xl text-white shadow-lg shadow-brand-500/30">
                                    <Upload size={24} strokeWidth={3} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Processing</p>
                                    <p className="text-sm text-slate-900 font-black">Report_V2.pdf</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -right-4 lg:-right-8 glass p-6 rounded-3xl shadow-2xl border-white/50 flex flex-col gap-3 min-w-[240px] pulse-slow z-20">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Instant Quote</span>
                                    <div className="bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Active</div>
                                </div>
                                <span className="text-3xl font-black text-brand-600 leading-none">$4.50</span>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                                        className="h-full bg-brand-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
