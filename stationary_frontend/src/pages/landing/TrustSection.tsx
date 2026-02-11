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
        <section className="section-padding bg-white overflow-hidden text-center">
            <div className="section-container">
                {/* Giant Stats Card */}
                <div className="bg-brand-600 rounded-[4rem] p-16 lg:p-24 mb-32 relative overflow-hidden shadow-[0_48px_96px_-16px_rgba(99,102,241,0.3)]">
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
                                <div className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter">{stat.value}</div>
                                <div className="text-brand-100 text-xs lg:text-sm font-black uppercase tracking-[0.2em]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center text-left">
                    <div className="flex-1">
                        <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">Trust Infrastructure</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                            Safety and security<br />baked into the core.
                        </h3>

                        <div className="space-y-10 mt-12">
                            <div className="flex gap-8 group">
                                <div className="bg-slate-50 p-5 rounded-3xl h-fit border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                                    <Shield className="text-brand-600" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Vault-grade Encryption</h4>
                                    <p className="text-slate-500 font-semibold leading-relaxed">Your documents are encrypted end-to-end and purged immediately after professional printing is confirmed.</p>
                                </div>
                            </div>
                            <div className="flex gap-8 group">
                                <div className="bg-slate-50 p-5 rounded-3xl h-fit border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors">
                                    <Lock className="text-brand-600" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-2">Authenticated Transactions</h4>
                                    <p className="text-slate-500 font-semibold leading-relaxed">We utilize industry-leading payment gateways ensuring your financial credentials never touch our perimeter.</p>
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
                                className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative hover:bg-white hover:shadow-2xl transition-all duration-500"
                            >
                                <Quote className="absolute top-10 right-10 text-slate-200" size={56} strokeWidth={1.5} />
                                <div className="flex items-center gap-1.5 text-warning mb-8">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-700 text-xl font-bold tracking-tight mb-10 relative z-10 italic leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-5">
                                    <img src={t.image} alt={t.author} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                                    <div>
                                        <h5 className="font-black text-slate-900 text-lg leading-tight">{t.author}</h5>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-wider mt-1">{t.role}</p>
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
