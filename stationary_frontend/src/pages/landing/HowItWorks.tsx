 
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
    <section className="bg-[#ffffff] py-20 lg:py-[80px]">
      <div className="section-container">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-brand-600 mb-4">
            The Process
          </div>

          <h2 className="text-[56px] font-medium leading-none text-[#1a1a1a] mb-6">
            Simple workflow from upload to collection
          </h2>

          <p className="text-lg text-[#3d3d3d] leading-relaxed">
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
                  bg-white
                  border
                  border-[#e8e8e8]
                  rounded-2xl
                  p-8
                  shadow-[0_2px_8px_rgba(26,26,26,0.08)]
                "
              >

                {/* Step number (subtle, not decorative UI) */}
                <div className="text-sm text-[#636363] mb-4">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 text-brand-600">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#3d3d3d] leading-relaxed">
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
 
