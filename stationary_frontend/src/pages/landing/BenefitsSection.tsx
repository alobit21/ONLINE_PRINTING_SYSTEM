import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import customerApp from '../../assets/customer-app.png';
import shopOwner from '../../assets/shop-owner.png';

export const BenefitsSection = () => {
    const customerBenefits = [
        'Save 40% on bulk printing',
        'Bypass all shop queues',
        '24/7 online job submission',
        'AI document optimization',
        'GPS-based shop discovery',
        'Contactless pickup slots',
    ];

    const shopBenefits = [
        '300% increase in revenue',
        'Automated queue routing',
        'Zero commission startup',
        'Advanced supply analytics',
        'Real-time digital payouts',
        'Integrated support portal',
    ];

    return (
        <section className="section-padding bg-slate-900 text-white overflow-hidden">
            <div className="section-container">
                <div className="heading-centered text-center">
                    <h2 className="text-brand-400 font-black tracking-widest uppercase text-xs mb-4">Why Sationary?</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
                        Real value, measurable results.
                    </h3>
                    <p className="paragraph-lead text-slate-400">
                        Our platform creates a win-win ecosystem where quality, speed, and
                        affordability meet professional scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative mt-24">
                    {/* Vertical Divider (Desktop) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800" />

                    {/* Customer Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-12"
                    >
                        <div className="bg-brand-600/10 border border-brand-500/20 p-10 rounded-[3rem]">
                            <h4 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <span className="bg-brand-600 text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">Students</span>
                                Happy & Productive
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {customerBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-brand-500/20 p-1 rounded-full text-brand-400">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold leading-tight">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative rounded-[3rem] overflow-hidden group">
                            <img
                                src={customerApp}
                                alt="Sationary App Experience"
                                className="w-full h-80 object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Shop Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-12"
                    >
                        <div className="bg-emerald-600/10 border border-emerald-500/20 p-10 rounded-[3rem]">
                            <h4 className="text-2xl font-black mb-8 flex items-center gap-3 text-emerald-400">
                                <span className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">Shop Owners</span>
                                Growth & Efficiency
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {shopBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold leading-tight">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative rounded-[3rem] overflow-hidden group">
                            <img
                                src={shopOwner}
                                alt="Professional Shop Success"
                                className="w-full h-80 object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
