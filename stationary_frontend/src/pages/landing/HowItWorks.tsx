import { motion } from 'framer-motion';
import { FileUp, Search, Sliders, CreditCard, Printer, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
    const steps = [
        { icon: <FileUp size={34} />, title: 'Upload', description: 'Quickly upload your files securely.' },
        { icon: <Search size={34} />, title: 'Analyze', description: 'Auto-detecting page counts and colors.' },
        { icon: <Sliders size={34} />, title: 'Optimize', description: 'Select the best cost-saving options.' },
        { icon: <CheckCircle size={34} />, title: 'Match Shop', description: 'Find the best shop based on location.' },
        { icon: <CreditCard size={34} />, title: 'Pay & Print', description: 'Secure payment and instant job start.' },
        { icon: <Printer size={34} />, title: 'Collect', description: 'Get notified when it is ready to pick up.' },
    ];

    return (
        <section
            id="how-it-works"
            className="section-padding relative overflow-hidden text-center bg-gradient-to-b from-gray-950 via-gray-900 to-black dark:from-gray-50 dark:via-gray-100 dark:to-white text-white dark:text-gray-900"
        >
            {/* ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="heading-centered">
                    <h2 className="text-brand-400 dark:text-brand-600 font-black tracking-widest uppercase text-xs mb-4">
                        The Process
                    </h2>

                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
                        Seamless workflow in seconds.
                    </h3>

                    <p className="text-gray-400 dark:text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We've revolutionized the document journey from your screen to the paper
                        with a frictionless 6-step automation system.
                    </p>
                </div>

                <div className="relative mt-20">

                    {/* glowing connection line */}
                    <div className="hidden lg:block absolute top-[70px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-700 to-transparent -z-0" />

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

                                {/* icon card */}
                                <div className="relative w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8
                                    bg-gradient-to-br from-gray-900 to-gray-800
                                    border border-gray-700/50
                                    shadow-[0_10px_40px_rgba(0,0,0,0.7)]
                                    text-brand-400
                                    backdrop-blur-xl
                                    transition-all duration-500
                                    group-hover:-translate-y-3
                                    group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)]
                                    group-hover:text-white
                                    group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-brand-500
                                ">

                                    {step.icon}

                                    {/* step number */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border border-gray-700 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md">
                                        0{index + 1}
                                    </div>

                                    {/* glow on hover */}
                                    <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 bg-brand-600/20 blur-xl transition duration-500"></div>
                                </div>

                                <h4 className="text-lg font-bold mb-2">
                                    {step.title}
                                </h4>

                                <p className="text-gray-400 text-sm max-w-[170px] leading-relaxed mx-auto">
                                    {step.description}
                                </p>

                            </motion.div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
};