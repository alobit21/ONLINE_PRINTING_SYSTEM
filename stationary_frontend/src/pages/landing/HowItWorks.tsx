import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, Search, Sliders, CreditCard, Printer, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            icon: <FileUp size={32} />,
            title: 'Upload',
            description: 'Upload your documents securely to our platform.',
        },
        {
            icon: <Search size={32} />,
            title: 'Analyze',
            description: 'Our system analyzes page counts, colors, and layouts.',
        },
        {
            icon: <Sliders size={32} />,
            title: 'Optimize',
            description: 'Choose the best settings for cost and quality.',
        },
        {
            icon: <CheckCircle size={32} />,
            title: 'Select Shop',
            description: 'Pick the nearest or highest rated print shop.',
        },
        {
            icon: <CreditCard size={32} />,
            title: 'Pay & Print',
            description: 'Pay securely and the shop starts printing instantly.',
        },
        {
            icon: <Printer size={32} />,
            title: 'Collect',
            description: 'Get notified when your order is ready for pickup.',
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">The Process</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Printing in 6 easy steps.
                    </h3>
                    <p className="text-lg text-slate-600">
                        We've streamlined the entire printing workflow from document upload to physical collection.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-brand-100 via-brand-400 to-brand-100 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                                    {step.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-bold border-4 border-slate-50">
                                        {index + 1}
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
