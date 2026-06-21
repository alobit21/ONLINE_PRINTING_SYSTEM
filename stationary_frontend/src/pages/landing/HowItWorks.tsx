
import { FileUp, Search, Sliders, CreditCard, Printer, CheckCircle } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileUp,
      title: 'Upload',
      description: 'Securely upload your document to the platform.',
    },
    {
      icon: Search,
      title: 'Analyze',
      description: 'Automatically detect pages, format, and print settings.',
    },
    {
      icon: Sliders,
      title: 'Optimize',
      description: 'Choose cost-effective print configurations.',
    },
    {
      icon: CheckCircle,
      title: 'Match Shop',
      description: 'Find a nearby verified print partner.',
    },
    {
      icon: CreditCard,
      title: 'Pay & Print',
      description: 'Complete secure payment and start printing.',
    },
    {
      icon: Printer,
      title: 'Collect',
      description: 'Pick up your printed documents when ready.',
    },
  ];

  return (
    <section className="bg-hp-primary py-20 lg:py-[80px] transition-colors duration-300">
      <div className="section-container">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-blue-200 mb-4">
            The Process
          </div>

          <h2 className="text-[56px] font-medium leading-none text-white mb-6">
            Simple workflow from upload to collection
          </h2>

          <p className="text-lg text-blue-50 leading-relaxed">
            A streamlined 6-step process that connects your documents
            directly to professional print shops near you.
          </p>

        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            const alignmentClass = index % 2 === 0
              ? "items-start text-left"
              : "items-end text-right sm:items-start sm:text-left";

            return (
              <div
                key={step.title}
                className={`flex flex-col relative ${alignmentClass}`}
              >

                {/* Responsive connecting arrows */}
                {index % 3 !== 2 && index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-[48px] -right-8 w-8 -translate-y-1/2 text-white/40 items-center justify-center">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12H28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
                      <path d="M22 6L28 12L22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {index % 2 !== 1 && index < steps.length - 1 && (
                  <div className="hidden sm:flex lg:hidden absolute top-[48px] -right-8 w-8 -translate-y-1/2 text-white/40 items-center justify-center">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12H28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
                      <path d="M22 6L28 12L22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Mobile zig-zag arrow: Left to Right (Odd -> Even) */}
                {index % 2 === 0 && index < steps.length - 1 && (
                  <div className="flex sm:hidden absolute -bottom-8 left-8 text-white/40 z-0">
                    <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 0 V 24 Q 20 36 32 36 H 112" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                      <path d="M104 28 L 114 36 L 104 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Mobile zig-zag arrow: Right to Left (Even -> Odd) */}
                {index % 2 !== 0 && index < steps.length - 1 && (
                  <div className="flex sm:hidden absolute -bottom-8 right-8 text-white/40 z-0">
                    <svg width="120" height="48" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 0 V 24 Q 100 36 88 36 H 8" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                      <path d="M16 28 L 6 36 L 16 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Step number */}
                <div className="text-sm text-white/70 font-medium mb-4 relative z-10">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 text-white">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="text-[20px] font-medium text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[15px] text-white/80 leading-relaxed">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
