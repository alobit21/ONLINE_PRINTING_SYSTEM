import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPreview = () => {
    const [activeRole, setActiveRole] = useState<'customer' | 'shop'>('customer');

    const customerPlans = [
        {
            name: 'Standard Account',
            price: 'Free',
            description: 'Pay only for what you print with no monthly fees.',
            features: ['Up to 50MB Uploads', 'Cloud Document Storage', 'GPS Shop Discovery', 'Live Order Tracking'],
            notIncluded: ['Volume Discounts', 'Priority Processing', 'Premium Support'],
            cta: 'Start Printing',
            popular: false
        },
        {
            name: 'Premium Member',
            price: '$4.99',
            period: 'mo',
            description: 'The preferred choice for active students and pro freelancers.',
            features: ['20% Fixed Discount', 'Priority Queue Access', 'Batch Document Analysis', 'Extended Storage (5GB)', 'Rollover Print Credits'],
            cta: 'Get Premium',
            popular: true
        },
        {
            name: 'Enterprise Hub',
            price: 'Custom',
            description: 'Tailored solutions for departments and corporate teams.',
            features: ['Dedicated Account Manager', 'Multi-user Management', 'API Direct Printing', 'Custom Billing APIs', 'SLA Guarantees'],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    const shopPlans = [
        {
            name: 'Basic Listing',
            price: 'Free',
            description: 'Bring your shop online and join the marketplace.',
            features: ['Shop Dashboard', 'Digital Job Intake', 'Up to 10 Orders/Day', 'Email Alerts'],
            notIncluded: ['Advanced Analytics', 'SMS Notifications', 'Priority Search Ranking'],
            cta: 'Join Now',
            popular: false
        },
        {
            name: 'Pro Merchant',
            price: '$29',
            period: 'mo',
            description: 'Everything you need to scale your local print business.',
            features: ['Unlimited Order Volume', 'SMS Integrated Alerts', 'Priority Badge in Search', 'Growth Analytics', 'Marketing Toolkit'],
            cta: 'Go Pro',
            popular: true
        },
        {
            name: 'Multi-Location',
            price: 'Custom',
            description: 'Centralized management for franchise printing chains.',
            features: ['Aggregated Dashboard', 'Franchise Billing', 'API Queue Directing', 'White-labeled UI', 'Priority 24/7 Support'],
            cta: 'Talk to Us',
            popular: false
        }
    ];

    const plans = activeRole === 'customer' ? customerPlans : shopPlans;

    return (
        <section id="pricing" className="section-padding bg-slate-50 overflow-hidden text-center">
            <div className="section-container">
                <div className="heading-centered">
                    <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">Pricing Tables</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        Transparent for everyone.
                    </h3>

                    <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm mt-8">
                        <button
                            onClick={() => setActiveRole('customer')}
                            className={`px-10 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${activeRole === 'customer' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            For Customers
                        </button>
                        <button
                            onClick={() => setActiveRole('shop')}
                            className={`px-10 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${activeRole === 'shop' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            For Shops
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-white rounded-[3rem] p-12 border transition-all duration-500 ${plan.popular ? 'border-brand-500 shadow-[0_40px_80px_-20px_rgba(99,102,241,0.2)] scale-105 z-10' : 'border-slate-100 shadow-xl'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h4 className="text-2xl font-black text-slate-900 mb-3">{plan.name}</h4>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline justify-center gap-1 mb-10">
                                <span className="text-6xl font-black text-slate-900 leading-none">{plan.price}</span>
                                {plan.period && <span className="text-slate-400 font-black text-lg">/{plan.period}</span>}
                            </div>

                            <div className="space-y-5 mb-12 text-left">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="bg-brand-50 p-1 rounded-full text-brand-600 flex-shrink-0">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <span className="text-slate-700 text-sm font-bold tracking-tight">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded?.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 opacity-30">
                                        <div className="bg-slate-50 p-1 rounded-full text-slate-400 flex-shrink-0">
                                            <X size={14} strokeWidth={4} />
                                        </div>
                                        <span className="text-slate-400 text-sm font-bold line-through">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black transition-all duration-300 transform hover:scale-[1.03] ${plan.popular
                                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-2xl shadow-brand-500/20'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'
                                    }`}
                            >
                                {plan.cta}
                                <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
