import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Building2, School, Landmark } from 'lucide-react';

export const UseCases = () => {
    const useCases = [
        {
            icon: <GraduationCap size={40} />,
            title: 'Students',
            description: 'Print lecture notes, assignments, and research papers instantly before class.',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
        },
        {
            icon: <Briefcase size={40} />,
            title: 'Professionals',
            description: 'Get reports, business cards, and presentations ready for your next big meeting.',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
        },
        {
            icon: <Building2 size={40} />,
            title: 'Small Businesses',
            description: 'Bulk print invoices, brochures, and marketing materials with cost-saving tools.',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800'
        },
        {
            icon: <School size={40} />,
            title: 'Educational Institutions',
            description: 'Manage department-wide printing and exam paper distribution securely.',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800'
        },
    ];

    return (
        <section id="use-cases" className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">Who uses Sationary?</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Designed for every printing scenario.
                        </h3>
                    </div>
                    <p className="text-slate-600 text-lg max-w-sm">
                        Whether it's a single page or a thousand-copy run, our platform adapts to your scale.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl"
                        >
                            <img
                                src={useCase.image}
                                alt={useCase.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <div className="bg-brand-600/30 backdrop-blur-md p-3 rounded-2xl w-fit mb-4 border border-white/20">
                                    {useCase.icon}
                                </div>
                                <h4 className="text-2xl font-bold mb-2">{useCase.title}</h4>
                                <p className="text-slate-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {useCase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
