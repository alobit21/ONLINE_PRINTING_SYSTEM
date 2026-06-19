
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
    <section id="solution" className="bg-canvas py-20 lg:py-[80px] transition-colors duration-300">
      <div className="section-container">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT CONTENT */}
          <div>

            <div className="text-sm font-semibold uppercase tracking-[0.7px] text-hp-primary mb-4">
              The Solution
            </div>

            <h2 className="text-[56px] font-medium leading-none text-ink mb-6">
              A smarter way to handle every print job
            </h2>

            <p className="text-lg text-charcoal leading-relaxed mb-12 max-w-xl">
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
                      bg-canvas
                      border
                      border-fog dark:border-charcoal
                      rounded-[16px]
                      p-6
                      shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                    "
                  >
                    <div className="mb-4 text-hp-primary">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-medium text-ink mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-charcoal leading-relaxed">
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
            <div className="rounded-[16px] border border-fog dark:border-charcoal bg-canvas p-4 shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]">

              <img
                src="/images/solution.png"
                alt="Solution Dashboard"
                className="w-full h-auto object-contain rounded-[16px]"
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
 
