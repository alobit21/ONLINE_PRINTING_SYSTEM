import { Link } from 'react-router-dom';

export const CallToAction = () => {
  return (
    <section className="bg-canvas py-20 lg:py-[80px] transition-colors duration-300">
      <div className="section-container">
        
        {/* Card Container */}
        <div className="relative bg-black dark:bg-canvas rounded-[16px] overflow-hidden flex min-h-[440px] md:min-h-[480px]">
          
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1600" 
              alt="People working in office" 
              className="w-full h-full object-cover object-center md:object-right"
            />
          </div>

          {/* Gradient Overlays for Fade Effect */}
          {/* Mobile Overlay: mostly black, fading at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-canvas via-black/90 dark:via-canvas/90 to-black/20 dark:to-canvas/20 md:hidden"></div>
          
          {/* Desktop Overlay: Solid black on left, fading to right */}
          <div className="absolute inset-y-0 left-0 w-full md:w-[45%] bg-black dark:bg-canvas hidden md:block"></div>
          <div className="absolute inset-y-0 left-[45%] w-[30%] bg-gradient-to-r from-black dark:from-canvas to-transparent hidden md:block"></div>

          {/* Content Container */}
          <div className="relative z-10 w-full md:w-[60%] lg:w-[50%] p-10 md:p-16 lg:p-20 flex flex-col justify-center text-left mt-auto md:mt-0">
            
            {/* Kicker / Subtitle */}
            <span className="text-[14px] font-medium text-white mb-4 tracking-[0.2px]">
              Stationary Print Marketplace
            </span>

            {/* Headline */}
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-medium text-white leading-[1.1] tracking-[-1px] mb-6">
              Start printing smarter today
            </h2>

            {/* Paragraph */}
            <p className="text-[15px] md:text-base text-gray-300 mb-10 leading-relaxed max-w-[420px]">
              Upload your documents, choose a print option, and connect instantly with verified print shops near you.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-white text-black hover:bg-gray-100 px-6 h-10 flex items-center justify-center rounded-[4px] text-[14px] font-semibold transition-colors w-max"
              >
                Learn More
              </Link>
            </div>

          </div>
          
        </div>

      </div>
    </section>
  );
};
