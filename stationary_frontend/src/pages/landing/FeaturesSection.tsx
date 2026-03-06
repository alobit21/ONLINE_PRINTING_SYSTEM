import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, ShieldCheck, History, MousePointer2, TrendingUp, Users, PieChart } from 'lucide-react';

export const FeaturesSection = () => {
    const [activeTab, setActiveTab] = useState<'customer' | 'shop'>('customer');

    const customerFeatures = [
        {
            icon: <MousePointer2 className="text-brand-400" />,
            title: 'One-Click Upload',
            description: 'Upload multiple documents simultaneously. Support for PDF, DOCX, and high-res images.',
        },
        {
            icon: <ShieldCheck className="text-brand-400" />,
            title: 'Secure Vault',
            description: 'Encrypted storage and secure payment processing to protect your intellectual property.',
        },
        {
            icon: <History className="text-brand-400" />,
            title: 'Smart Reordering',
            description: 'One-tap reordering for frequent university reports or business documents.',
        },
        {
            icon: <TrendingUp className="text-brand-400" />,
            title: 'Cost Intelligence',
            description: 'AI-driven suggestions to optimize page layouts and reduce total printing spend.',
        },
    ];

    const shopFeatures = [
        {
            icon: <PieChart className="text-brand-400" />,
            title: 'Job Dispatcher',
            description: 'Efficient industrial-grade management system to organize and prioritize your print queue.',
        },
        {
            icon: <Users className="text-brand-400" />,
            title: 'Demand Analytics',
            description: 'In-depth reporting on peak traffic hours and your most popular printing services.',
        },
        {
            icon: <TrendingUp className="text-brand-400" />,
            title: 'Growth Accelerator',
            description: 'Automated marketing tools to reach local campus demographics and neighboring offices.',
        },
        {
            icon: <Store className="text-brand-400" />,
            title: 'Digital Shopfront',
            description: 'A professional online presence for your local shop without the overhead of complex IT.',
        },
    ];

    const features = activeTab === 'customer' ? customerFeatures : shopFeatures;

    return (
        <section
            id="features"
            className="section-padding relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white"
        >
            {/* background glow to differentiate from previous section */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none"></div>

            <div className="section-container relative z-10">
                <div className="heading-centered">
                    <h2 className="text-brand-400 font-black tracking-widest uppercase text-xs mb-4">
                        Core Ecosystem
                    </h2>

                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
                        Features that drive growth.
                    </h3>

                    {/* Tabs */}
                    <div className="inline-flex p-1.5 bg-gray-900/70 backdrop-blur-xl border border-gray-700/40 rounded-[1.5rem] shadow-lg mt-8">
                        <button
                            onClick={() => setActiveTab('customer')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${
                                activeTab === 'customer'
                                    ? 'bg-brand-600 text-white shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <User size={18} />
                            For Customers
                        </button>

                        <button
                            onClick={() => setActiveTab('shop')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${
                                activeTab === 'shop'
                                    ? 'bg-brand-600 text-white shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Store size={18} />
                            For Print Shops
                        </button>
                    </div>
                </div>

                <div className="mt-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-10 rounded-[2.5rem] border border-gray-700/40
                                    bg-gradient-to-br from-gray-900/90 to-gray-800/80
                                    backdrop-blur-xl
                                    hover:-translate-y-3
                                    hover:shadow-[0_25px_70px_rgba(0,0,0,0.9)]
                                    transition-all duration-500 group"
                                >
                                    <div className="w-16 h-16 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-600/20 transition-all">
                                        {feature.icon}
                                    </div>

                                    <h4 className="text-xl font-bold mb-4">
                                        {feature.title}
                                    </h4>

                                    <p className="text-gray-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};