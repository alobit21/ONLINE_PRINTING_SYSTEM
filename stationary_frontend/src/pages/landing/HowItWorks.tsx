import { motion } from 'framer-motion';
import { FileUp, Search, Sliders, CreditCard, Printer, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        {
            icon: <FileUp size={36} />,
            title: 'Upload',
            description: 'Quickly upload your files securely.',
        },
        {
            icon: <Search size={36} />,
            title: 'Analyze',
            description: 'Auto-detecting page counts and colors.',
        },
        {
            icon: <Sliders size={36} />,
            title: 'Optimize',
            description: 'Select the best cost-saving options.',
        },
        {
            icon: <CheckCircle size={36} />,
            title: 'Match Shop',
            description: 'Find the best shop based on location.',
        },
        {
            icon: <CreditCard size={36} />,
            title: 'Pay & Print',
            description: 'Secure payment and instant job start.',
        },
        {
            icon: <Printer size={36} />,
            title: 'Collect',
            description: 'Get notified when it is ready to pick up.',
        },
    ];

    return (
        <section id="how-it-works" className="section-padding bg-white relative overflow-hidden text-center">
            <div className="section-container">
                <div className="heading-centered">
                    <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">The Process</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        Seamless workflow in seconds.
                    </h3>
                    <p className="paragraph-lead">
                        We've revolutionized the document journey from your screen to the paper
                        with a frictionless 6-step automation system.
                    </p>
                </div>

                <div className="relative mt-20">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[70px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-0" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-y-16 gap-x-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center group relative z-10"
                            >
                                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-3 group-hover:shadow-2xl">
                                    {step.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-black border-4 border-white shadow-md">
                                        0{index + 1}
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
                                <p className="text-slate-500 text-sm font-semibold max-w-[160px] leading-relaxed mx-auto">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
