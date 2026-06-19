import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="bg-cloud dark:bg-ink pt-[100px] lg:pt-[136px] pb-12 overflow-hidden transition-colors duration-300">
        <div className="relative flex items-stretch px-0 min-h-[600px] w-full max-w-[1440px] mx-auto overflow-hidden">
          
          {/* Left Stripe */}
          <div
            className="hidden lg:block shrink-0 self-stretch w-[72px] bg-hp-primary"
            style={{ clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0 100%)' }}
          ></div>
          
          {/* Main Card */}
          <div className="flex-1 bg-canvas rounded-[16px] flex flex-col lg:flex-row overflow-hidden my-6 mx-4 lg:mx-0 p-8 shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            
            {/* Visual Column */}
            <div className="relative flex-1 min-h-[300px] lg:min-h-[480px]">
              <div className="rounded-[16px] overflow-hidden w-full h-full lg:min-h-[480px]">
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/9991fb2d-301d-4a5e-aab6-b86785b9494d.jpg"
                  alt="Print services"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Notification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-5 right-5 bg-canvas rounded-[16px] px-4 py-3 flex items-center gap-3 min-w-[230px] shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-fog dark:border-charcoal"
              >
                <div className="rounded-full bg-hp-primary/10 flex items-center justify-center shrink-0 w-8 h-8">
                  <Check size={16} className="text-hp-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink">
                    Order #1234 — Ready for Pickup
                  </div>
                  <div className="text-xs text-charcoal mt-0.5">
                    Notified via SMS · 2 min ago
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Copy Column */}
            <div className="flex-1 flex flex-col justify-center gap-6 mt-8 lg:mt-0 lg:pl-12 lg:pr-4">
              <div className="inline-flex">
                <span className="text-[12px] font-semibold text-hp-primary border border-hp-primary rounded-full px-3 py-1 tracking-[0.6px]">
                  FAST · RELIABLE · LOCAL PRINT
                </span>
              </div>
              
              <h1 className="font-medium text-ink text-[42px] lg:text-[68px] leading-[1.1] tracking-[-1px]">
                Print Documents Without Leaving Your Desk
              </h1>
              
              <p className="text-lg text-charcoal leading-[1.5] max-w-[420px]">
                Upload your files, we handle the printing. Get notified the
                moment your order is ready — pick up in-store or get it
                delivered.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/register"
                  className="bg-hp-primary hover:bg-hp-primary/90 text-canvas font-semibold rounded-[4px] px-6 h-11 flex items-center justify-center shrink-0 tracking-[0.7px] text-[14px] w-full sm:w-auto transition shadow-sm"
                >
                  UPLOAD & PRINT NOW
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-hp-primary hover:bg-hp-primary/10 font-semibold rounded-[4px] px-6 h-11 flex items-center justify-center border border-hp-primary shrink-0 tracking-[0.7px] text-[14px] w-full sm:w-auto transition"
                >
                  SEE HOW IT WORKS
                </Link>
              </div>
              
              <div className="inline-flex items-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-hp-primary shrink-0"></div>
                <span className="text-xs font-medium text-charcoal border border-fog dark:border-charcoal rounded-full px-3 py-1 bg-canvas">
                  500+ orders printed weekly
                </span>
              </div>
            </div>
            
          </div>
          
          {/* Right Stripe */}
          <div
            className="hidden lg:block shrink-0 self-stretch w-[72px] bg-hp-primary"
            style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 0 100%)' }}
          ></div>
          
        </div>
    </section>
  );
};
