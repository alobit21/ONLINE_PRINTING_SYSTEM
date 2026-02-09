import React from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, Search, ZapOff, Trash2, AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
    const problems = [
        {
            icon: <Clock className="text-error" />,
            title: 'Long Queues',
            description: 'Wasting hours waiting in line at print shops during peak times.',
        },
        {
            icon: <DollarSign className="text-error" />,
            title: 'Hidden Costs',
            description: 'Unclear pricing until the very end of the transaction.',
        },
        {
            icon: <Search className="text-error" />,
            title: 'Hard to Find',
            description: 'Struggling to locate reliable shops that handle specific file formats.',
        },
        {
            icon: <ZapOff className="text-error" />,
            title: 'Manual Workflow',
            description: 'Using USB sticks or emailing files manually, which is insecure and slow.',
        },
        {
            icon: <Trash2 className="text-error" />,
            title: 'Wasted Resources',
            description: 'Printing more than needed because you could not optimize the layout.',
        },
        {
            icon: <AlertCircle className="text-error" />,
            title: 'No Real-time Updates',
            description: 'Not knowing if your order is ready until you physically arrive.',
        },
    ];

    return (
        <section id="problems" className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-4">The Challenge</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Stop wasting time with traditional printing methods.
                    </h3>
                    <p className="text-lg text-slate-600">
                        Printing shouldn't be a headache. We've identified the biggest frustrations users face and built a better way.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl border border-slate-100 bg-slate-50 card-hover flex flex-col gap-4"
                        >
                            <div className="bg-white p-3 rounded-2xl w-fit shadow-sm border border-slate-100">
                                {problem.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900">{problem.title}</h4>
                            <p className="text-slate-600 leading-relaxed">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
