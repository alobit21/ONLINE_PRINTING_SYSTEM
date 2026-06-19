import { motion } from 'framer-motion';
import { Shield, Lock, Star, Quote } from 'lucide-react';

export const TrustSection = () => {
    const stats = [
        { label: 'Printed Items', value: '1.2M+' },
        { label: 'Active Users', value: '50k+' },
        { label: 'Global Shops', value: '850+' },
        { label: 'Satisfaction', value: '4.9/5' },
    ];

    const testimonials = [
        {
            text: "The budget analysis tool is incredible. As a final year student, I was able to optimize my thesis printing and save significantly.",
            author: "Sarah Jenkins",
            role: "Medical Student",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
        },
        {
            text: "We digitalized our entire physical queue. Our shop throughput increased by 200% within the first two months.",
            author: "Michael Chen",
            role: "Owner, Campus Prints",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
        }
    ];

    return (
        <section className="bg-canvas py-20 lg:py-[80px] overflow-hidden transition-colors duration-300">
            <div className="section-container">
                {/* Giant Stats */}
                <div className="bg-hp-primary rounded-[16px] p-12 lg:p-20 mb-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col gap-2"
                            >
                                <div className="text-5xl lg:text-7xl font-medium text-canvas leading-none tracking-tight text-center">{stat.value}</div>
                                <div className="text-cloud text-xs lg:text-sm font-semibold uppercase tracking-[0.7px] text-center">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center text-left">
                    <div className="flex-1">
                        <h2 className="text-hp-primary font-semibold tracking-[0.7px] uppercase text-sm mb-4">Trust Infrastructure</h2>
                        <h3 className="text-[42px] lg:text-[56px] font-medium text-ink mb-8 leading-[1.1] tracking-[-1px]">
                            Safety and security baked into the core
                        </h3>

                        <div className="space-y-10 mt-12">
                            <div className="flex gap-6 group">
                                <div className="mt-1">
                                    <Shield className="text-hp-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-ink mb-2">Vault-grade Encryption</h4>
                                    <p className="text-charcoal leading-relaxed">Your documents are encrypted end-to-end and purged immediately after professional printing is confirmed.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 group">
                                <div className="mt-1">
                                    <Lock className="text-hp-primary" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-ink mb-2">Authenticated Transactions</h4>
                                    <p className="text-charcoal leading-relaxed">We utilize industry-leading payment gateways ensuring your financial credentials never touch our perimeter.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 gap-10 w-full">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col relative"
                            >
                                <Quote className="absolute -top-4 -left-4 text-fog dark:text-charcoal opacity-50" size={48} />
                                <div className="flex items-center gap-1.5 text-yellow-500 mb-6 relative z-10">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-ink text-lg mb-8 relative z-10 leading-relaxed max-w-lg">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h5 className="font-medium text-ink text-base">{t.author}</h5>
                                        <p className="text-charcoal text-sm mt-0.5">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
