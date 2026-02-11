import { motion } from 'framer-motion';
import { Clock, DollarSign, Search, ZapOff, Trash2, AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
    const problems = [
        {
            icon: <Clock className="text-error" />,
            title: 'Long Queues',
            description: 'Wasting hours waiting in line at print shops during peak university times.',
            color: 'bg-red-50',
        },
        {
            icon: <DollarSign className="text-error" />,
            title: 'Hidden Costs',
            description: 'Unclear pricing until the very end, leading to budget surprises.',
            color: 'bg-red-50',
        },
        {
            icon: <Search className="text-error" />,
            title: 'Hard to Find',
            description: 'Struggling to locate reliable shops for specific quality requirements.',
            color: 'bg-red-50',
        },
        {
            icon: <ZapOff className="text-error" />,
            title: 'Manual Workflow',
            description: 'Insecure file transfers via USB sticks or cluttered email threads.',
            color: 'bg-red-50',
        },
        {
            icon: <Trash2 className="text-error" />,
            title: 'Wasted Resources',
            description: 'Printing more than needed because you could not preview or optimize.',
            color: 'bg-red-50',
        },
        {
            icon: <AlertCircle className="text-error" />,
            title: 'No Updates',
            description: 'Not knowing if your order is actually ready until you arrive.',
            color: 'bg-red-50',
        },
    ];

    return (
        <section id="problems" className="section-padding bg-slate-50 relative overflow-hidden">
            <div className="section-container">
                <div className="heading-centered">
                    <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">The Challenge</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        Stop wasting time with traditional printing.
                    </h3>
                    <p className="paragraph-lead">
                        Traditional printing processes are fragmented and frustrating. We've
                        identified the core friction points and eliminated them for good.
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
                            className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className={`${problem.color} p-4 rounded-2xl w-fit mb-8 group-hover:scale-110 transition-transform`}>
                                {problem.icon}
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-4">{problem.title}</h4>
                            <p className="text-slate-600 leading-relaxed font-medium">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
