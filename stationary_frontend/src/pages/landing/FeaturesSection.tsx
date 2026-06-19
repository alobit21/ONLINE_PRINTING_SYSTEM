 
import { User, Store, ShieldCheck, History, MousePointer2, TrendingUp, Users, PieChart } from 'lucide-react';
import { useState } from 'react';

export const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'shop'>('customer');

  const customerFeatures = [
    {
      icon: MousePointer2,
      title: 'One-click upload',
      description: 'Upload documents instantly with support for multiple formats.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure storage',
      description: 'Encrypted document handling and protected transactions.',
    },
    {
      icon: History,
      title: 'Smart reordering',
      description: 'Quick access to previously printed documents.',
    },
    {
      icon: TrendingUp,
      title: 'Cost optimization',
      description: 'Suggestions to reduce printing costs automatically.',
    },
  ];

  const shopFeatures = [
    {
      icon: PieChart,
      title: 'Job management',
      description: 'Organize and prioritize incoming print jobs efficiently.',
    },
    {
      icon: Users,
      title: 'Demand insights',
      description: 'Understand peak usage and customer demand patterns.',
    },
    {
      icon: TrendingUp,
      title: 'Growth tools',
      description: 'Reach more customers in your local area.',
    },
    {
      icon: Store,
      title: 'Online storefront',
      description: 'Simple digital presence for your print shop.',
    },
  ];

  const features = activeTab === 'customer' ? customerFeatures : shopFeatures;

  return (
    <section className="bg-canvas py-20 lg:py-[80px] transition-colors duration-300">
      <div className="section-container">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-hp-primary mb-4">
            Core ecosystem
          </div>

          <h2 className="text-[56px] font-medium leading-none text-ink mb-6">
            Features built for scale
          </h2>

          <p className="text-lg text-charcoal leading-relaxed">
            A unified platform connecting users and print shops through a single workflow system.
          </p>

          {/* SIMPLE TABS (NO ANIMATION) */}
          <div className="flex justify-center mt-10">

            <div className="inline-flex border border-fog dark:border-charcoal rounded-full overflow-hidden">

              <button
                onClick={() => setActiveTab('customer')}
                className={`
                  px-6 py-2 text-sm font-medium
                  ${activeTab === 'customer'
                    ? 'bg-ink text-canvas'
                    : 'bg-canvas text-charcoal'
                  }
                `}
              >
                For Customers
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className={`
                  px-6 py-2 text-sm font-medium border-l border-fog dark:border-charcoal
                  ${activeTab === 'shop'
                    ? 'bg-ink text-canvas'
                    : 'bg-canvas text-charcoal'
                  }
                `}
              >
                For Print Shops
              </button>

            </div>

          </div>

        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  bg-canvas
                  border
                  border-fog dark:border-charcoal
                  rounded-[16px]
                  p-8
                  shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
                "
              >

                <div className="text-hp-primary mb-6">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-medium text-ink mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-charcoal leading-relaxed">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
