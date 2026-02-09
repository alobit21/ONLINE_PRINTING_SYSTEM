import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, Star, Quote } from 'lucide-react';

export const TrustSection = () => {
    const stats = [
        { label: 'Documents Printed', value: '1.2M+' },
        { label: 'Active Customers', value: '50k+' },
        { label: 'Partner Shops', value: '850+' },
        { label: 'Rating', value: '4.9/5' },
    ];

    const testimonials = [
        {
            text: "The cost optimization tool saved me $50 on my final semester project. It's a game changer for students.",
            author: "Sarah Jenkins",
            role: "Medical Student",
            image: "https://i.pravatar.cc/100?img=32"
        },
        {
            text: "Joining Sationary doubled our daily orders within the first month. The ordering system is much better than WhatsApp.",
            author: "Michael Chen",
            role: "Shop Owner at Campus Prints",
            image: "https://i.pravatar.cc/100?img=12"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                {/* Stats Grid */}
                <div className="bg-brand-600 rounded-[3rem] p-12 mb-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                                <div className="text-brand-100 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="flex-1">
                        <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">Trusted by Thousands</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Safety and security comes first.
                        </h3>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="bg-slate-100 p-4 rounded-2xl h-fit">
                                    <Shield className="text-brand-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">Military-grade Encryption</h4>
                                    <p className="text-slate-600">All your documents are encrypted during transit and automatically deleted after successful printing.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="bg-slate-100 p-4 rounded-2xl h-fit">
                                    <Lock className="text-brand-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">Secure Payments</h4>
                                    <p className="text-slate-600">We partner with leading payment providers to ensure your financial information is never stored on our servers.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative"
                            >
                                <Quote className="absolute top-8 right-8 text-slate-200" size={48} />
                                <div className="flex items-center gap-1 text-warning mb-6">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-700 text-lg italic mb-8 relative z-10 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full ring-4 ring-white" />
                                    <div>
                                        <h5 className="font-bold text-slate-900">{t.author}</h5>
                                        <p className="text-slate-500 text-xs font-medium">{t.role}</p>
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
