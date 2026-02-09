import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, ShieldCheck, History, MousePointer2, TrendingUp, Users, PieChart } from 'lucide-react';

export const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState<'customer' | 'shop'>('customer');

    const customerFeatures = [
        {
            icon: <MousePointer2 className="text-brand-600" />,
            title: 'One-Click Upload',
            description: 'Upload multiple files at once. We support PDF, DOCX, and common image formats.',
        },
        {
            icon: <ShieldCheck className="text-brand-600" />,
            title: 'Secure Payments',
            description: 'End-to-end encrypted payments. Your data and documents are always safe.',
        },
        {
            icon: <History className="text-brand-600" />,
            title: 'Order Templates',
            description: 'Saved document profiles for one-click reordering of regular items.',
        },
        {
            icon: <TrendingUp className="text-brand-600" />,
            title: 'Cost Savings',
            description: 'Smart optimization suggestions to help you reduce printing costs.',
        },
    ];

    const shopFeatures = [
        {
            icon: <PieChart className="text-brand-600" />,
            title: 'Order Dashboard',
            description: 'A professional management system to handle your printing queue efficiently.',
        },
        {
            icon: <Users className="text-brand-600" />,
            title: 'Customer Insights',
            description: 'Understand your peak hours and popular services with detailed analytics.',
        },
        {
            icon: <TrendingUp className="text-brand-600" />,
            title: 'Growth Tools',
            description: 'Marketing tools to reach more students and professionals in your area.',
        },
        {
            icon: <Store className="text-brand-600" />,
            title: 'Queue Management',
            description: 'Digital job distribution to keep your machines running efficiently.',
        },
    ];

    const features = activeTab === 'customer' ? customerFeatures : shopFeatures;

    return (
        <section id="features" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">Powerful Features</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                        Built for everyone in the printing ecosystem.
                    </h3>

                    <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl mb-12">
                        <button
                            onClick={() => setActiveTab('customer')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'customer'
                                    ? 'bg-white text-brand-600 shadow-md scale-105'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User size={18} />
                            For Customers
                        </button>
                        <button
                            onClick={() => setActiveTab('shop')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'shop'
                                    ? 'bg-white text-brand-600 shadow-md scale-105'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Store size={18} />
                            For Print Shops
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === 'customer' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: activeTab === 'customer' ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-brand-100 transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h4>
                                    <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
