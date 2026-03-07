import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Navigation, Bell } from 'lucide-react';

export const SolutionSection = () => {
    const solutions = [
        {
            icon: <Sparkles className="text-brand-600" />,
            title: 'Smart Analysis',
            description: 'Our system analyzes documents for the optimal printing configuration automatically.',
            color: 'bg-indigo-900/30',
        },
        {
            icon: <BarChart3 className="text-brand-600" />,
            title: 'Auto Pricing',
            description: 'Get instant, transparent quotes based on your exact document requirements.',
            color: 'bg-blue-900/30',
        },
        {
            icon: <Navigation className="text-brand-600" />,
            title: 'Shop Matching',
            description: 'Locate the nearest certified print shop with real-time GPS matching.',
            color: 'bg-cyan-900/30',
        },
        {
            icon: <Bell className="text-brand-600" />,
            title: 'Live Tracking',
            description: 'Receive real-time notifications from the moment you upload to collection.',
            color: 'bg-violet-900/30',
        },
    ];

    return (
        <section id="solution" className="section-padding bg-gray-800 dark:bg-gray-100 overflow-hidden">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1">
                        <h2 className="text-brand-600 dark:text-brand-700 font-black tracking-widest uppercase text-xs mb-4">The Solution</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white dark:text-gray-900 mb-8 leading-tight">
                            A smarter way to handle<br />every print job.
                        </h3>
                        <p className="text-lg text-gray-300 dark:text-gray-700 mb-12 font-medium">
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
                                    className="p-8 rounded-[2rem] bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-200 hover:bg-gray-600 dark:hover:bg-gray-50 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className={`p-3 rounded-xl ${item.color} w-fit mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h4 className="text-lg font-black text-white dark:text-gray-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-400 dark:text-gray-600 font-medium leading-relaxed">{item.description}</p>
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
    
    {/* Ambient glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-700/20 via-purple-700/20 to-transparent rounded-[3rem] blur-[100px]" />

    {/* Main container */}
    <div className="relative z-10 backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/80 p-8 h-full rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-gray-700/50 flex flex-col justify-between overflow-hidden">

      {/* subtle light overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-[3rem]" />

      {/* Image container */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 rounded-2xl pointer-events-none" />
        
        <img
          src="/images/solution.png"
          alt="Stationary Solution Dashboard"
          className="relative w-full h-full object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>

    </div>
  </motion.div>
</div>
                </div>
            </div>
        </section>
    );
};
