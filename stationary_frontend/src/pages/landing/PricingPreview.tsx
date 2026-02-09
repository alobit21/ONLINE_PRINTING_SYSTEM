import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPreview = () => {
    const [activeRole, setActiveRole] = useState<'customer' | 'shop'>('customer');

    const customerPlans = [
        {
            name: 'Pay As You Go',
            price: 'Free',
            description: 'Perfect for occasional printing needs.',
            features: ['Upload up to 50MB', 'Standard Queue', 'Public Shops Access', 'Digital Receipts'],
            notIncluded: ['Premium Support', 'Batch Discounts', 'Priority Processing'],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Premium Student',
            price: '$4.99',
            period: 'mo',
            description: 'Ideal for busy students with high volume.',
            features: ['20% off every print', 'Priority Queue', 'Cloud Storage (2GB)', 'Late Night Collection', 'Rollover Credits'],
            cta: 'Try Premium',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For corporate teams and departments.',
            features: ['Unlimited Storage', 'Dedicated Support', 'Custom Billing', 'API Access', 'Team Management'],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const shopPlans = [
        {
            name: 'Starter Shop',
            price: 'Free',
            description: 'Get your shop online and start receiving orders.',
            features: ['Basic Dashboard', 'Email Support', 'Up to 5 orders/day', 'Standard Listing'],
            notIncluded: ['Analytics', 'Top of Search', 'Featured Status'],
            cta: 'List Shop Free',
            popular: false
        },
        {
            name: 'Pro Vendor',
            price: '$29',
            period: 'mo',
            description: 'Grow your business with advanced management.',
            features: ['Unlimited Orders', 'Full Analytics', 'Priority in Search', 'SMS Notifications', 'Marketing Tools'],
            cta: 'Go Pro',
            popular: true
        },
        {
            name: 'Franchise',
            price: 'Custom',
            description: 'For multiple locations and large vendors.',
            features: ['Multi-store Dashboard', 'API Integration', 'Account Manager', 'Custom Promotion', 'Branded UI'],
            cta: 'Talk to Us',
            popular: false
        }
    ];

    const plans = activeRole === 'customer' ? customerPlans : shopPlans;

    return (
        <section id="pricing" className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">Pricing Plans</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                        Simple, transparent pricing.
                    </h3>

                    <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl mb-8 shadow-sm">
                        <button
                            onClick={() => setActiveRole('customer')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeRole === 'customer' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-slate-500'
                                }`}
                        >
                            For Customers
                        </button>
                        <button
                            onClick={() => setActiveRole('shop')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeRole === 'shop' ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-slate-500'
                                }`}
                        >
                            For Shops
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-[2.5rem] p-10 border transition-all duration-300 ${plan.popular ? 'border-brand-500 shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
                                <p className="text-slate-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                                {plan.period && <span className="text-slate-500 font-medium">/{plan.period}</span>}
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-brand-50 p-1 rounded-full text-brand-600">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded?.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 opacity-40">
                                        <div className="bg-slate-50 p-1 rounded-full text-slate-400">
                                            <X size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-400 text-sm font-medium line-through">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${plan.popular
                                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-200'
                                        : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                            >
                                {plan.cta}
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
