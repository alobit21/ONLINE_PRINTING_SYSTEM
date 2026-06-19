 
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

            return (
              <div
                key={step.title}
                className="
                  bg-canvas
                  border
                  border-fog dark:border-charcoal
                  rounded-[16px]
                  p-8
                  shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                "
              >

                {/* Step number (subtle, not decorative UI) */}
                <div className="text-sm text-graphite mb-4">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 text-hp-primary">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-ink mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-charcoal leading-relaxed">
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
 
