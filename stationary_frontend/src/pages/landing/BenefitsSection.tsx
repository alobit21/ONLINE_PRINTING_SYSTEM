
import { Check } from 'lucide-react';
import customerApp from '../../assets/customer-app.png';
import shopOwner from '../../assets/shop-owner.png';

export const BenefitsSection = () => {
  const customerBenefits = [
    'Lower printing costs on repeated jobs',
    'Reduced waiting time at print shops',
    '24/7 document submission',
    'Automatic print optimization',
    'Nearby shop discovery',
    'Pickup scheduling support',
  ];

  const shopBenefits = [
    'Improved job distribution efficiency',
    'Reduced manual queue management',
    'Digital order intake system',
    'Usage and demand visibility',
    'Faster payment processing',
    'Simple shop onboarding tools',
  ];

  return (
    <section className="bg-canvas py-20 lg:py-[80px] transition-colors duration-300">
      <div className="section-container">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-hp-primary mb-4">
            Why Stationary
          </div>

          <h2 className="text-[56px] font-medium leading-none text-ink mb-6">
            Built for users and print shops
          </h2>

          <p className="text-lg text-charcoal leading-relaxed">
            A balanced system that improves the printing experience
            for both customers and service providers.
          </p>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* CUSTOMER */}
          <div className="flex flex-col gap-6">

            <h3 className="text-[28px] font-medium text-ink">
              For Customers
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              {customerBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3">

                  <div className="text-hp-primary mt-1">
                    <Check size={14} />
                  </div>

                  <span className="text-sm text-charcoal leading-relaxed">
                    {item}
                  </span>

                </div>
              ))}

            </div>

            <div className="rounded-[16px] border border-fog dark:border-charcoal overflow-hidden">
              <img
                src={customerApp}
                alt="Customer app preview"
                className="w-full h-64 object-cover"
              />
            </div>

          </div>

          {/* SHOP */}
          <div className="flex flex-col gap-6">

            <h3 className="text-[28px] font-medium text-ink">
              For Print Shops
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              {shopBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3">

                  <div className="text-hp-primary mt-1">
                    <Check size={14} />
                  </div>

                  <span className="text-sm text-charcoal leading-relaxed">
                    {item}
                  </span>

                </div>
              ))}

            </div>

            <div className="rounded-[16px] border border-fog dark:border-charcoal overflow-hidden">
              <img
                src={shopOwner}
                alt="Shop dashboard preview"
                className="w-full h-64 object-cover"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

