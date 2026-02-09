import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const BenefitsSection = () => {
    const customerBenefits = [
        'Save up to 40% on printing costs',
        'Skip long shop queues forever',
        'Access 24/7 online ordering',
        'Real-time document optimization',
        'Nearby shop discovery via GPS',
        'Contactless pickup options',
    ];

    const shopBenefits = [
        '3x increase in order volume',
        'Automated queue management',
        'Zero commission on first 50 orders',
        'Detailed business analytics',
        'Instant digital payments',
        'Built-in customer support tools',
    ];

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-brand-400 font-bold tracking-wider uppercase text-sm mb-4">Why Choose Us</h2>
                    <h3 className="text-4xl md:text-5xl font-bold mb-6">
                        Real value for everyone.
                    </h3>
                    <p className="text-lg text-slate-400">
                        We bridge the gap between customers needing quality prints and shops looking to grow their business.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                    {/* Vertical Divider */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800" />

                    {/* Customer Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10 pr-0 lg:pr-12"
                    >
                        <div className="bg-brand-600/10 border border-brand-500/20 p-8 rounded-3xl">
                            <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span className="bg-brand-600 text-xs px-2 py-1 rounded">CUSTOMERS</span>
                                Happy & Productive
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {customerBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-brand-500/20 p-1 rounded-full text-brand-400">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-tight">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img
                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000"
                            alt="Customer using Sationary"
                            className="rounded-3xl object-cover h-64 w-full shadow-2xl opacity-80"
                        />
                    </motion.div>

                    {/* Shop Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-10 pl-0 lg:pl-12"
                    >
                        <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-3xl">
                            <h4 className="text-2xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
                                <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">SHOPS</span>
                                Growth & Efficiency
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {shopBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                                            <Check size={14} />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-tight">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <img
                            src="https://images.unsplash.com/photo-1562654501-a0ccc0af3fb1?auto=format&fit=crop&q=80&w=1000"
                            alt="Print shop owner"
                            className="rounded-3xl object-cover h-64 w-full shadow-2xl opacity-80"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
