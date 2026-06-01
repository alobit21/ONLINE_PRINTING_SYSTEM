
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDashboard from '../../assets/hero-dashboard.png';

export const HeroSection = () => {
  return (
    <section className="bg-white pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="section-container">
        <div className="relative">

          {/* HP Chevron Decorations */}
          <div className="hidden lg:block absolute -left-16 top-8 bottom-8 w-16 bg-brand-600 skew-x-[-25deg]" />
          <div className="hidden lg:block absolute -right-16 top-8 bottom-8 w-16 bg-brand-600 skew-x-[-25deg]" />

          {/* Hero Card */}
          <div
            className="
              relative
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-[0_2px_8px_rgba(26,26,26,0.08)]
              p-8
              lg:p-12
            "
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-2 lg:order-1"
              >
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                  <img
                    src={heroDashboard}
                    alt="Print platform dashboard"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-1 lg:order-2"
              >
                <span
                  className="
                    block
                    text-sm
                    font-semibold
                    tracking-[0.7px]
                    uppercase
                    text-brand-600
                    mb-4
                  "
                >
                  Document Printing Platform
                </span>

                <h1
                  className="
                    text-5xl
                    lg:text-7xl
                    font-medium
                    leading-none
                    text-[#1a1a1a]
                    mb-6
                  "
                >
                  Print documents
                  <br />
                  from trusted
                  <br />
                  local partners.
                </h1>

                <p
                  className="
                    text-lg
                    text-[#3d3d3d]
                    leading-relaxed
                    max-w-xl
                    mb-10
                  "
                >
                  Upload files, compare options, and collect
                  high-quality prints from nearby professional
                  print shops. Faster ordering, transparent
                  pricing, and reliable results.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">

                  <Link
                    to="/register"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      h-11
                      px-6
                      rounded
                      bg-brand-600
                      text-white
                      text-sm
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                    "
                  >
                    Get Started
                    <ChevronRight size={18} />
                  </Link>

                  <Link
                    to="/register?role=shop"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      h-11
                      px-6
                      rounded
                      border
                      border-[#1a1a1a]
                      text-[#1a1a1a]
                      text-sm
                      font-semibold
                      uppercase
                      tracking-[0.7px]
                    "
                  >
                    Register Shop
                  </Link>
                </div>

                <div className="space-y-3 text-sm text-[#3d3d3d]">
                  <div>✓ 500+ Print Partners</div>
                  <div>✓ Same-Day Pickup Available</div>
                  <div>✓ High-Quality Professional Printing</div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

