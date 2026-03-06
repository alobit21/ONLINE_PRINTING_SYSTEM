import { motion } from 'framer-motion';
import { ChevronRight, Upload, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDashboard from '../../assets/hero-dashboard.png';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-900">
      
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-gradient-to-tr from-brand-900 to-brand-800 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-gradient-to-bl from-brand-800 to-brand-700 rounded-full blur-[100px]" />
      </div>

      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left: Hero Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-brand-400 mb-4 block lg:ml-1">
                Future of Workflow
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                Print <br className="hidden xl:block" />
                <span className="text-gradient-brand">Smarter.</span>
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-5 mb-8">
                <span className="text-xl md:text-3xl font-black text-gray-400 italic tracking-tight">Faster.</span>
                <div className="h-1.5 w-1.5 bg-brand-400 rounded-full opacity-50" />
                <span className="text-xl md:text-3xl font-black text-gray-400 italic tracking-tight">Closer.</span>
                <div className="h-1.5 w-1.5 bg-brand-400 rounded-full opacity-50" />
                <span className="text-xl md:text-3xl font-black text-white italic tracking-tight underline decoration-brand-800 decoration-8 underline-offset-4">
                  Reliable.
                </span>
              </div>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium mb-12 max-w-[640px] mx-auto lg:mx-0">
                All-in-one platform to upload, analyze, and print your documents at nearby professional shops. Save time, reduce costs, and experience high-quality printing instantly.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-16">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-2xl text-xl font-extrabold shadow-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] hover:-translate-y-1"
                >
                  Get Started Free
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?role=shop"
                  className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 px-10 py-5 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.03] hover:-translate-y-1 shadow-sm"
                >
                  Register Shop
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs md:text-sm text-gray-500 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" />
                  <span>Cloud Optimized</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-600 pl-6">
                  <CheckCircle2 size={18} className="text-success" />
                  <span>500+ Local Partners</span>
                </div>
                <div className="flex items-center gap-2 border-l border-gray-600 pl-6">
                  <CheckCircle2 size={18} className="text-success" />
                  <span>Zero Latency</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Dashboard Image */}
          <div className="flex-1 relative w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Soft glow behind dashboard */}
              <div className="absolute inset-0 bg-brand-600/10 blur-[80px] rounded-full scale-75" />

              {/* Glass card around dashboard */}
              <div className="relative glass p-2 lg:p-4 rounded-[2rem] shadow-2xl border-gray-700/40 overflow-hidden hover:rotate-1 transition-transform duration-700">
                <div className="bg-slate-900 rounded-[2rem] overflow-hidden">
                  <img
                    src={heroDashboard}
                    alt="Dashboard Interface"
                    className="w-full max-h-[500px] object-contain rounded-[2rem]"
                  />
                </div>
              </div>

              {/* Optional floating badges can stay here if needed */}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};