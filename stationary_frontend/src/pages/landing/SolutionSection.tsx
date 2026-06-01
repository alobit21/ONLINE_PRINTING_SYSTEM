
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Navigation, Bell } from 'lucide-react';

export const SolutionSection = () => {
  const solutions = [
    {
      icon: Sparkles,
      title: 'Smart Analysis',
      description:
        'Automatically detects optimal print settings from uploaded documents.',
    },
    {
      icon: BarChart3,
      title: 'Transparent Pricing',
      description:
        'Instant quotes based on document type, pages, and print settings.',
    },
    {
      icon: Navigation,
      title: 'Shop Matching',
      description:
        'Find nearby verified print shops with availability in real time.',
    },
    {
      icon: Bell,
      title: 'Live Tracking',
      description:
        'Get updates from upload to printing completion and pickup readiness.',
    },
  ];

  return (
    <section id="solution" className="bg-[#ffffff] py-20 lg:py-[80px]">
      <div className="section-container">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT CONTENT */}
          <div>

            <div className="text-sm font-semibold uppercase tracking-[0.7px] text-brand-600 mb-4">
              The Solution
            </div>

            <h2 className="text-[56px] font-medium leading-none text-[#1a1a1a] mb-6">
              A smarter way to handle every print job
            </h2>

            <p className="text-lg text-[#3d3d3d] leading-relaxed mb-12 max-w-xl">
              We connect users needing reliable printing with professional shops,
              creating a faster and more transparent ordering process.
            </p>

            {/* FEATURE LIST */}
            <div className="grid sm:grid-cols-2 gap-6">
              {solutions.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="
                      bg-white
                      border
                      border-[#e8e8e8]
                      rounded-2xl
                      p-6
                      shadow-[0_2px_8px_rgba(26,26,26,0.08)]
                    "
                  >
                    <div className="mb-4 text-brand-600">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#3d3d3d] leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">

            {/* HP-style chevron-safe frame */}
            <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">

              <img
                src="/images/solution.png"
                alt="Solution Dashboard"
                className="w-full h-auto object-contain rounded-2xl"
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
 
