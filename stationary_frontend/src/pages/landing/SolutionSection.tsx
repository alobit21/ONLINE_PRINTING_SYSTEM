import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Navigation, RefreshCcw, Bell } from 'lucide-react';

export const SolutionSection = () => {
    const solutions = [
        {
            icon: <Sparkles className="text-brand-600" />,
            title: 'Smart Analysis',
            description: 'Our AI analyzes your documents for the best printing configuration.',
            color: 'bg-indigo-50',
        },
        {
            icon: <BarChart3 className="text-brand-600" />,
            title: 'Auto Pricing',
            description: 'Get instant, transparent quotes based on your exact requirements.',
            color: 'bg-blue-50',
        },
        {
            icon: <Navigation className="text-brand-600" />,
            title: 'Shop Matching',
            description: 'We find the nearest shop with the best rating for your job.',
            color: 'bg-cyan-50',
        },
        {
            icon: <Bell className="text-brand-600" />,
            title: 'Live Tracking',
            description: 'Real-time notifications from upload to collection.',
            color: 'bg-violet-50',
        },
    ];

    return (
        <section id="solution" className="py-24 gradient-brand-subtle overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1">
                        <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">The Solution</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            A smarter way to handle all your printing needs.
                        </h3>

                        <div className="space-y-6">
                            {solutions.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-6 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white transition-colors"
                                >
                                    <div className={`p-4 rounded-2xl ${item.color} h-fit`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                        <p className="text-slate-600">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square max-w-[500px] mx-auto"
                        >
                            <div className="absolute inset-0 bg-brand-400 rounded-full blur-[120px] opacity-20" />
                            <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
                                <div className="space-y-4 pt-12">
                                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 float">
                                        <div className="h-2 w-12 bg-brand-200 rounded-full mb-4" />
                                        <div className="h-2 w-24 bg-slate-100 rounded-full mb-2" />
                                        <div className="h-2 w-20 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-800 translate-x-12">
                                        <div className="h-8 w-8 bg-brand-500 rounded-lg mb-4" />
                                        <p className="text-white text-sm font-bold">Matching Shop...</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-brand-600 p-8 rounded-[2rem] shadow-xl text-white">
                                        <p className="text-2xl font-bold mb-2">$0.05</p>
                                        <p className="text-brand-100 text-xs uppercase tracking-widest font-bold">per page</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 -translate-x-8">
                                        <div className="flex gap-2">
                                            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                                            <div className="h-2 w-2 bg-brand-200 rounded-full" />
                                            <div className="h-2 w-2 bg-brand-200 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
