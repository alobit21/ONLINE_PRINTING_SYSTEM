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
        <section id="pricing" className="bg-cloud py-20 lg:py-[80px] overflow-hidden text-center transition-colors duration-300">
            <div className="section-container">
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="text-sm font-semibold uppercase tracking-[0.7px] text-hp-primary mb-4">Pricing Tables</div>
                    <h3 className="text-[42px] lg:text-[56px] font-medium text-ink mb-6 leading-[1.1] tracking-[-1px]">
                        Transparent for everyone
                    </h3>

                    <div className="inline-flex border border-fog dark:border-charcoal rounded-full overflow-hidden mt-6">
                        <button
                            onClick={() => setActiveRole('customer')}
                            className={`px-6 py-2 text-sm font-medium transition-colors ${
                                activeRole === 'customer' 
                                    ? 'bg-ink text-canvas' 
                                    : 'bg-canvas text-charcoal'
                            }`}
                        >
                            For Customers
                        </button>
                        <button
                            onClick={() => setActiveRole('shop')}
                            className={`px-6 py-2 text-sm font-medium border-l border-fog dark:border-charcoal transition-colors ${
                                activeRole === 'shop' 
                                    ? 'bg-ink text-canvas' 
                                    : 'bg-canvas text-charcoal'
                            }`}
                        >
                            For Shops
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-canvas rounded-[16px] p-8 border transition-all duration-300 ${
                                plan.popular 
                                    ? 'border-hp-primary shadow-[0_8px_32px_-12px_rgba(2,74,216,0.3)] z-10 -translate-y-2' 
                                    : 'border-fog dark:border-charcoal shadow-[0_2px_8px_rgba(26,26,26,0.08)]'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-hp-primary text-canvas text-xs font-semibold uppercase tracking-[0.7px] px-4 py-1.5 rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h4 className="text-2xl font-medium text-ink mb-2">{plan.name}</h4>
                                <p className="text-charcoal text-sm leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline justify-center gap-1 mb-8">
                                <span className="text-[44px] font-medium text-ink leading-none">{plan.price}</span>
                                {plan.period && <span className="text-charcoal font-medium">/{plan.period}</span>}
                            </div>

                            <div className="space-y-4 mb-10 text-left">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="text-hp-primary mt-1">
                                            <Check size={16} />
                                        </div>
                                        <span className="text-charcoal text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded?.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 opacity-50">
                                        <div className="text-steel mt-1">
                                            <X size={16} />
                                        </div>
                                        <span className="text-steel text-sm leading-relaxed line-through">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/register"
                                className={`w-full py-3 rounded-[4px] flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.7px] transition-colors ${
                                    plan.popular
                                        ? 'bg-hp-primary text-canvas hover:bg-hp-primary/90'
                                        : 'bg-ink text-canvas hover:bg-ink/90'
                                }`}
                            >
                                {plan.cta}
                                <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
