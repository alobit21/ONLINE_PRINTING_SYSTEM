import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Printer, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="gradient-brand rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 transform -rotate-12">
                            <Printer size={300} />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl w-fit mx-auto mb-8 border border-white/30">
                            <Rocket size={32} />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            Ready to start printing <br className="hidden md:block" /> smarter today?
                        </h2>
                        <p className="text-xl text-brand-100 mb-12 max-w-2xl mx-auto font-medium">
                            Join 50,000+ users and 800+ print shops already using our platform to simplify their workflows.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto bg-white text-brand-700 hover:bg-slate-50 px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-xl flex items-center justify-center gap-3 group transform hover:scale-[1.05]"
                            >
                                Upload Your First Document
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/register?role=shop"
                                className="w-full sm:w-auto bg-transparent border-2 border-white/50 text-white hover:bg-white/10 px-10 py-5 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 transform hover:scale-[1.05]"
                            >
                                Register Your Shop
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-brand-200 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">No Credit Card Required</div>
                            <div className="flex items-center gap-2">Cancel Anytime</div>
                            <div className="flex items-center gap-2">24/7 Support</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
