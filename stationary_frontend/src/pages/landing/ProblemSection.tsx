import { motion } from 'framer-motion';
import { Clock, DollarSign, Search, ZapOff, Trash2, AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
  const problems = [
    { icon: <Clock className="text-red-400" />, title: 'Long Queues', description: 'Wasting hours waiting in line at print shops during peak university times.', color: 'bg-red-900/20', iconBg: 'bg-red-500/10', border: 'border-red-500/30' },
    { icon: <DollarSign className="text-amber-400" />, title: 'Hidden Costs', description: 'Unclear pricing until the very end, leading to budget surprises.', color: 'bg-amber-900/20', iconBg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { icon: <Search className="text-blue-400" />, title: 'Hard to Find', description: 'Struggling to locate reliable shops for specific quality requirements.', color: 'bg-blue-900/20', iconBg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { icon: <ZapOff className="text-purple-400" />, title: 'Manual Workflow', description: 'Insecure file transfers via USB sticks or cluttered email threads.', color: 'bg-purple-900/20', iconBg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    { icon: <Trash2 className="text-green-400" />, title: 'Wasted Resources', description: 'Printing more than needed because you could not preview or optimize.', color: 'bg-green-900/20', iconBg: 'bg-green-500/10', border: 'border-green-500/30' },
    { icon: <AlertCircle className="text-indigo-400" />, title: 'No Updates', description: 'Not knowing if your order is actually ready until you arrive.', color: 'bg-indigo-900/20', iconBg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  ];

  return (
    <section id="problems" className="section-padding relative overflow-hidden bg-gray-900">
      
      {/* Subtle ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-red-700/20 filter blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-700/20 filter blur-2xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="heading-centered">
          <h2 className="text-brand-400 font-black tracking-widest uppercase text-xs mb-4">The Challenge</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Stop wasting time with traditional printing.
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg font-medium">
            Traditional printing processes are fragmented and frustrating. We've identified the core friction points and eliminated them for good.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-gray-800/80 backdrop-blur-lg border border-gray-700 shadow-md hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={`${problem.iconBg} ${problem.border} p-4 rounded-2xl w-fit mb-6 flex items-center justify-center group-hover:scale-110 transition-transform border`}>
                {problem.icon}
              </div>
              <h4 className="text-2xl font-extrabold text-white mb-3">{problem.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};