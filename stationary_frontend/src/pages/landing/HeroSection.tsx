import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="bg-canvas pt-[100px] lg:pt-[136px] pb-12 overflow-hidden transition-colors duration-300">
        <div className="relative flex items-center px-4 sm:px-6 lg:px-8 min-h-[600px] w-full max-w-[1440px] mx-auto gap-12">
          
          <div className="flex-1 flex flex-col lg:flex-row items-center w-full gap-12">
            
            {/* Visual Column */}
            <div className="relative flex-1 w-full min-h-[300px] lg:min-h-[480px]">
              <div className="rounded-[16px] overflow-hidden w-full h-full lg:min-h-[480px]">
                <img
                  src="https://storage.googleapis.com/banani-generated-images/generated-images/9991fb2d-301d-4a5e-aab6-b86785b9494d.jpg"
                  alt="Print services"
                  className="w-full h-full object-cover"
                />
              </div>
              

            </div>
            
            {/* Copy Column */}
            <div className="flex-1 flex flex-col justify-center gap-6 mt-8 lg:mt-0 lg:pl-12 lg:pr-4">
              <div className="text-sm font-semibold text-hp-primary uppercase tracking-[0.7px]">
                Fast · Reliable · Local Print
              </div>
              
              <h1 className="font-medium text-ink text-[36px] sm:text-[42px] lg:text-[68px] leading-[1.15] lg:leading-[1.1] tracking-[-1px]">
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
              
              <div className="flex items-center gap-2 pt-2 text-charcoal">
                <div className="w-1.5 h-1.5 rounded-full bg-hp-primary"></div>
                <span className="text-sm font-medium">500+ orders printed weekly</span>
              </div>
            </div>
            
          </div>
          
        </div>
    </section>
  );
};
