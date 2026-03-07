import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
  return (
    <section className="section-padding bg-gray-900 relative overflow-hidden">
      <div className="section-container">
        <div className="relative rounded-3xl p-16 md:p-24 text-center text-white bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg overflow-hidden">

          {/* Subtle geometric background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-600 to-purple-700 filter blur-3xl" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-purple-700 to-brand-500 filter blur-2xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-4xl mx-auto"
          >

            {/* Rocket Icon Card */}
            <div className="mx-auto w-fit mb-10 p-4 rounded-2xl bg-gray-800/40 backdrop-blur-md border border-gray-700/30 flex items-center justify-center shadow-lg">
              <Rocket size={40} className="text-brand-400" />
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
              Start printing <br className="hidden md:block" /> smarter today.
            </h2>

            {/* Subtext */}
            <p className="text-gray-300 mb-12 text-lg md:text-xl max-w-3xl mx-auto font-semibold">
              Join 50,000+ users and 850+ print shops who have already
              digitalized their entire printing workflow.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center gap-4 transition-all shadow-md hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
              >
                Upload Document
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
              </Link>
              <Link
                to="/checkout"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-green-500 text-green-400 font-bold text-xl flex items-center justify-center gap-3 transition-all hover:bg-green-600 hover:text-white hover:scale-105 transform hover:-translate-y-1"
              >
                Start Guest Order
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
              </Link>
              <Link
                to="/register?role=shop"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-brand-500 text-white font-bold text-xl flex items-center justify-center gap-3 transition-all hover:bg-brand-600 hover:scale-105 transform hover:-translate-y-1"
              >
                Register Shop
              </Link>
            </div>

            {/* Features / Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-2">No Credit Card Needed</div>
              <div className="flex items-center gap-2 border-l border-gray-600 pl-10">Instant Deployment</div>
              <div className="flex items-center gap-2 border-l border-gray-600 pl-10">24/7 Global Support</div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};