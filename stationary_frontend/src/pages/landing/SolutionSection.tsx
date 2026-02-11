import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Navigation, Bell } from 'lucide-react';

export const SolutionSection = () => {
    const solutions = [
        {
            icon: <Sparkles className="text-brand-600" />,
            title: 'Smart Analysis',
            description: 'Our system analyzes documents for the optimal printing configuration automatically.',
            color: 'bg-indigo-50',
        },
        {
            icon: <BarChart3 className="text-brand-600" />,
            title: 'Auto Pricing',
            description: 'Get instant, transparent quotes based on your exact document requirements.',
            color: 'bg-blue-50',
        },
        {
            icon: <Navigation className="text-brand-600" />,
            title: 'Shop Matching',
            description: 'Locate the nearest certified print shop with real-time GPS matching.',
            color: 'bg-cyan-50',
        },
        {
            icon: <Bell className="text-brand-600" />,
            title: 'Live Tracking',
            description: 'Receive real-time notifications from the moment you upload to collection.',
            color: 'bg-violet-50',
        },
    ];

    return (
        <section id="solution" className="section-padding bg-white overflow-hidden">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1">
                        <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">The Solution</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                            A smarter way to handle<br />every print job.
                        </h3>
                        <p className="text-lg text-slate-600 mb-12 font-medium">
                            We bridge the gap between people needing quality prints and professional
                            shops looking to serve them efficiently.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {solutions.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                                >
                                    <div className={`p-3 rounded-xl ${item.color} w-fit mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-[540px]">
                        <motion.div
                            initial={{ opacity: 0, rotate: 5 }}
                            whileInView={{ opacity: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square"
                        >
                            <div className="absolute inset-0 bg-brand-200 rounded-[3rem] blur-[80px] opacity-30" />
                            <div className="relative z-10 glass p-8 h-full rounded-[3rem] shadow-2xl border-white/50 flex flex-col justify-between overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="h-2 w-16 bg-brand-100 rounded-full" />
                                        <div className="h-2 w-24 bg-slate-100 rounded-full" />
                                    </div>
                                    <div className="bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-full uppercase">Optimal Price Found</div>
                                </div>

                                <div className="flex-grow flex items-center justify-center my-10">
                                    <div className="bg-slate-900 w-full p-6 rounded-3xl shadow-lg border border-slate-800 float">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-8 w-8 bg-brand-500 rounded-lg" />
                                            <div className="h-2 w-32 bg-slate-700 rounded-full" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 w-full bg-slate-800 rounded-full" />
                                            <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-brand-600 p-6 rounded-3xl shadow-xl text-white transform translate-y-4">
                                    <p className="text-3xl font-black">$0.05 <span className="text-brand-200 text-xs uppercase ml-1 font-bold">per page</span></p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-100">Ready to print at Campus Shop B</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
